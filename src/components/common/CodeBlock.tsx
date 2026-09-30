"use client";

import { useState } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import { CodeBlock as ReactCodeBlock } from "react-code-block";
import { themes } from "prism-react-renderer";
import { detectLanguage } from "@/lib/utils";
import { useTheme } from "next-themes";

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
}

const CodeBlock = ({ code, filename, language }: CodeBlockProps) => {
  const { theme } = useTheme();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <div className="border-border flex items-center justify-between border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="bg-muted/10 flex h-6 w-6 items-center justify-center rounded-md">
            <FileCode2 className="text-muted-foreground h-3.5 w-3.5" />
          </div>

          <span className="text-muted-foreground/80 text-xs font-medium">
            {filename || language}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          title="Copy"
          className="border-border/10 bg-foreground/5 text-foreground/50 hover:bg-forground/10 hover:text-foreground flex items-center justify-center rounded-md border p-1.5 backdrop-blur-sm transition group-hover:opacity-100"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      <div className="group scrollbar-thumb-accent max-h-80 scrollbar-thin overflow-hidden overflow-x-auto overflow-y-auto">
        <ReactCodeBlock
          code={code}
          language={language || detectLanguage(filename)}
          theme={theme === "dark" ? themes.oneDark : themes.oneLight}
        >
          <ReactCodeBlock.Code className="[&_span]:font-code bg-inherit p-6 shadow">
            <div className="table-row">
              {/* <ReactCodeBlock.LineNumber className="table-cell pr-4 text-right text-xs text-gray-400 select-none" /> */}
              <ReactCodeBlock.LineContent className="table-cell">
                <ReactCodeBlock.Token />
              </ReactCodeBlock.LineContent>
            </div>
          </ReactCodeBlock.Code>
        </ReactCodeBlock>
      </div>
    </div>
  );
};

export default CodeBlock;
