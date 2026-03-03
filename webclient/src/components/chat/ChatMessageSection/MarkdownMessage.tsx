import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

const markdownComponents: Components = {
    p: ({ children }: { children?: React.ReactNode }) => <p className="mb-3 first:mt-0 last:mb-0 leading-relaxed text-zinc-300 font-sans tracking-wide text-[14px]">{children}</p>,
    code: ({ children }: { children?: React.ReactNode }) => (
        <code className="text-[12px] bg-[#1a1a1a] text-accent px-1.5 py-0.5 rounded-md font-mono border border-white/5">{children}</code>
    ),
    pre: ({ children }: { children?: React.ReactNode }) => (
        <pre className="text-[12px] overflow-x-auto bg-[#0a0a0a] p-4 rounded-xl my-4 border border-white/5 shadow-inner">
            {children}
        </pre>
    ),
    h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="text-xl font-bold my-4 first:mt-0 text-zinc-100 uppercase tracking-tight">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-lg font-bold my-3 mt-6 first:mt-0 text-zinc-200">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-md font-bold my-2 mt-5 first:mt-0 text-zinc-300">{children}</h3>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="list-none my-4 space-y-2 ml-1">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="list-decimal list-outside my-4 space-y-2 ml-5 text-zinc-400">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
        <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-[10px] before:w-[5px] before:h-[5px] before:bg-accent before:rounded-full before:shadow-[0_0_8px_hsl(24_100%_58%/0.8)] text-zinc-300 tracking-wide text-[14px]">
            {children}
        </li>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold text-zinc-100">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic text-zinc-400">{children}</em>,
    a: ({ href, children }: { href?: string, children?: React.ReactNode }) => (
        <a href={href} className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-2 border-accent/50 pl-4 py-1 my-4 bg-accent/5 italic text-zinc-400 rounded-r-lg">
            {children}
        </blockquote>
    ),
}

interface MarkdownMessageProps {
    content: string
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
    return (
        <div className="w-full text-zinc-300">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={markdownComponents}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}