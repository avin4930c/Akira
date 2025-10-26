'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Menu, X, MessageCircle, Wrench, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const isMia = pathname?.startsWith('/mia');

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navigation = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'MIA', href: '/mia', icon: Wrench },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={cn(
      "fixed top-0 w-full max-h-[70px] z-50 border-b",
      isMia 
        ? "glass-card border-border/50"
        : "glass border-border/50"
    )}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              isMia 
                ? "bg-gradient-to-br from-primary to-blue-500"
                : "bg-gradient-accent"
            )}>
              <span className={cn(
                "font-bold text-lg",
                isMia ? "text-white" : "text-accent-foreground"
              )}>A</span>
            </div>
            <span className="text-xl font-bold text-foreground">Akira</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
                  isActive(item.href)
                    ? isMia
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-accent bg-accent-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`${isMia ? 'hidden' : ''} w-9 h-9`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            {isSignedIn ? (
              <>
                <Button variant="hero" size="default" asChild>
                  <Link href="/chat">Akira Chat</Link>
                </Button>
                <UserButton />
              </>
            ) : (
              <>
                <Button variant="outline" size="default" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button variant="hero" size="default" asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/50 mt-2 pt-4 pb-6"
            >
              <div className="space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-accent bg-accent-soft'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                <div className={`flex items-center justify-between px-4 py-3`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="justify-start"
                  >
                    {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
                {isSignedIn ? (
                  <>
                    <Button variant="hero" size="default" className="w-full" asChild>
                      <Link href="/chat" onClick={() => setIsOpen(false)}>
                        Akira Chat
                      </Link>
                    </Button>
                    <div className="px-4 py-2">
                      <UserButton />
                    </div>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="default" className="w-full" asChild>
                      <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button variant="hero" size="default" className="w-full" asChild>
                      <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;