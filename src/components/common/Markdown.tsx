import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
const Markdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
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
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
