"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Team, useTeam } from "@/context/TeamContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayerList } from "@/components/molecules/player-list";
import { TeamFormModal } from "@/components/molecules/team-form-modal";
import { TeamDeleteModal } from "@/components/molecules/team-delete-modal";

export default function Home() {
  const { user, logout } = useAuth();
  const { teams, addTeam, updateTeam, deleteTeam } = useTeam();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  console.log(selectedTeam);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showPlayersForTeam, setShowPlayersForTeam] = useState<string | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {user}!</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Teams</h2>
            <Button
              onClick={() => {
                setSelectedTeam(null);
                setShowTeamModal(true);
              }}
            >
              Create Team
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>
                    {team.region}, {team.country}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() =>
                        setShowPlayersForTeam(
                          showPlayersForTeam === team.id ? null : team.id
                        )
                      }
                    >
                      {team.players.length}/{team.playerCount}
                    </Button>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowTeamModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Players</h2>
          <PlayerList />
        </div>
      </div>

      <TeamDeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        team={selectedTeam}
        onDelete={deleteTeam}
      />
      <TeamFormModal
        open={showTeamModal}
        onOpenChange={setShowTeamModal}
        team={selectedTeam}
        onSave={selectedTeam ? updateTeam : addTeam}
      />
    </div>
  );
}
