// GitHub API types
export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  location?: string;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
  topics: string[];
  forks_count: number;
}

export interface StackmatesUser {
  username: string;
  avatar: string;
  sharedRepos: number;
  personality: string;
  githubUrl: string;
  bio?: string;
  languages?: string[];
  topRepos?: GitHubRepo[];
}

// GitHub API service class
class GitHubAPI {
  private baseURL = 'https://api.github.com';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentUser(): Promise<GitHubUser> {
    return this.request<GitHubUser>('/user');
  }

  async getUserStarredRepos(username: string, maxRepos = 500): Promise<GitHubRepo[]> {
    const allRepos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100; // GitHub's max per page
    
    while (allRepos.length < maxRepos) {
      try {
        const repos = await this.request<GitHubRepo[]>(`/users/${username}/starred?per_page=${perPage}&page=${page}`);
        
        if (repos.length === 0) {
          // No more repos to fetch
          break;
        }
        
        allRepos.push(...repos);
        page++;
        
        // If we got less than perPage, we've reached the end
        if (repos.length < perPage) {
          break;
        }
      } catch (error) {
        console.warn(`Failed to fetch page ${page} of starred repos for ${username}:`, error);
        break;
      }
    }
    
    return allRepos.slice(0, maxRepos);
  }

  async getUser(username: string): Promise<GitHubUser> {
    return this.request<GitHubUser>(`/users/${username}`);
  }

  async getUserRepos(username: string, perPage = 30): Promise<GitHubRepo[]> {
    return this.request<GitHubRepo[]>(`/users/${username}/repos?per_page=${perPage}&sort=stars&direction=desc`);
  }

  async searchUsers(query: string, perPage = 10): Promise<{ items: GitHubUser[] }> {
    return this.request<{ items: GitHubUser[] }>(`/search/users?q=${encodeURIComponent(query)}&per_page=${perPage}`);
  }

  // Find users who starred similar repositories
  async findSimilarDevelopers(userStarredRepos: GitHubRepo[], maxUsers = 50): Promise<StackmatesUser[]> {
    const similarUsers: Map<string, { user: GitHubUser; sharedCount: number; sharedRepos: GitHubRepo[] }> = new Map();

    // Take top 10 most starred repos to find similar users
    const topRepos = userStarredRepos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10);

    for (const repo of topRepos) {
      try {
        // Get stargazers for this repo (limited to avoid rate limits)
        const stargazers = await this.request<GitHubUser[]>(`/repos/${repo.full_name}/stargazers?per_page=30`);
        
        for (const stargazer of stargazers) {
          if (!similarUsers.has(stargazer.login)) {
            similarUsers.set(stargazer.login, {
              user: stargazer,
              sharedCount: 1,
              sharedRepos: [repo]
            });
          } else {
            const existing = similarUsers.get(stargazer.login)!;
            existing.sharedCount++;
            existing.sharedRepos.push(repo);
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch stargazers for ${repo.full_name}:`, error);
      }
    }

    // Convert to StackmatesUser and sort by shared repos count
    const result: StackmatesUser[] = Array.from(similarUsers.values())
      .filter(item => item.sharedCount >= 2) // At least 2 shared repos
      .sort((a, b) => b.sharedCount - a.sharedCount)
      .slice(0, maxUsers)
      .map(item => ({
        username: item.user.login,
        avatar: item.user.avatar_url,
        sharedRepos: item.sharedCount,
        personality: this.generatePersonality(item.user, item.sharedRepos),
        githubUrl: item.user.html_url,
        bio: item.user.name,
        languages: this.extractLanguages(item.sharedRepos),
        topRepos: item.sharedRepos.slice(0, 3)
      }));

    return result;
  }

  private generatePersonality(user: GitHubUser, repos: GitHubRepo[]): string {
    const languages = this.extractLanguages(repos);
    const topics = repos.flatMap(r => r.topics || []);
    
    const personalities = [
      `${languages[0]} wizard crafting digital spells across the coding cosmos ✨`,
      `Open source astronaut exploring the ${languages[0]} galaxy 🚀`,
      `Code poet writing elegant ${languages[0]} verses in the GitHub universe 📚`,
      `Digital architect building ${topics[0] || 'amazing'} solutions among the stars ⭐`,
      `Cosmic developer navigating the ${languages[0]} constellation with style 🌌`,
      `Binary bard composing ${languages[0]} symphonies in the void of space 🎵`,
      `Quantum coder entangled with ${topics[0] || languages[0]} particles 🔬`,
      `Stellar engineer constructing ${languages[0]} nebulae of pure logic ⚡`
    ];

    return personalities[Math.floor(Math.random() * personalities.length)];
  }

  private extractLanguages(repos: GitHubRepo[]): string[] {
    const languageCounts: Record<string, number> = {};
    
    repos.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    return Object.entries(languageCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([lang]) => lang)
      .slice(0, 3);
  }
}

export const githubAPI = new GitHubAPI();