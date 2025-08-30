"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthError } from './AuthError';
import { SocialAuthButtons } from './SocialAuthButtons';
import { AuthFooter } from './AuthFooter';

interface SignUpFormProps {
    onEmailSignUp: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
    onVerification: (code: string) => Promise<void>;
    onSocialSignUp: (provider: 'oauth_google' | 'oauth_apple') => Promise<void>;
    onBackToSignUp: () => void;
    isLoading: boolean;
    error: string;
    socialLoading: 'google' | 'apple' | null;
    pendingVerification: boolean;
}

export function SignUpForm({
    onEmailSignUp,
    onVerification,
    onSocialSignUp,
    onBackToSignUp,
    isLoading,
    error,
    socialLoading,
    pendingVerification
}: SignUpFormProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const handleSignUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onEmailSignUp({ firstName, lastName, email, password });
    };

    const handleVerificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onVerification(verificationCode);
    };

    if (pendingVerification) {
        return (
            <div className="space-y-6">
                <form onSubmit={handleVerificationSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="verification">Verification Code</Label>
                        <Input
                            id="verification"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                            className="transition-all duration-200 focus:ring-accent text-center text-lg tracking-wider"
                            maxLength={6}
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
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={onBackToSignUp}
                    >
                        Back to sign up
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="transition-all duration-200 focus:ring-accent"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="transition-all duration-200 focus:ring-accent"
                        />
                    </div>
                </div>

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
                        placeholder="Create a strong password"
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
                    {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
            </form>

            <SocialAuthButtons
                onSocialAuth={onSocialSignUp}
                socialLoading={socialLoading}
            />

            <AuthFooter mode="sign-up" />
        </div>
    );
}
