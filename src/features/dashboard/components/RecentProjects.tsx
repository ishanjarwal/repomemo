"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  Clock,
  FolderGit2,
  LayoutGrid,
  List,
  Lock,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/trpc/react";

export const RecentProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: projects,
    isPending,
    isRefetching,
  } = api.project.getProjects.useQuery();

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchQuery.trim()) return projects;
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
    );
  }, [projects, searchQuery]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            Recent Projects
          </CardTitle>
          <CardDescription className="text-xs">
            Search, manage, and query your indexed repositories
          </CardDescription>
        </div>

        {/* Controls: Search & View toggle */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pr-8 pl-8 text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 p-0.5"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <div className="border-border hidden items-center rounded-lg border p-0.5 sm:flex">
            <Button
              type="button"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("grid")}
              className="size-7"
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("list")}
              className="size-7"
            >
              <List className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Loading state */}
        {isPending && !isRefetching && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-2.5"
            }
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border-border flex flex-col justify-between space-y-3 rounded-xl border p-4"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="size-5 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state: No projects created yet */}
        {!isPending && projects && projects.length === 0 && (
          <Empty className="my-8 border border-dashed py-12">
            <EmptyMedia variant="icon">
              <FolderGit2 className="text-primary size-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No repositories connected</EmptyTitle>
              <EmptyDescription>
                Connect a GitHub repository to index code, generate summaries,
                and ask questions.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild className="gap-2">
                <Link href="/new-project">
                  <Plus className="size-4" />
                  <span>Connect Repository</span>
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}

        {/* Empty state: Search filter yielded no results */}
        {!isPending &&
          projects &&
          projects.length > 0 &&
          filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm font-medium">
                No projects match &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Try searching with a different term or clear the filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="mt-3 gap-1"
              >
                <X className="size-3.5" />
                <span>Clear search</span>
              </Button>
            </div>
          )}

        {/* Content: Projects list or grid */}
        {!isPending && filteredProjects.length > 0 && (
          <div>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/project/${project.id}`}
                    className="group border-border bg-card hover:bg-muted/40 hover:border-foreground/20 relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                            <FolderGit2 className="size-4" />
                          </div>
                          <h3 className="group-hover:text-primary line-clamp-1 text-sm leading-tight font-medium transition-colors">
                            {project.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {project.isPrivate ? (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-[10px] px-1.5 py-0 h-5"
                            >
                              <Lock className="size-2.5" />
                              Private
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-5"
                            >
                              Public
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                            Indexed
                          </Badge>
                        </div>
                      </div>

                      <div className="text-muted-foreground mt-4 flex items-center gap-1.5 text-xs">
                        <Clock className="size-3" />
                        <span>
                          {formatDistanceToNow(new Date(project.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
                      <span className="text-muted-foreground font-mono text-[11px]">
                        ID: {project.id.slice(0, 8)}...
                      </span>
                      <span className="text-primary flex items-center gap-1 text-xs font-medium transition-transform group-hover:translate-x-0.5">
                        <span>Open</span>
                        <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/project/${project.id}`}
                    className="group border-border bg-card hover:bg-muted/40 hover:border-foreground/20 flex items-center justify-between rounded-xl border p-3.5 transition-all duration-200 hover:shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                        <FolderGit2 className="size-4" />
                      </div>
                      <div>
                        <h3 className="group-hover:text-primary text-sm font-medium transition-colors">
                          {project.name}
                        </h3>
                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {formatDistanceToNow(new Date(project.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {project.isPrivate ? (
                        <Badge
                          variant="secondary"
                          className="hidden gap-1 text-[10px] sm:inline-flex"
                        >
                          <Lock className="size-2.5" />
                          Private
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="hidden text-[10px] sm:inline-flex"
                        >
                          Public
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="hidden text-[10px] sm:inline-flex"
                      >
                        Indexed
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="group-hover:text-primary transition-colors"
                      >
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
