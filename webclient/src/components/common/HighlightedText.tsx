import { highlightText } from "@/lib/text-utils";

interface HighlightedTextProps {
    text: string;
    query: string;
    className?: string;
    highlightClassName?: string;
}

export function HighlightedText({ text, query, className = "", highlightClassName = "bg-yellow-200 dark:bg-yellow-900/50 font-semibold" }: HighlightedTextProps) {
    const segments = highlightText(text, query);

    return (
        <span className={className}>
            {segments.map((segment, index) => (
                segment.highlight ? (
                    <mark key={`${index}-${segment.highlight}-${segment.text}`} className={highlightClassName}>
                        {segment.text}
                    </mark>
                ) : (
                    <span key={`${index}-${segment.highlight}-${segment.text}`}>{segment.text}</span>
                )
            ))}
        </span>
    );
}