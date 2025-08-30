"use client";

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { signUpIcons } from '@/resources/icons';

interface SocialAuthButtonsProps {
    onSocialAuth: (provider: 'oauth_google' | 'oauth_apple') => void;
    socialLoading: 'google' | 'apple' | null;
    showCaptcha?: boolean;
}

export function SocialAuthButtons({ onSocialAuth, socialLoading, showCaptcha = true }: SocialAuthButtonsProps) {
    return (
        <>
            {/* CAPTCHA element for bot protection */}
            {showCaptcha && <div id="clerk-captcha" className="flex justify-center my-4"></div>}

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    onClick={() => onSocialAuth('oauth_google')}
                    className="transition-all duration-200 hover:bg-accent/10"
                    disabled={socialLoading === 'google'}
                >
                    {socialLoading === 'google' ? (
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                    ) : (
                        <Image src={signUpIcons.googleIcon} alt="Google" width={16} height={16} className="mr-2" />
                    )}
                    {socialLoading === 'google' ? 'Connecting...' : 'Google'}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => onSocialAuth('oauth_apple')}
                    className="transition-all duration-200 hover:bg-accent/10"
                    disabled={socialLoading === 'apple'}
                >
                    {socialLoading === 'apple' ? (
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                    ) : (
                        <Image src={signUpIcons.appleIcon} alt="Apple" width={16} height={16} className="mr-2" />
                    )}
                    {socialLoading === 'apple' ? 'Connecting...' : 'Apple'}
                </Button>
            </div>
        </>
    );
}
