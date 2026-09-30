"use client";

import {
  ArrowUp,
  Command,
  FileCode2,
  GitBranch,
  Loader2,
  Sparkles,
} from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/env";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { api } from "@/lib/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { QuestionSchema, QuestionValues } from "../schema";
import { toast } from "sonner";

interface QuestionBoxProps {
  projectId: string;
  repoName: string;
  ownerLogin: string;
  ownerAvatarUrl: string;
  branch?: string;
  disabled?: boolean;
}

export function QuestionBox({
  projectId,
  repoName,
  ownerAvatarUrl,
  ownerLogin,
  branch = "main",
  disabled = false,
}: QuestionBoxProps) {
  const updateSearchParams = useUpdateSearchParams();

  const apiUtils = api.useUtils();

  const questionMutation = api.project.askQuestion.useMutation({
    onSuccess(data) {
      updateSearchParams({ answerId: data });
      apiUtils.project.getAnswers.refetch();
    },
    onError(error) {
      toast.error(error.message);
    },
    retry: false,
  });

  const form = useForm<QuestionValues>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: { question: "" },
  });

  const values = form.watch();

  const submit = (values: QuestionValues) => {
    questionMutation.mutate({ ...values, projectId });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(submit)();
    }
  };

  const examplePrompts = [
    "How does authentication work?",
    "Explain the database architecture",
    "Where is the API rate limiting?",
  ];

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <div className="mx-auto w-full">
        <div className="relative">
          <div className="bg-primary pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 focus-within:opacity-10" />

          <div className="bg-background focus-within:border-primary relative overflow-hidden rounded-2xl border-2 shadow-md transition-all duration-300 focus-within:shadow-lg">
            <div className="px-4 py-3">
              <h1 className="font-semibold">Ask Anything</h1>
              <p className="text-muted-foreground text-xs">
                {env.NEXT_PUBLIC_APP_NAME} has knowledge of the codebase
              </p>
            </div>
            {/* Repository context */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                {ownerAvatarUrl ? (
                  <Avatar className="size-6">
                    <AvatarImage src={ownerAvatarUrl} />
                    <AvatarFallback>{ownerLogin[0]}</AvatarFallback>
                  </Avatar>
                ) : (
                  <span className="flex size-8 items-center justify-center">
                    <FaGithub />
                  </span>
                )}

                <div className="flex min-w-0 items-center gap-2 text-xs">
                  <Link
                    href={`https://github.com/${ownerLogin}/${repoName}`}
                    target="_blank"
                    className="text-foreground hover:text-primary truncate font-medium transition-colors"
                  >
                    {ownerLogin}/{repoName}
                  </Link>

                  <span className="text-muted-foreground">/</span>

                  <span className="text-muted-foreground flex shrink-0 items-center gap-1">
                    <GitBranch className="size-3" />
                    {branch}
                  </span>
                </div>
              </div>

              <div className="text-muted-foreground hidden items-center gap-2 text-xs sm:flex">
                <Sparkles className="text-primary size-3" />
                <span>Ask anything about this repo</span>
              </div>
            </div>

            {/* Prompt */}
            <div className="px-4 pt-4">
              <Controller
                name={"question"}
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    {fieldState.error && (
                      <p className="text-destructive text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                    <Textarea
                      {...field}
                      autoFocus={true}
                      onKeyDown={handleKeyDown}
                      disabled={disabled}
                      placeholder="Ask about the codebase..."
                      className="min-h-24 resize-none border-0 bg-transparent p-0 text-base leading-6 shadow-none focus-visible:ring-0 dark:bg-transparent"
                    />
                  </>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-3 pt-2 pb-3">
              <div className="flex items-center gap-1">
                {/* <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground size-8 rounded-md"
                >
                <Paperclip className="size-4" />
                <span className="sr-only">Add context</span>
                </Button>
                </TooltipTrigger>
                
                <TooltipContent>
                <p>Add context</p>
                </TooltipContent>
                </Tooltip>
                </TooltipProvider> */}

                <div className="text-muted-foreground hidden items-center gap-2 pl-2 text-xs sm:flex">
                  <FileCode2 className="size-4" />
                  <span>Repository context enabled</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-muted-foreground hidden items-center gap-1 text-xs sm:flex">
                  <kbd className="bg-muted flex size-6 items-center justify-center rounded-md border font-sans">
                    <Command className="size-3" />
                  </kbd>
                  <span>Enter</span>
                </div>

                <Button
                  type="submit"
                  disabled={!values.question || questionMutation.isPending}
                  size="icon"
                  className="size-9 rounded-md"
                >
                  {questionMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <ArrowUp className="size-4" strokeWidth={2.5} />
                      <span className="sr-only">Ask question</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested prompts */}
        <div className="mt-3 flex flex-wrap gap-2 px-1">
          {examplePrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                form.setValue("question", prompt);
              }}
              className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground rounded-full border px-3 py-1.5 text-xs transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
