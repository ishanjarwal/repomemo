import { format, formatDistanceToNow } from "date-fns";
import { ExternalLink, GitCommitHorizontal } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import CommitLogSkeleton from "./CommitLogSkeleton";

const commits = [
  {
    id: "a91f2c4",
    author: {
      name: "Elliott Chong",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    message: "Update README.md",
    summary:
      "Added a test change to the README file and refreshed the project documentation.",
    date: new Date("2025-08-21T14:32:00"),
    url: "https://github.com/example/repo/commit/a91f2c4",
  },
  {
    id: "b72d8e1",
    author: {
      name: "Elliott Chong",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    message: "Merge pull request #25 from nicolello-dev/main",
    summary:
      "Merged the latest homepage typography improvements from the main development branch.",
    date: new Date("2025-08-18T11:14:00"),
    url: "https://github.com/example/repo/commit/b72d8e1",
  },
  {
    id: "c38a7f6",
    author: {
      name: "Nicola Migone",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    message: "Update two typos",
    summary:
      "Corrected two small copy issues in the page description and improved the surrounding text.",
    date: new Date("2025-08-15T16:48:00"),
    url: "https://github.com/example/repo/commit/c38a7f6",
  },
  {
    id: "d51e9b3",
    author: {
      name: "Elliott Chong",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    message: "Merge pull request #20 from goudete/update-readme",
    summary:
      "Merged a comprehensive README update covering the project overview, technologies, and installation.",
    date: new Date("2025-08-12T09:26:00"),
    url: "https://github.com/example/repo/commit/d51e9b3",
  },
];

const CommitLog = () => {
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

      <CommitLogSkeleton />

      <div className="border-border relative ml-3 border-l">
        {commits.map((commit, index) => (
          <div key={commit.id} className="group relative pb-8 pl-8 last:pb-0">
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
                        src={commit.author.avatar}
                        alt={commit.author.name}
                      />
                      <AvatarFallback>
                        {commit.author.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {commit.author.name}
                      </p>

                      <p
                        className="text-muted-foreground text-xs"
                        title={format(commit.date, "PPpp")}
                      >
                        {formatDistanceToNow(commit.date, {
                          addSuffix: true,
                        })}
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

                <div className="mt-5">
                  <h3 className="text-sm leading-6 font-semibold tracking-tight">
                    {commit.message}
                  </h3>

                  <div className="mt-3">
                    <p className="text-muted-foreground mt-1 text-sm leading-6">
                      {commit.summary}
                    </p>
                  </div>
                </div>

                <div className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
                  <code className="bg-muted rounded-md px-1.5 py-0.5 font-mono">
                    {commit.id}
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
    </section>
  );
};

export default CommitLog;
