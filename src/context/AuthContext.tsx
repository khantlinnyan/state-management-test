"use client";

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
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTeams = localStorage.getItem("teams");
    if (storedUser) setUser(storedUser);
    if (storedTeams) setTeams(JSON.parse(storedTeams));
  }, []);

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
    setTeams([]);
    localStorage.removeItem("user");
    localStorage.removeItem("teams");
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  const addTeam = (team: Team) => {
    const newTeams = [...teams, team];
    setTeams(newTeams);
    localStorage.setItem("teams", JSON.stringify(newTeams));
  };

  const updateTeam = (updatedTeam: Team) => {
    const newTeams = teams.map((team) =>
      team.id === updatedTeam.id ? updatedTeam : team
    );
    setTeams(newTeams);
    localStorage.setItem("teams", JSON.stringify(newTeams));
  };

  const deleteTeam = (id: number) => {
    const newTeams = teams.filter((team) => team.id !== id);
    setTeams(newTeams);
    localStorage.setItem("teams", JSON.stringify(newTeams));
  };

  return (
    <AuthContext.Provider
      value={{ user, teams, login, logout, addTeam, updateTeam, deleteTeam }}
    >
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
