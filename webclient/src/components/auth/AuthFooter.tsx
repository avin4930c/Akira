"use client";

import Link from 'next/link';

interface AuthFooterProps {
    mode: 'sign-in' | 'sign-up';
}

export function AuthFooter({ mode }: AuthFooterProps) {
    const isSignMode = mode === 'sign-in';
    return (
        <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
                {isSignMode ? "Don't have an account?" : "Already have an account?"}{' '}
                <Link
                    href={isSignMode ? "/sign-up" : "/sign-in"}
                    className="text-accent hover:text-accent-foreground transition-colors duration-200 font-medium"
                >
                    {isSignMode ? "Sign up" : "Sign in"}
                </Link>
            </p>
        </div>
    );
}
