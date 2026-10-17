import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

/**
 * Preprocesses text to ensure lists and items separated by punctuation/spacing
 * are cleanly placed on new lines so markdown parsers render them as real lists.
 */
function preprocessMarkdown(text: string): string {
  if (!text) return ""
  return text
    // Ensure numbered lists following punctuation or colon start on new lines
    .replace(/([:?.!])\s+(\d+\.\s+)/g, "$1\n\n$2")
    // Ensure bullet items following punctuation or colon start on new lines
    .replace(/([:?.!])\s+([*•-]\s+)/g, "$1\n\n$2")
    // Ensure consecutive numbered list items without newlines break onto new lines
    .replace(/(\d+\.\s+[^\n]+?)\s+(\d+\.\s+)/g, "$1\n$2")
    // Ensure consecutive bullet items without newlines break onto new lines
    .replace(/([*•-]\s+[^\n]+?)\s+([*•-]\s+)/g, "$1\n$2")
}

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const processed = preprocessMarkdown(content)

  return (
    <div className="text-sm leading-relaxed space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1.5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
          h1: ({ children }) => <h1 className="text-base font-bold my-2 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm font-bold my-2 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold my-1.5 text-foreground">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/60 pl-3 my-2 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === "string" && !children.includes("\n")
            if (isInline) {
              return (
                <code
                  className="bg-background/80 px-1.5 py-0.5 rounded text-xs font-mono text-foreground border"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <pre className="my-2 overflow-x-auto rounded-lg bg-background/90 border p-3 text-xs font-mono">
                <code {...props}>{children}</code>
              </pre>
            )
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-2 rounded-lg border border-border">
              <table className="w-full border-collapse text-xs text-left">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-muted/60 px-3 py-2 font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/50 px-3 py-2 last:border-b-0">{children}</td>
          ),
          hr: () => <hr className="my-3 border-border" />,
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  )
}
