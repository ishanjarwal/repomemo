"use client";

import {
  ArrowUp,
  Command,
  FileCode2,
  GitBranch,
  Paperclip,
  Sparkles,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { env } from "@/env";
import { FaGithub } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface QuestionBoxProps {
  repoName: string;
  ownerLogin: string;
  ownerAvatarUrl: string;
  branch?: string;
  onSubmit?: (question: string) => void;
  disabled?: boolean;
}

export function QuestionBox({
  repoName,
  ownerAvatarUrl,
  ownerLogin,
  branch = "main",
  onSubmit,
  disabled = false,
}: QuestionBoxProps) {
  const [question, setQuestion] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const value = question.trim();

    if (!value || disabled) return;

    onSubmit?.(value);
    setQuestion("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const examplePrompts = [
    "How does authentication work?",
    "Explain the database architecture",
    "Where is the API rate limiting?",
  ];

  return (
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
            <Textarea
              autoFocus={true}
              ref={textareaRef}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder="Ask about the codebase..."
              className="min-h-24 resize-none border-0 bg-transparent text-base leading-6 shadow-none focus-visible:ring-0 dark:bg-transparent"
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
                type="button"
                onClick={submit}
                disabled={!question.trim() || disabled}
                size="icon"
                className="size-9 rounded-md"
              >
                <ArrowUp className="size-4" strokeWidth={2.5} />
                <span className="sr-only">Ask question</span>
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
              setQuestion(prompt);
              textareaRef.current?.focus();
            }}
            className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground rounded-full border px-3 py-1.5 text-xs transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
