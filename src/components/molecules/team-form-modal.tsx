// components/team-form-modal.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamFormSchema, TeamFormData } from "@/schema/team-form-schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTeam, Team } from "@/context/TeamContext";

export function TeamFormModal({
  open,
  onOpenChange,
  team,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: Team;
  onSave: (teamData: Team | Omit<Team, "id">) => void;
}) {
  const { isTeamNameUnique } = useTeam();

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: team || {
      name: team?.name || "",
      playerCount: team?.playerCount || 5,
      region: team?.region || "",
      country: team?.country || "",
    },
  });

  const onSubmit = (data: TeamFormData) => {
    if (team) {
      onSave({ ...team, ...data });
    } else {
      onSave(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{team ? "Edit Team" : "Create New Team"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={team?.name}
                      placeholder="Enter team name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {form.watch("name") &&
                    !isTeamNameUnique(form.watch("name"), team?.id) && (
                      <p className="text-red-500 text-sm">
                        Team name must be unique
                      </p>
                    )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="playerCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player Count</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={team?.playerCount}
                      type="number"
                      min="1"
                      max="15"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={team?.region}
                      placeholder="Enter region"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={team?.country}
                      placeholder="Enter country"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {team ? "Update Team" : "Create Team"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
