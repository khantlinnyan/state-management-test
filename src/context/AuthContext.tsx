"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

interface Team {
  id: number;
  name: string;
  playerCount: number;
  region: string;
  country: string;
  players: number[];
}

interface AuthContextType {
  user: string | null;
  teams: Team[];
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(storedUser);
  }, [user]);

  const login = async (username: string): Promise<boolean> => {
    try {
      localStorage.setItem("user", username);
      document.cookie = `user=${username}; path=/; max-age=${60 * 60 * 24 * 7}`; // 1 week
      setUser(username);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // Update your logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
