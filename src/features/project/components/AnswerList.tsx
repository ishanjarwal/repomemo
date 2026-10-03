import { ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { api } from "@/lib/trpc/react";
import { useSearchParams } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import Answer from "./Answer";

const AnswerList = ({ projectId }: { projectId: string }) => {
  const searchParams = useSearchParams();
  const answerId = searchParams.get("answerId");

  const updateSearchParams = useUpdateSearchParams();

  const { data, isPending, isSuccess, fetchNextPage, hasNextPage } =
    api.project.getAnswers.useInfiniteQuery(
      { projectId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const answers = data?.pages.flatMap((page) => page.answers) ?? [];

  return (
    <div className="flex w-full flex-col">
      {isPending && (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {isSuccess && (
        <>
          <Answer
            id={answerId}
            onClose={() => {
              updateSearchParams({ answerId: undefined });
            }}
          />

          <InfiniteScroll
            className="p-1"
            dataLength={answers.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div className="flex items-center justify-center py-4">
                <Loader2 className="size-8 animate-spin" />
              </div>
            }
            endMessage={
              <div className="flex items-center justify-center py-4">
                <p className="text-muted-foreground text-center text-xs">
                  {answers.length === 0 ? "No Answers" : "All answers loaded."}
                </p>
              </div>
            }
            scrollThreshold={0.8}
          >
            {answers.map((answer, index) => (
              <div key={answer.id}>
                <Button
                  onClick={() => updateSearchParams({ answerId: answer.id })}
                  variant="ghost"
                  className="hover:bg-muted/50 h-auto w-full justify-between gap-6 rounded-none px-4 py-4 text-left"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h3 className="truncate text-sm font-medium">
                      {answer.title}
                    </h3>

                    <p className="text-muted-foreground line-clamp-2 text-sm leading-6 font-normal">
                      {answer.answer}
                    </p>
                  </div>

                  <ChevronRight className="text-muted-foreground size-4 shrink-0" />
                </Button>
                {index < answers.length - 1 && <Separator />}
              </div>
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
};

export default AnswerList;
