import { Skeleton } from "../ui/skeleton";

const PlayerListSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 10 }).map((_, i) => (
      <Skeleton key={i} className="h-20 w-full" />
    ))}
  </div>
);
export default PlayerListSkeleton;
