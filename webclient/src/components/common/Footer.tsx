import { Github, Mail } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="relative py-16 px-6">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="container mx-auto">
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary-glow flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">Akira</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            AI-powered platform for motorcycle riders and mechanics. Expert guidance, diagnostic workflows, and real-time assistance.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Product</h3>
                        <div className="space-y-3">
                            <Link href="/chat" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                                Akira Chat
                            </Link>
                            <Link href="/mia" className="block text-sm text-muted-foreground hover:text-accent transition-colors">
                                MIA Platform
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Connect</h3>
                        <div className="space-y-3">
                            <a href="https://github.com/avin4930c/Akira" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                                <Github className="w-4 h-4" />
                                <span>GitHub</span>
                            </a>
                            <a href="mailto:avinash4930c@gmail.com" className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                                <Mail className="w-4 h-4" />
                                <span>Contact</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/50 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Akira. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground/50">
                        Built with LangGraph, Gemini & Next.js
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer