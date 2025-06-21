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
  getPlayerTeam: (playerId: number) => Team[] | undefined;
  canAddPlayer: (teamId: string) => boolean;
  assignPlayerToTeam: (playerId: number, teamId: string) => void;
  removePlayerFromTeam: (playerId: number, teamId: string) => void;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => {
    const storedTeams = localStorage.getItem("teams");
    if (storedTeams) setTeams(JSON.parse(storedTeams));
  }, []);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const assignPlayerToTeam = (playerId: number, teamId: string) => {
    setTeams((prevTeams) => {
      return prevTeams.map((team) => {
        if (team.id === teamId) {
          if (!team.players.includes(playerId)) {
            return {
              ...team,
              players: [...team.players, playerId],
            };
          }
          return team;
        }
        return {
          ...team,
          players: team.players.filter((id) => id !== playerId),
        };
      });
    });
  };

  const isTeamNameUnique = (name: string, excludeId?: string) => {
    return !teams.some(
      (team) =>
        team?.name?.toLowerCase() === name.toLowerCase() &&
        team?.id !== excludeId
    );
  };

  const getPlayerTeam = (playerId: number) => {
    return teams.find((team) => team.players.includes(playerId));
  };

  const canAddPlayer = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team ? team.players.length < team.playerCount : false;
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
    setTeams((prev) =>
      prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t))
    );
  };

  const deleteTeam = (id: string) => {
    setTeams((prev) => prev.filter((team) => team.id !== id));
  };

  const removePlayerFromTeam = (playerId: number, teamId: string) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? { ...team, players: team.players.filter((id) => id !== playerId) }
          : team
      )
    );
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        addTeam,
        updateTeam,
        deleteTeam,
        isTeamNameUnique,
        getPlayerTeam,
        canAddPlayer,
        assignPlayerToTeam,
        removePlayerFromTeam,
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
