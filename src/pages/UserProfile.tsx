import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  ArrowLeft, 
  Star, 
  GitFork, 
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  Book
} from "lucide-react";
import { githubAPI } from "@/lib/github";
import { GitHubUser, GitHubRepo } from "@/lib/github";
import { useGitHub } from "@/lib/GitHubProvider";

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useGitHub();
  const [profileUser, setProfileUser] = useState<GitHubUser | null>(null);
  const [sharedRepos, setSharedRepos] = useState<GitHubRepo[]>([]);
  const [userRepos, setUserRepos] = useState<GitHubRepo[]>([]);
  const [currentUserStarred, setCurrentUserStarred] = useState<GitHubRepo[]>([]);
  const [profileUserStarred, setProfileUserStarred] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username || !currentUser) return;
      
      setIsLoading(true);
      try {
        console.log('Fetching user data for:', username);
        
        // Fetch all data in parallel for better performance
        const [user, repos, currentUserStarred, userStarred] = await Promise.all([
          githubAPI.getUser(username),
          githubAPI.getUserRepos(username, 50),
          githubAPI.getUserStarredRepos(currentUser.login),
          githubAPI.getUserStarredRepos(username)
        ]);

        console.log('All data fetched successfully');
        console.log('User repos fetched:', repos.length);
        console.log('Current user starred repos:', currentUserStarred.length);
        console.log('Profile user starred repos:', userStarred.length);
        
        // Set the data
        setProfileUser(user);
        setUserRepos(repos);
        setCurrentUserStarred(currentUserStarred);
        setProfileUserStarred(userStarred);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username, currentUser]);

  // Separate useEffect for calculating shared repos
  useEffect(() => {
    // Early return if data not ready
    if (!currentUserStarred.length || !profileUserStarred.length) {
      console.log('Shared repos calculation skipped - data not ready');
      console.log('Current user starred length:', currentUserStarred.length);
      console.log('Profile user starred length:', profileUserStarred.length);
      return;
    }

    console.log('Calculating shared repos...');
    console.log('Sample current user starred repo IDs:', currentUserStarred.slice(0, 5).map(r => `${r.id}:${r.full_name}`));
    console.log('Sample profile user starred repo IDs:', profileUserStarred.slice(0, 5).map(r => `${r.id}:${r.full_name}`));
    
    // Find repositories that both users have starred - using full_name for comparison
    const shared = currentUserStarred.filter(starredRepo =>
      profileUserStarred.some(userRepo => userRepo.full_name === starredRepo.full_name)
    );
    
    console.log('Shared starred repos:', shared.length);
    console.log('Shared repos details:', shared.map(r => `${r.id}:${r.full_name}`));
    setSharedRepos(shared);
  }, [currentUserStarred, profileUserStarred]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cosmic opacity-30" />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cosmic opacity-30" />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold">User not found</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 bg-gradient-cosmic opacity-30" />
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* User Profile Header */}
          <Card className="shadow-card bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                <Avatar className="w-32 h-32 shadow-glow animate-float">
                  <AvatarImage src={profileUser.avatar_url} alt={profileUser.login} />
                  <AvatarFallback className="bg-gradient-cosmic text-white font-bold text-2xl">
                    {profileUser.login.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">{profileUser.name || profileUser.login}</h1>
                    <p className="text-xl font-mono text-muted-foreground">@{profileUser.login}</p>
                  </div>

                  {profileUser.bio && (
                    <p className="text-muted-foreground leading-relaxed">{profileUser.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {profileUser.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profileUser.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(profileUser.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {profileUser.followers} followers
                    </div>
                    <div className="flex items-center gap-1">
                      <Book className="w-4 h-4" />
                      {profileUser.public_repos} public repos
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="github"
                      onClick={() => window.open(profileUser.html_url, '_blank')}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View GitHub Profile
                    </Button>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-primary" />
                      {sharedRepos.length} repos in common
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shared Repositories */}
          {sharedRepos.length > 0 && (
            <Card className="shadow-card bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Shared Starred Repositories ({sharedRepos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {sharedRepos.slice(0, 10).map((repo) => (
                    <div key={repo.id} className="p-4 border border-border/50 rounded-lg bg-muted/30">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{repo.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(repo.html_url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                          {repo.description && (
                            <p className="text-muted-foreground mb-3">{repo.description}</p>
                          )}
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            {repo.language && (
                              <Badge variant="outline" className="text-xs">
                                {repo.language}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {repo.stargazers_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="w-3 h-3" />
                              {repo.forks_count}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {sharedRepos.length > 10 && (
                  <div className="mt-4 text-center">
                    <p className="text-muted-foreground">
                      And {sharedRepos.length - 10} more shared repositories...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* User's Top Repositories */}
          <Card className="shadow-card bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5 text-primary" />
                Top Repositories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {userRepos
                  .sort((a, b) => b.stargazers_count - a.stargazers_count)
                  .slice(0, 6)
                  .map((repo) => (
                    <div key={repo.id} className="p-4 border border-border/50 rounded-lg bg-muted/30">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{repo.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(repo.html_url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                          {repo.description && (
                            <p className="text-muted-foreground mb-3 text-sm">{repo.description}</p>
                          )}
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            {repo.language && (
                              <Badge variant="outline" className="text-xs">
                                {repo.language}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {repo.stargazers_count}
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="w-3 h-3" />
                              {repo.forks_count}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
