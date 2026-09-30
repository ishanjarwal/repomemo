import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, FileCode2, Sparkles, X } from "lucide-react";

import CodeBlock from "@/components/common/CodeBlock";

import Markdown from "@/components/common/Markdown";
import { api } from "@/lib/trpc/react";
import "@/styles/markdown.styles.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useScrollToComponent } from "@/hooks/use-scroll-to-component";
import { useRef, useState } from "react";

const Answer = ({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) => {
  const { data: answer, isPending } = api.project.getAnswer.useQuery(
    { id: id! },
    { enabled: !!id },
  );

  const sourcesSectionRef = useRef<HTMLElement>(null);
  const scrollToComponent = useScrollToComponent();

  return (
    <Sheet
      open={!!id}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent
        side="right"
        className="border-border/60 bg-background flex w-full! max-w-full! flex-col gap-0 overflow-x-hidden overflow-y-auto! border-l p-0 shadow-2xl sm:max-w-4xl!"
      >
        {isPending && <AnswerSkeleton />}

        {answer && (
          <>
            {/* Header */}
            <SheetHeader className="border-border/60 bg-background sticky top-0 z-1 border-b px-6 py-6">
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/15 gap-1.5 rounded-full"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      AI Generated
                    </Badge>

                    <Badge
                      variant={"outline"}
                      onClick={() => {
                        scrollToComponent(sourcesSectionRef);
                      }}
                      className="text-muted-foreground hover:text-primary cursor-pointer text-xs"
                    >
                      {answer.sources.length}{" "}
                      {answer.sources.length === 1 ? "source" : "sources"}
                    </Badge>
                  </div>
                  <Button
                    onClick={onClose}
                    variant={"ghost"}
                    className="rounded-full"
                  >
                    <X />
                  </Button>
                </div>

                <SheetTitle className="text-xl font-semibold tracking-tight">
                  {answer.question}
                </SheetTitle>

                <SheetDescription className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                  This is an AI-generated response based on the project context
                  and referenced source files. AI can make mistakes.
                </SheetDescription>
              </div>
            </SheetHeader>

            {/* Content */}
            <div className="flex flex-col">
              {/* Answer */}
              <div className="p-6">
                <div className="markdown">
                  <Markdown>{answer.answer}</Markdown>
                </div>
              </div>

              <Separator />

              {/* Sources */}
              <section
                ref={sourcesSectionRef}
                className="bg-muted/20 min-h-[60vh]"
              >
                <div className="px-6 pt-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight">
                        Sources
                      </h3>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Files used to generate this answer
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className="rounded-full px-2.5 py-1 text-xs"
                    >
                      {answer.sources.length} files
                    </Badge>
                  </div>

                  {answer.sources.length > 0 ? (
                    <SourceTabs sources={answer.sources} />
                  ) : (
                    <div className="border-border bg-background/50 mb-6 rounded-xl border border-dashed px-6 py-8 text-center">
                      <FileCode2 className="text-muted-foreground mx-auto mb-2 h-5 w-5" />

                      <p className="text-sm font-medium">
                        No sources available
                      </p>

                      <p className="text-muted-foreground mt-1 text-xs">
                        This answer was generated without referenced files.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Answer;

const SourceTabs = ({
  sources,
}: {
  sources: { source: string; contents: string | null }[];
}) => {
  const [active, setActive] = useState(sources[0].source);
  return (
    <Tabs
      value={active}
      onValueChange={(val: string) => {
        setActive(val);
      }}
      className="w-full"
    >
      {/* Source tabs */}
      <div className="overflow-x-auto pb-1">
        <TabsList className="border-border/60 bg-background/80 h-auto! w-max min-w-full justify-start gap-1 rounded-xl border p-1 shadow-sm">
          {sources.map((source) => (
            <TabsTrigger
              key={source.source}
              value={source.source}
              className="group data-[state=active]:bg-muted data-[state=active]:text-foreground flex h-auto items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all data-[state=active]:shadow-sm"
            >
              <FileCode2 className="text-muted-foreground group-data-[state=active]:text-primary h-3.5 w-3.5" />

              <span>{source.source}</span>

              <ChevronRight className="h-3 w-3 opacity-0 transition-opacity group-data-[state=active]:opacity-50" />
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Active source */}
      {sources.map((source) => (
        <TabsContent
          key={source.source}
          value={source.source}
          className="mt-4 pb-6"
        >
          <div>
            <CodeBlock code={source.contents || ""} filename={source.source} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export function AnswerSkeleton() {
  return (
    <div className="text-foreground bg-background min-h-screen">
      {/* Header */}
      <div className="border-border/50 border-b px-7 py-6">
        <div className="mb-6 flex items-center gap-3">
          {/* AI Generated + source count */}
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>

        {/* Question */}
        <Skeleton className="h-8 w-[70%] max-w-4xl rounded-md" />
      </div>

      {/* Answer */}
      <div className="border-border/50 border-b px-7 py-7">
        <div className="max-w-5xl space-y-3">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-[92%] rounded-md" />
          <Skeleton className="h-5 w-[65%] rounded-md" />
        </div>
      </div>

      {/* Sources */}
      <div className="bg-muted/30 px-7 py-7">
        {/* Sources heading */}
        <div className="mb-6 flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-4 w-52 rounded-md" />
          </div>

          {/* File count */}
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>

        {/* Source tabs */}
        <div className="border-border/40 bg-background mb-10 flex h-14.5 items-center gap-1 overflow-hidden rounded-2xl border p-1">
          {/* Active source */}
          <div className="border-border/60 flex h-full min-w-[32%] items-center gap-3 rounded-xl border px-5">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="ml-auto h-4 w-4 rounded-full" />
          </div>

          {/* Source 2 */}
          <div className="flex h-full min-w-[32%] items-center gap-3 px-5">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>

          {/* Source 3 */}
          <div className="flex h-full min-w-[32%] items-center gap-3 px-5">
            <Skeleton className="h-5 w-5 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        </div>

        {/* Source content card */}
        <div className="border-border/50 bg-card overflow-hidden rounded-2xl border">
          {/* Card header */}
          <div className="border-border/50 flex h-16 items-center justify-between border-b px-7">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>

            {/* Copy button */}
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>

          {/* Content */}
          <div className="px-8 py-9">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-[96%] rounded-md" />
              <Skeleton className="h-4 w-[91%] rounded-md" />
              <Skeleton className="h-4 w-[84%] rounded-md" />
              <Skeleton className="h-4 w-[72%] rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
