import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Github, Key, ExternalLink, AlertCircle } from "lucide-react";
import { useGitHub } from "@/lib/GitHubProvider";

interface GitHubLoginProps {
  onSuccess: () => void;
}

export function GitHubLogin({ onSuccess }: GitHubLoginProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useGitHub();

  const handleLogin = async () => {
    if (!token.trim()) {
      setError("Please enter your GitHub Personal Access Token");
      return;
    }

    setError("");
    try {
      await login(token.trim());
      onSuccess();
    } catch (err) {
      setError("Authentication failed. Please check your token and try again.");
    }
  };

  const handleTokenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    setError("");
  };

  const openGitHubTokenPage = () => {
    window.open("https://github.com/settings/tokens/new?scopes=read:user,public_repo&description=Stackmates%20App", "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-galaxy relative">
      {/* Starfield */}
      <div className="starfield opacity-30"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-cosmic bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-cosmic flex items-center justify-center mx-auto shadow-glow">
              <Github className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Connect to GitHub</CardTitle>
            <CardDescription>
              Enter your GitHub Personal Access Token to discover your dev twins
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Instructions */}
            <Alert className="border-primary/20 bg-primary/5">
              <Key className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Need a token?</strong> Create a Personal Access Token with 'read:user' and 'public_repo' scopes.
              </AlertDescription>
            </Alert>

            {/* Token input */}
            <div className="space-y-2">
              <Label htmlFor="token">Personal Access Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxx"
                value={token}
                onChange={handleTokenInput}
                className="font-mono text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {/* Error message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <Button 
                variant="cosmic" 
                className="w-full" 
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4 mr-2" />
                    Connect GitHub Account
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={openGitHubTokenPage}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Create Personal Access Token
              </Button>
            </div>

            {/* Help text */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Your token is stored locally and never shared.</p>
              <p className="mt-1">We only access your public repositories and profile.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}