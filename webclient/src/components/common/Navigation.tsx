'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Menu, X, MessageCircle, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { dark } from '@clerk/themes';
import { CharacterShimmer } from './CharacterShimmer';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const isMia = pathname?.startsWith('/mia');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'MIA', href: '/mia', icon: Wrench },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-[#000000]/80 backdrop-blur-xl border-b border-border/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3" : "bg-transparent border-b border-transparent py-4"
    )}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-[#0a0a0a] border group-hover:shadow-[0_0_15px_hsl(24_100%_58%/0.2)]",
              isMia 
                ? "border-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                : "border-accent/20 group-hover:border-accent/50"
            )}>
              <span className={cn(
                "font-bold text-lg drop-shadow-md",
                isMia ? "text-primary" : "text-accent"
              )}>A</span>
            </div>
            <CharacterShimmer text="Akira" className="text-xl font-bold text-zinc-100 tracking-tight" isMia={isMia} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 bg-[#0a0a0a]/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-1.5 rounded-xl transition-all duration-300",
                  isActive(item.href)
                    ? isMia
                      ? "text-primary bg-primary/10 shadow-[0_0_10px_rgba(59,130,246,0.1)] border border-primary/20"
                      : "text-accent bg-accent/10 shadow-[0_0_10px_hsl(24_100%_58%/0.1)] border border-accent/20"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent"
                )}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="font-medium text-[13px] tracking-wide">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Button className="bg-[#111111] text-zinc-200 border hover:bg-[#1a1a1a] border-accent/30 hover:text-accent transition-all h-10 px-5" size="sm" asChild>
                  <Link href="/chat">Akira Chat</Link>
                </Button>
                <div className="flex items-center justify-center p-1 rounded-full border border-border/10 bg-[#0a0a0a] shadow-inner">
                   <UserButton appearance={{ baseTheme: dark }} afterSignOutUrl="/" />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button className="bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-white/5 h-10 px-5" size="sm" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_0_15px_hsl(24_100%_58%/0.2)] font-medium h-10 px-5" size="sm" asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-zinc-400 hover:text-zinc-100"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-full left-0 right-0 bg-[#000000]/95 backdrop-blur-xl border-b border-border/10 p-6 shadow-2xl"
            >
              <div className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                      isActive(item.href)
                        ? "text-accent bg-accent/10 border border-accent/20"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-[#111111]"
                    )}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
                <div className="pt-6 mt-4 border-t border-border/10 flex flex-col space-y-3">
                  {isSignedIn ? (
                    <>
                      <Button className="w-full bg-[#111111] text-zinc-200 border border-border/10 hover:border-accent/30 transition-all h-12" asChild>
                        <Link href="/chat" onClick={() => setIsOpen(false)}>
                          Akira Chat
                        </Link>
                      </Button>
                      <div className="flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] rounded-xl border border-border/10">
                        <UserButton appearance={{ baseTheme: dark }} afterSignOutUrl="/" />
                        <span className="text-sm text-zinc-400 font-medium">Account Settings</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Button className="w-full bg-[#0a0a0a] text-zinc-300 hover:bg-[#111111] border border-border/10 h-12" asChild>
                        <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 shadow-[0_0_15px_hsl(24_100%_58%/0.2)]" asChild>
                        <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;