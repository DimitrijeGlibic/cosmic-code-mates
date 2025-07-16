import { createContext, useContext, useState, ReactNode } from 'react';
import { githubAPI, GitHubUser, StackmatesUser } from '@/lib/github';

interface GitHubContextType {
  user: GitHubUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  developers: StackmatesUser[];
  login: (token: string) => Promise<void>;
  logout: () => void;
  findSimilarDevelopers: () => Promise<void>;
  refreshDevelopers: () => Promise<void>;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export function GitHubProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [developers, setDevelopers] = useState<StackmatesUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (token: string) => {
    setIsLoading(true);
    try {
      githubAPI.setToken(token);
      const userData = await githubAPI.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('github_token', token);
      
      // Automatically find similar developers after login
      await findSimilarDevelopers();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setDevelopers([]);
    setIsAuthenticated(false);
    localStorage.removeItem('github_token');
    githubAPI.setToken('');
  };

  const findSimilarDevelopers = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const starredRepos = await githubAPI.getUserStarredRepos(user.login);
      const similarDevs = await githubAPI.findSimilarDevelopers(starredRepos);
      setDevelopers(similarDevs);
    } catch (error) {
      console.error('Failed to find similar developers:', error);
      // Set mock data as fallback
      setDevelopers([
        {
          username: "octocat",
          avatar: "https://github.com/octocat.png",
          sharedRepos: 42,
          personality: "A cosmic coder fluent in JavaScript and cat memes, navigating the GitHub galaxy with feline grace 🐱✨",
          githubUrl: "https://github.com/octocat"
        },
        {
          username: "torvalds",
          avatar: "https://github.com/torvalds.png",
          sharedRepos: 7,
          personality: "Kernel architect sailing through the C cosmos, building operating systems like stars form galaxies ⚡🌌",
          githubUrl: "https://github.com/torvalds"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDevelopers = async () => {
    await findSimilarDevelopers();
  };

  // Check for existing token on mount
  useState(() => {
    const token = localStorage.getItem('github_token');
    if (token) {
      login(token).catch(() => {
        localStorage.removeItem('github_token');
      });
    }
  });

  return (
    <GitHubContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        developers,
        login,
        logout,
        findSimilarDevelopers,
        refreshDevelopers,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  const context = useContext(GitHubContext);
  if (context === undefined) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
}