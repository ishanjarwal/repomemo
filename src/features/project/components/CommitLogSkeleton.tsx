import { Skeleton } from "@/components/ui/skeleton";

const CommitLogSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-60 w-full rounded-xl" />
      <Skeleton className="h-60 w-full rounded-xl" />
      <Skeleton className="h-60 w-full rounded-xl" />
      <Skeleton className="h-60 w-full rounded-xl" />
    </div>
  );
};

export default CommitLogSkeleton;
