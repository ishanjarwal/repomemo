import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";

const Markdown = ({ children }: { children: string }) => {
  const formattedContent = children ? children.replace(/\\n/g, "\n") : "";

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        pre({ children }) {
          const codeElement = children as React.ReactElement<{
            className?: string;
            children?: React.ReactNode;
          }>;

          const className = codeElement.props.className ?? "";
          const language = className.replace("language-", "");

          const code = String(codeElement.props.children ?? "").replace(
            /\n$/,
            "",
          );

          return <CodeBlock code={code} language={language} />;
        },
      }}
    >
      {formattedContent}
    </ReactMarkdown>
  );
};

export default Markdown;
