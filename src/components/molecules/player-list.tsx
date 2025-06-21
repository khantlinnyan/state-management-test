"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import PlayerListSkeleton from "./player-list-skleton";
import { useTeam } from "@/context/TeamContext";
import { TeamSelectModal } from "./team-select-modal";

const fetchPlayers = async ({ pageParam = 1 }) => {
  const response = await fetch(
    `${process.env.NEXT_BASE_URL}?page=${pageParam}&per_page=10`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.NEXT_API_KEY}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch players");
  return response.json();
};

export function PlayerList() {
  const [selectedPlayer, setSelectedPlayer] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor,
    initialPageParam: 0,
  });

  const { teams } = useTeam();
  const parentRef = useRef<HTMLDivElement>(null);
  const allPlayers = data?.pages.flatMap((page) => page.data) || [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allPlayers.length + 1 : allPlayers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  const handleAddToTeam = (player: {
    id: number;
    first_name: string;
    last_name: string;
  }) => {
    setSelectedPlayer({
      id: player.id,
      name: `${player.first_name} ${player.last_name}`,
    });
  };

  const handleLoadMore = () => {
    fetchNextPage();
  };

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (
      lastItem &&
      lastItem.index >= allPlayers.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allPlayers.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  if (isPending && !isRefetching) return <PlayerListSkeleton />;
  if (isError)
    return <div className="text-destructive">Error loading players</div>;

  return (
    <div className="space-y-4">
      <div ref={parentRef} className="h-[600px] overflow-auto">
        <div
          className="relative w-full"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index > allPlayers.length - 1;
            const player = allPlayers[virtualRow.index];
            console.log(isLoaderRow);

            if (isLoaderRow) {
              return hasNextPage ? (
                <div
                  key="loading"
                  className="absolute top-0 left-0 w-full flex justify-center p-4"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More"}
                  </Button>
                </div>
              ) : null;
            }

            return (
              <PlayerRow
                key={`${player.id}-${virtualRow.index}`}
                player={player}
                virtualRow={virtualRow}
                onAddToTeam={handleAddToTeam}
              />
            );
          })}
        </div>
      </div>

      <TeamSelectModal
        open={!!selectedPlayer}
        onOpenChange={(open) => !open && setSelectedPlayer(null)}
        teams={teams}
        playerId={selectedPlayer?.id}
        playerName={selectedPlayer?.name}
      />
    </div>
  );
}

const PlayerRow = ({
  player,
  virtualRow,
  onAddToTeam,
}: {
  player: any;
  virtualRow: any;
  onAddToTeam: (player: any) => void;
}) => {
  const { getPlayerTeam, removePlayerFromTeam } = useTeam();
  const team = getPlayerTeam(player.id);

  return (
    <div
      className={`absolute rounded-2xl left-0 top-0 w-full p-2 hover:bg-muted/20`}
      style={{
        height: `${virtualRow.size}px`,
        transform: `translateY(${virtualRow.start}px)`,
      }}
    >
      <div className="flex items-center justify-between p-2 border rounded-lg">
        <div>
          <h3 className="font-medium">
            {player.first_name} {player.last_name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {player.team?.full_name || "No team"} - {player.position}
          </p>
        </div>
        <Button
          variant={team ? "destructive" : "default"}
          size="sm"
          onClick={
            team
              ? () => removePlayerFromTeam(player.id, team?.id)
              : () => onAddToTeam(player)
          }
        >
          {team ? `Remove from ${team?.name}` : "Add Team"}
        </Button>
      </div>
    </div>
  );
};
