"use client";
import { Team, useTeam } from "@/context/TeamContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TeamSelectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teams: Team[];
  playerId?: number;
  playerName?: string;
  onSelect?: (teamId: string) => void;
};

export const TeamSelectModal = ({
  open,
  onOpenChange,
  teams,
  playerId,
  playerName,
}: TeamSelectDialogProps) => {
  const { assignPlayerToTeam } = useTeam();
  const handleSelect = (teamId: string) => {
    assignPlayerToTeam(playerId, teamId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add {playerName} to Team</DialogTitle>
          <DialogDescription>
            Select a team from the list below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No teams found
                    </TableCell>
                  </TableRow>
                )}
                {teams?.map((team) => (
                  <TeamRow key={team.id} team={team} onSelect={handleSelect} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TeamRow = ({
  team,
  onSelect,
}: {
  team: Team;
  onSelect: (id: string) => void;
}) => {
  const { canAddPlayer } = useTeam();
  const canAdd = canAddPlayer(team.id);

  return (
    <TableRow>
      <TableCell>{team.name}</TableCell>
      <TableCell>
        {team.region}, {team.country}
      </TableCell>
      <TableCell>
        <span className={!canAdd ? "text-destructive" : ""}>
          {team.players.length}/{team.playerCount}
        </span>
      </TableCell>
      <TableCell>
        <Button size="sm" disabled={!canAdd} onClick={() => onSelect(team.id)}>
          {canAdd ? "Select" : "Full"}
        </Button>
      </TableCell>
    </TableRow>
  );
};
