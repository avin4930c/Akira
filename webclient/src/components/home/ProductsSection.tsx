import React from 'react'
import { motion } from 'framer-motion'
import { features } from '@/constants/homePageConstants'
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

const ProductsSection = () => {
    return (
        <section className="relative py-24 px-6 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-medium text-accent tracking-wider uppercase">Platform</span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
                        Two AI Systems. One Goal.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Whether you&apos;re a rider looking for quick answers or a mechanic running diagnostics, 
                        Akira has a purpose-built AI for you.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="relative h-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 
                                transition-all duration-500 hover:border-accent/30 hover:shadow-glow">
                                
                                <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                
                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground">
                                                {feature.title}
                                            </h3>
                                            <p className="text-muted-foreground mt-1">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pl-16">
                                        {feature.features.map((item) => (
                                            <div key={item} className="flex items-center space-x-3">
                                                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                                                <span className="text-sm text-foreground/80">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pl-16">
                                        <Button
                                            variant="glass"
                                            size="lg"
                                            className="group/btn"
                                            asChild
                                        >
                                            <Link href={feature.href}>
                                                {feature.cta}
                                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProductsSection