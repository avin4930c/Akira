import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

const markdownComponents: Components = {
    p: ({ children }: { children?: React.ReactNode }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
    code: ({ children }: { children?: React.ReactNode }) => (
        <code className="text-xs bg-muted px-1 py-0.5 rounded">{children}</code>
    ),
    pre: ({ children }: { children?: React.ReactNode }) => (
        <pre className="text-xs overflow-x-auto bg-muted p-3 rounded-md my-3">{children}</pre>
    ),
    h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="text-lg font-bold my-3 first:mt-0">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-base font-bold my-2 first:mt-0">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-sm font-bold my-2 first:mt-0">{children}</h3>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => <li className="my-1">{children}</li>,
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
}

interface MarkdownMessageProps {
    content: string
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={markdownComponents}
        >
            {content}
        </ReactMarkdown>
    )
}