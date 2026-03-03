import React from 'react'

const TypingIndicator = () => {
    return (
        <span className="inline-flex items-center gap-1.5 px-0.5">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_hsl(24_100%_58%/0.8)]" />
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_hsl(24_100%_58%/0.8)]" style={{ animationDelay: '0.15s' }} />
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_hsl(24_100%_58%/0.8)]" style={{ animationDelay: '0.3s' }} />
        </span>
    )
}

export default TypingIndicator