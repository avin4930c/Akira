import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { features } from '@/constants/homePageConstants'
import { Button } from '../ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const ProductsSection = () => {
    return (
        <section className="py-16 px-6">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                        Our AI-Powered Solutions
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Whether you're a weekend rider or a professional mechanic, Akira has the tools you need to excel.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full shadow-card hover:shadow-elegant transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardHeader className="space-y-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-foreground">
                                            {feature.title}
                                        </CardTitle>
                                        <CardDescription className="text-muted-foreground text-lg">
                                            {feature.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        {feature.features.map((item) => (
                                            <div key={item} className="flex items-center space-x-3">
                                                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                                                <span className="text-foreground">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        variant="premium"
                                        size="lg"
                                        className="w-full"
                                        asChild={feature.href === '/chat'}
                                    >
                                        {feature.href === '/chat' ? (
                                            <Link href={feature.href}>
                                                {feature.cta}
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        ) : (
                                            <>
                                                {feature.cta}
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProductsSection