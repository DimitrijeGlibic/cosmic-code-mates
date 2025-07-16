import { useEffect, useState } from "react";
import { Homepage } from "@/components/Homepage";
import { Feed } from "@/components/Feed";
import { GitHubLogin } from "@/components/GitHubLogin";
import { useGitHub } from "@/lib/GitHubProvider";

const Index = () => {
  const { isAuthenticated, user, isLoading } = useGitHub();
  const [showLogin, setShowLogin] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-galaxy">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Connecting to the GitHub galaxy...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Feed />;
  }

  // Show GitHub login if not authenticated and user clicked login
  if (!isAuthenticated && showLogin) {
    return <GitHubLogin onSuccess={() => setShowLogin(false)} />;
  }

  // Show homepage if not authenticated
  if (!isAuthenticated) {
    return <Homepage onLogin={() => setShowLogin(true)} />;
  }
};

export default Index;
