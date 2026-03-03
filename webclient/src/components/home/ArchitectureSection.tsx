import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { pipelineSteps, infrastructureCallouts } from '@/constants/homePageConstants'

const ArchitectureSection = () => {
    return (
        <section className="relative py-24 px-6">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-sm font-medium text-accent tracking-wider uppercase">Architecture</span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
                        MIA Diagnostic Pipeline
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A LangGraph-orchestrated workflow that runs parallel retrieval, web search, and LLM analysis 
                        - queued via RabbitMQ and streamed back through Redis and SSE.
                    </p>
                </motion.div>

                <div className="relative">
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent -translate-y-1/2" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
                        {pipelineSteps.map((step, index) => (
                            <motion.div
                                key={step.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                <div className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-card/50">
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-accent bg-background border border-accent/20 rounded-full w-6 h-6 flex items-center justify-center">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <div className="w-12 h-12 rounded-xl border border-accent/20 bg-accent/5 flex items-center justify-center mb-4 transition-colors group-hover:bg-accent/10">
                                        <step.icon className="w-5 h-5 text-accent" />
                                    </div>

                                    <h3 className="text-sm font-semibold text-foreground mb-1">{step.label}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
                                </div>

                                {index < pipelineSteps.length - 1 && (
                                    <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                                        <ArrowRight className="w-4 h-4 text-accent/30" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
                >
                    {infrastructureCallouts.map((item) => (
                        <div key={item.label} className="flex flex-col items-center text-center p-4 rounded-xl border border-border/30 bg-card/20">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</span>
                            <span className="text-sm font-semibold text-accent mt-1">{item.value}</span>
                            <span className="text-xs text-muted-foreground mt-0.5">{item.detail}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default ArchitectureSection