"use client";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLink,
  GitCommitHorizontal,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/trpc/react";
import ReadMoreArea from "@foxeian/react-read-more";
import CommitLogSkeleton from "./CommitLogSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";
import Markdown from "react-markdown";

const CommitLog = ({ id }: { id: string }) => {
  const { data, isPending, isSuccess, fetchNextPage, hasNextPage } =
    api.commit.getCommits.useInfiniteQuery(
      { id },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const commits = data?.pages.flatMap((page) => page.commits) ?? [];

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-muted/50 flex size-9 items-center justify-center rounded-xl border">
            <GitCommitHorizontal className="text-muted-foreground size-4" />
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Commit history
            </h2>
            <p className="text-muted-foreground text-sm">
              Recent changes and project activity
            </p>
          </div>
        </div>
      </div>

      {isPending && <CommitLogSkeleton />}

      {isSuccess && (
        <InfiniteScroll
          className="p-1"
          dataLength={commits.length}
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
                All commits loaded.
              </p>
            </div>
          }
          scrollThreshold={0.8}
        >
          <div className="relative ml-3 border-l">
            {commits.map((commit, index) => (
              <div
                key={commit.sha}
                className="group relative pb-8 pl-8 last:pb-0"
              >
                {/* Timeline node */}
                <div className="bg-background group-hover:border-primary/40 absolute top-0 -left-3 flex size-6 items-center justify-center rounded-full border shadow-sm transition-colors">
                  <div className="bg-muted-foreground group-hover:bg-primary size-2 rounded-full transition-colors" />
                </div>

                <Card className="bg-background group-hover:ring-primary/50 overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="size-9 border">
                          <AvatarImage
                            src={commit.committer.imageUrl}
                            alt={commit.committer.username}
                          />
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {commit.committer.name}
                          </p>

                          <p className="text-muted-foreground text-xs">
                            {commit.committedAt &&
                              formatDistanceToNow(
                                new Date(commit.committedAt),
                                {
                                  addSuffix: true,
                                },
                              )}
                          </p>
                        </div>
                      </div>

                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 rounded-md p-1.5 transition-colors"
                        aria-label={`View ${commit.message} on GitHub`}
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    </div>

                    <div className="mt-5 space-y-4">
                      <ReadMoreArea
                        className="" // classes styles of main div (tailwind)
                        expandLabel="Read more" // Expand Label
                        collapseLabel="Read less" // Collapse Label
                        textClassName="text-sm leading-6 font-semibold tracking-tight" // classes styles of text (tailwind)
                        buttonClassName="text-sm text-primary!" // classes styles of button (tailwind)
                        lettersLimit={250} // limit of letters (100 letters)
                      >
                        {commit.message}
                      </ReadMoreArea>

                      {/* <div className="space-y-2">
                        <Skeleton className="h-3 rounded-md" />
                        <Skeleton className="h-3 rounded-md" />
                        <Skeleton className="h-3 w-[35%] rounded-md" />
                      </div> */}

                      <div className="[&_code]:bg-accent text-muted-foreground mt-3 [&_code]:rounded-lg [&_code]:px-1 [&_code]:py-0.5 [&_li]:ms-4 [&_li]:list-disc">
                        <h3 className="mb-2 flex items-center space-x-0.5">
                          <Sparkles className="text-primary size-4" />
                          <span>AI Summary</span>
                        </h3>
                        <Markdown>{commit.aiSummary}</Markdown>
                      </div>
                    </div>

                    <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
                      <code className="bg-muted rounded-md px-1.5 py-0.5 font-mono">
                        {commit.sha.substring(0, 7)}
                      </code>

                      <span>·</span>

                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
                      >
                        View commit
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </section>
  );
};

export default CommitLog;
