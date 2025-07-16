import { Button } from "@/components/ui/button";
import { Star, Github } from "lucide-react";

export function StarCTA() {
  const handleStarClick = () => {
    window.open("https://github.com/DimitrijeGlibic/cosmic-code-mates", "_blank");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleStarClick}
      className="group relative overflow-hidden border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/40 transition-cosmic animate-fadeIn"
      style={{ animationDelay: '0.3s' }}
    >
      <div className="flex items-center space-x-2">
        <Star className="w-4 h-4 text-primary group-hover:text-primary transition-colors" />
        <span className="text-sm font-medium">Star us</span>
        <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="absolute inset-0 bg-gradient-cosmic opacity-0 group-hover:opacity-20 transition-opacity" />
    </Button>
  );
}