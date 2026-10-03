import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <main className="container max-w-3xl py-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="mt-8 space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    </main>
  );
};

export default loading;
