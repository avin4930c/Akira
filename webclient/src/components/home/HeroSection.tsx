import React from 'react'
import Image from 'next/image';
import { homePageImages } from '@/resources/images';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, MessageCircle, Shield, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import StatsSection from './StatsSection';

const HeroSection = () => {
    return (
        <section className="pt-24 pb-16 px-6 overflow-hidden">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-soft border border-accent/20 rounded-full"
                            >
                                <Zap className="w-4 h-4 text-accent" />
                                <span className="text-sm font-medium text-accent">Powered by Advanced AI</span>
                            </motion.div>

                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                                <span className="text-foreground">AI for</span>
                                <br />
                                <span className="text-shimmer">Riders & Mechanics</span>
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                                Get expert motorcycle guidance instantly with our AI-powered platform. From maintenance to troubleshooting, we've got your ride covered.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="hero" size="xl" asChild>
                                <Link href="/chat">
                                    Try Akira Chat
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="xl">
                                Learn about MIA
                                <ExternalLink className="w-5 h-5 ml-2" />
                            </Button>
                        </div>

                        <StatsSection />

                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-elegant">
                            <Image
                                src={homePageImages.heroImage}
                                alt="Futuristic AI-enhanced motorcycle"
                                width={600}
                                height={400}
                                className="w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-hero opacity-20" />
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -top-4 -right-4 glass rounded-xl p-4 border border-accent/20"
                        >
                            <MessageCircle className="w-6 h-6 text-accent" />
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                            className="absolute -bottom-4 -left-4 glass rounded-xl p-4 border border-primary/20"
                        >
                            <Shield className="w-6 h-6 text-primary" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection