import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, Star, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  user: {
    username: string;
    avatar: string;
    sharedRepos: number;
    personality: string;
    githubUrl: string;
  };
}

export function UserCard({ user }: UserCardProps) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    window.open(user.githubUrl, '_blank');
  };

  const handleCardClick = () => {
    navigate(`/user/${user.username}`);
  };

  return (
    <Card 
      className="shadow-card hover:shadow-cosmic transition-cosmic hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border/50 animate-fadeIn cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16 shadow-glow animate-float">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-cosmic text-white font-bold">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-lg">@{user.username}</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
              
              <Badge variant="secondary" className="shadow-sm">
                <Star className="w-3 h-3 mr-1 text-primary" />
                {user.sharedRepos} repos in common
              </Badge>
            </div>

            <blockquote className="border-l-4 border-primary pl-4 py-2 bg-muted/30 rounded-r-lg">
              <p className="text-sm italic text-muted-foreground leading-relaxed">
                "{user.personality}"
              </p>
            </blockquote>

            <Button 
              variant="github" 
              size="sm" 
              className="w-full transition-cosmic hover:shadow-glow" 
              onClick={(e) => {
                e.stopPropagation();
                handleViewProfile();
              }}
            >
              <Github className="w-4 h-4 mr-2" />
              View GitHub Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}