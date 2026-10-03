import { Skeleton } from "@/components/ui/skeleton";

export const ProjectSkeleton = () => (
  <div className="mx-auto max-w-3xl space-y-4 pt-12">
    <div className="flex flex-col items-start space-y-2">
      <Skeleton className="h-6 w-50" />
      <Skeleton className="h-6 w-36" />
    </div>

    <div className="space-y-4">
      <Skeleton className="h-60 w-full rounded-xl" />

      <div className="flex justify-start space-x-2">
        <Skeleton className="h-8 w-36 rounded-full" />
        <Skeleton className="h-8 w-42 rounded-full" />
        <Skeleton className="h-8 w-40 rounded-full" />
      </div>
    </div>
  </div>
);
