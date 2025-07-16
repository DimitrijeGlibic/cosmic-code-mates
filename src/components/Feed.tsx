import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCard } from "@/components/UserCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { StarCTA } from "@/components/StarCTA";
import { useGitHub } from "@/lib/GitHubProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Rocket, LogOut, RefreshCw, Sparkles, Menu } from "lucide-react";

export function Feed() {
  const { user, developers, isLoading, logout, refreshDevelopers } = useGitHub();

  if (!user) {
    return null; // This shouldn't happen as the component is only rendered when authenticated
  }

  const handleRefresh = async () => {
    await refreshDevelopers();
  };

  const handleLogout = () => {
    logout();
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

              {/* Right - Controls */}
              <div className="flex items-center space-x-3">
                {/* Desktop Controls */}
                <div className="hidden md:flex items-center space-x-3">
                  <StarCTA />
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
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                  
                  {/* User Avatar */}
                  <div className="flex items-center space-x-2 pl-2 border-l border-border/50">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar_url} alt={user.name || user.login} />
                      <AvatarFallback>
                        {(user.name || user.login).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.name || user.login}</span>
                  </div>
                </div>

                {/* Mobile Menu */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72">
                    <div className="flex flex-col space-y-6 mt-8">
                      <div className="flex items-center space-x-3 pb-4 border-b">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar_url} alt={user.name || user.login} />
                          <AvatarFallback>
                            {(user.name || user.login).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold">{user.name || user.login}</span>
                          <span className="text-sm text-muted-foreground">@{user.login}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Theme</span>
                          <ThemeToggle />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Support us</span>
                          <StarCTA />
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start transition-cosmic"
                          onClick={handleRefresh}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                          )}
                          {isLoading ? "Scanning galaxy..." : "Refresh"}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-destructive hover:text-destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        {/* Feed content */}
        <main className="container mx-auto px-4 py-8">
          {developers.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">Your Developer Universe</h2>
                <p className="text-muted-foreground">
                  {developers.length} cosmic developers discovered based on your GitHub stars
                </p>
              </div>

              {developers.map((feedUser, index) => (
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