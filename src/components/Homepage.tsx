import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Github, Star, Rocket, Users } from "lucide-react";
import heroGalaxy from "@/assets/hero-galaxy.jpg";

interface HomepageProps {
  onLogin: () => void;
}

export function Homepage({ onLogin }: HomepageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Starfield background */}
      <div className="starfield"></div>
      
      {/* Hero background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroGalaxy})` }}
      >
        <div className="absolute inset-0 bg-gradient-galaxy opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2 animate-fadeIn">
            <div className="w-10 h-10 rounded-lg bg-gradient-cosmic flex items-center justify-center shadow-glow">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
              Stackmates
            </span>
          </div>
          
          <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero text */}
            <div className="animate-fadeIn space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Find your{" "}
                <span className="bg-gradient-cosmic bg-clip-text text-transparent animate-glow">
                  dev twin
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                A social feed powered by your GitHub stars
              </p>
            </div>

            {/* CTA Button */}
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <Button 
                variant="hero" 
                size="lg"
                onClick={onLogin}
                className="text-xl px-12 py-6 h-auto"
              >
                <Github className="w-6 h-6 mr-3" />
                Login with GitHub
              </Button>
            </div>

            {/* Preview cards */}
            <div className="animate-fadeIn mt-16" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-2xl font-semibold mb-8 text-muted-foreground">
                Discover developers like you
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Mock user card 1 */}
                <Card className="shadow-card hover:shadow-cosmic transition-cosmic hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12 shadow-glow">
                        <AvatarImage src="https://github.com/octocat.png" />
                        <AvatarFallback>OC</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-semibold">@octocat</span>
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            <Star className="w-3 h-3 mr-1" />
                            42 repos in common
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic">
                          "A cosmic coder fluent in JavaScript and cat memes 🐱"
                        </p>
                        <Button variant="github" size="sm" className="w-full">
                          <Github className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mock user card 2 */}
                <Card className="shadow-card hover:shadow-cosmic transition-cosmic hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12 shadow-glow">
                        <AvatarImage src="https://github.com/torvalds.png" />
                        <AvatarFallback>LT</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-semibold">@torvalds</span>
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            <Star className="w-3 h-3 mr-1" />
                            7 repos in common
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground italic">
                          "Kernel architect sailing through the C cosmos ⚡"
                        </p>
                        <Button variant="github" size="sm" className="w-full">
                          <Github className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Features */}
            <div className="animate-fadeIn grid md:grid-cols-3 gap-8 mt-16" style={{ animationDelay: '0.6s' }}>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-cosmic/20 flex items-center justify-center mx-auto">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Star-Based Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with developers who share your interests
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-cosmic/20 flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get personality summaries and coding poetry
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gradient-cosmic/20 flex items-center justify-center mx-auto">
                  <Github className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">GitHub Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Built on top of your existing GitHub data
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}