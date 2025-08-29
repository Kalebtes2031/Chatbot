// src/components/chat/Markdown.tsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import ErrorBoundary from "../../components/ErrorBoundary";
import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/outline";
import "highlight.js/styles/atom-one-dark.css";
import styles from "./Markdown.module.css";

// Inline & block code renderer with a copy button for blocks
const Code: React.FC<{
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const langMatch = /language-(\w+)/.exec(className || "");

  if (inline) {
    return (
      <code
        className="px-1.5 py-0.5 rounded bg-gray-600 text-gray-100 text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  // helper to recursively get plain text from ReactNode
  const getText = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return node.toString();
    if (Array.isArray(node)) return node.map(getText).join("");
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      return getText(element.props.children);
    }
    return "";
  };

  const copy = async () => {
    try {
      const txt = getText(children).replace(/\n$/, "");
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="group relative my-3">
      {/* Horizontal scroll wrapper */}
      <div
        className={`overflow-auto max-h-[500px] ${styles["custom-scrollbar"]} rounded-lg shadow-inner bg-gray-900 border border-gray-700`}
      >
        <pre className="p-4 text-sm font-mono text-gray-100">
          <code className={className}>{children}</code>
        </pre>
      </div>

      <button
        onClick={copy}
        className="absolute top-2 right-2 text-xs px-2 py-1.5 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600 shadow-sm transition-all flex items-center"
        aria-label="Copy code"
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 text-green-400" />
        ) : (
          <DocumentDuplicateIcon className="h-4 w-4" />
        )}
      </button>

      {langMatch && (
        <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">
          {langMatch[1]}
        </span>
      )}
    </div>
  );
};

const Markdown: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ErrorBoundary>
      <div className="whitespace-pre-wrap break-words prose prose-invert prose-sm max-w-none">
        <ReactMarkdown
          skipHtml
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              />
            ),
            code: Code as any,
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc ml-5 space-y-1 my-3" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-decimal ml-5 space-y-1 my-3" />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="leading-relaxed my-2 break-words" />
            ),
            h1: ({ node, ...props }) => (
              <h1
                {...props}
                className="text-xl font-semibold mt-4 mb-2 border-b border-gray-600 pb-1 break-words"
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                {...props}
                className="text-lg font-semibold mt-4 mb-2 border-b border-gray-600 pb-1 break-words"
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                {...props}
                className="text-md font-semibold mt-3 mb-1 break-words"
              />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                {...props}
                className="border-l-4 border-purple-500 pl-4 italic text-gray-400 bg-gray-800/50 py-1 my-2 rounded-r break-words"
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto custom-scrollbar my-3">
                <table
                  {...props}
                  className="min-w-full divide-y divide-gray-700"
                />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th
                {...props}
                className="px-4 py-2 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              />
            ),
            td: ({ node, ...props }) => (
              <td
                {...props}
                className="px-4 py-2 whitespace-pre-wrap text-sm text-gray-300 border-t border-gray-700 break-words"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </ErrorBoundary>
  );
};

export default Markdown;
