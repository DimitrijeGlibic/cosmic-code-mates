import { useState } from "react";
import { Homepage } from "@/components/Homepage";
import { Feed } from "@/components/Feed";

// Mock user data for demo
const mockUser = {
  username: "dimitrijeglibic",
  avatar: "https://github.com/dimitrijeglibic.png"
};

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // In a real app, this would redirect to GitHub OAuth
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <Feed user={mockUser} onLogout={handleLogout} />;
  }

  return <Homepage onLogin={handleLogin} />;
};

export default Index;
