import React from 'react'

const TypingIndicator = () => {
    return (
        <>
            <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        </>
    )
}

export default TypingIndicator