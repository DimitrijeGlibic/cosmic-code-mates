import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCard } from "@/components/UserCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Github, Rocket, LogOut, RefreshCw, Sparkles } from "lucide-react";

interface FeedProps {
  user: { username: string; avatar: string };
  onLogout: () => void;
}

// Mock data for demonstration
const mockUsers = [
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
  },
  {
    username: "gaearon",
    avatar: "https://github.com/gaearon.png",
    sharedRepos: 23,
    personality: "React wizard conjuring user interfaces from the quantum realm of JSX and hooks 🪄⚛️",
    githubUrl: "https://github.com/gaearon"
  },
  {
    username: "sindresorhus",
    avatar: "https://github.com/sindresorhus.png",
    sharedRepos: 18,
    personality: "Unicorn-powered developer crafting delightful tools across the npm constellation 🦄🌟",
    githubUrl: "https://github.com/sindresorhus"
  },
  {
    username: "addyosmani",
    avatar: "https://github.com/addyosmani.png",
    sharedRepos: 31,
    personality: "Performance astronaut optimizing web experiences across infinite browser dimensions 🚀📊",
    githubUrl: "https://github.com/addyosmani"
  }
];

export function Feed({ user, onLogout }: FeedProps) {
  const [users, setUsers] = useState(mockUsers);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUsers([...mockUsers].sort(() => Math.random() - 0.5)); // Shuffle for demo
    setIsLoading(false);
  };

  const EmptyState = () => (
    <div className="text-center py-20 space-y-6 animate-fadeIn">
      <div className="w-20 h-20 rounded-full bg-gradient-cosmic/20 flex items-center justify-center mx-auto animate-float">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">
          Looks like you're the only dev in this galaxy... 👽
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Don't worry! The universe is vast and full of amazing developers. 
          Try refreshing to discover new connections.
        </p>
      </div>
      <Button variant="cosmic" onClick={handleRefresh} disabled={isLoading}>
        {isLoading ? (
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4 mr-2" />
        )}
        {isLoading ? "Scanning galaxy..." : "Explore the cosmos"}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-galaxy relative">
      {/* Subtle starfield */}
      <div className="starfield opacity-30"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-cosmic flex items-center justify-center shadow-glow">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
                  Stackmates
                </span>
              </div>

              {/* Center - Welcome message */}
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-muted-foreground">Welcome,</span>
                <span className="font-semibold">{user.username}</span>
                <span className="text-xl">👋</span>
              </div>

              {/* Right - Controls */}
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="transition-cosmic"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Feed content */}
        <main className="container mx-auto px-4 py-8">
          {users.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">Your Developer Universe</h2>
                <p className="text-muted-foreground">
                  {users.length} cosmic developers discovered based on your GitHub stars
                </p>
              </div>

              {users.map((feedUser, index) => (
                <div 
                  key={feedUser.username}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <UserCard user={feedUser} />
                </div>
              ))}

              {/* Load more button */}
              <div className="text-center pt-8">
                <Button variant="outline" className="transition-cosmic hover:shadow-glow">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Discover more developers
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}