"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

export type Team = {
  id: string;
  name: string;
  playerCount: number;
  region: string;
  country: string;
  players: number[];
};

type TeamContextType = {
  teams: Team[];
  addTeam: (team: Omit<Team, "id">) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (id: string) => void;
  isTeamNameUnique: (name: string, excludeId?: string) => boolean;
  getPlayerTeams: (playerId: number) => Team[];
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedTeams = localStorage.getItem("teams");
    if (storedTeams) setTeams(JSON.parse(storedTeams));
  }, []);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const isTeamNameUnique = (name: string, excludeId?: string) => {
    return !teams.some(
      (team) =>
        team.name.toLowerCase() === name.toLowerCase() && team.id !== excludeId
    );
  };

  const getPlayerTeams = (playerId: number) => {
    return teams.filter((team) => team.players.includes(playerId));
  };

  const addTeam = (team: Omit<Team, "id">) => {
    const newTeam = {
      ...team,
      id: crypto.randomUUID(),
      players: [],
    };
    setTeams([...teams, newTeam]);
  };

  const updateTeam = (updatedTeam: Team) => {
    setTeams(
      teams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
    );
  };

  const deleteTeam = (id: string) => {
    setTeams(teams.filter((team) => team.id !== id));
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        addTeam,
        updateTeam,
        deleteTeam,
        isTeamNameUnique,
        getPlayerTeams,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
}
