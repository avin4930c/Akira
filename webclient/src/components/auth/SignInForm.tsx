"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthError } from './AuthError';
import { SocialAuthButtons } from './SocialAuthButtons';
import { AuthFooter } from './AuthFooter';

interface SignInFormProps {
    onEmailSignIn: (email: string, password: string) => Promise<void>;
    onSocialSignIn: (provider: 'oauth_google' | 'oauth_apple') => Promise<void>;
    isLoading: boolean;
    error: string;
    socialLoading: 'google' | 'apple' | null;
}

export function SignInForm({
    onEmailSignIn,
    onSocialSignIn,
    isLoading,
    error,
    socialLoading
}: SignInFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onEmailSignIn(email, password);
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-accent"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="transition-all duration-200 focus:ring-accent"
                    />
                </div>

                <AuthError error={error} />

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    variant="hero"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <SocialAuthButtons
                onSocialAuth={onSocialSignIn}
                socialLoading={socialLoading}
            />

            <AuthFooter mode="sign-in" />
        </div>
    );
}
