// src/components/chat/Markdown.tsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import ErrorBoundary from "../../components/ErrorBoundary";
import "highlight.js/styles/atom-one-dark.css";

// Inline & block code renderer with a copy button for blocks
const Code: React.FC<{
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const txt = String(children ?? "");
  const langMatch = /language-(\w+)/.exec(className || "");

  if (inline) {
    return (
      <code
        className="px-1 py-0.5 rounded bg-gray-200 text-gray-800"
        {...props}
      >
        {children}
      </code>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(txt.replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="group relative">
      <pre className="rounded-xl overflow-auto shadow-inner bg-gray-900 text-gray-100 p-4 text-sm">
        <code className={className}>{children}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-xs px-2 py-1 rounded-md border bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm"
        aria-label="Copy code"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      {langMatch && (
        <span className="absolute bottom-2 right-2 text-[10px] uppercase tracking-wider bg-black/50 text-white px-1.5 py-0.5 rounded">
          {langMatch[1]}
        </span>
      )}
    </div>
  );
};
const Markdown: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ErrorBoundary>
      <div className="whitespace-pre-wrap break-words prose prose-sm max-w-none prose-pre:p-0">
        <ReactMarkdown
          // Security: ignore raw HTML from model/back-end
          skipHtml
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              />
            ),
            code: Code as any,
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc ml-5 space-y-1" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-decimal ml-5 space-y-1" />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="leading-relaxed" />
            ),
            h1: ({ node, ...props }) => (
              <h1 {...props} className="text-xl font-semibold mt-3 mb-1" />
            ),
            h2: ({ node, ...props }) => (
              <h2 {...props} className="text-lg font-semibold mt-3 mb-1" />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                {...props}
                className="border-l-4 border-gray-300 pl-3 italic text-gray-700"
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
