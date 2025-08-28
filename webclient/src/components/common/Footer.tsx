import { FileText, Github, Mail } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="py-16 px-6 border-t border-border/50">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                                <span className="text-accent-foreground font-bold">A</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">Akira</span>
                        </div>
                        <p className="text-muted-foreground">
                            AI-powered platform for motorcycle riders and mechanics. Get expert guidance anytime, anywhere.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Product</h3>
                        <div className="space-y-2">
                            <Link href="/chat" className="block text-muted-foreground hover:text-foreground transition-colors">
                                Akira Chat
                            </Link>
                            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                                MIA Platform
                            </a>
                            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                                API Access
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Company</h3>
                        <div className="space-y-2">
                            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                                About
                            </a>
                            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                                Contact
                            </a>
                            <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                                Careers
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                        <div className="space-y-2">
                            <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                                <FileText className="w-4 h-4" />
                                <span>Privacy Policy</span>
                            </a>
                            <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="w-4 h-4" />
                                <span>GitHub</span>
                            </a>
                            <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                                <Mail className="w-4 h-4" />
                                <span>Contact</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/50 mt-12 pt-8 text-center text-muted-foreground">
                    <p>&copy; 2024 Akira. All rights reserved. Built with cutting-edge AI technology for the motorcycle community.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer