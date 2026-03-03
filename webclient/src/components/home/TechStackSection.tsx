import React from 'react'
import { motion } from 'framer-motion'
import { stack, categoryColors } from '@/constants/homePageConstants'

const TechStackSection = () => {
    return (
        <section className="relative py-24 px-6">
            {/* Top border */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-sm font-medium text-accent tracking-wider uppercase">Engineering</span>
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
                        Built With Modern Infrastructure
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Full-stack TypeScript and Python - from the UI layer to the LLM orchestration pipeline.
                        Every piece chosen for production-grade reliability.
                    </p>
                </motion.div>

                {/* Stack grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-3"
                >
                    {stack.map((tech, i) => (
                        <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.03 }}
                            viewport={{ once: true }}
                            className={`px-4 py-2 rounded-lg border font-mono text-sm ${categoryColors[tech.category]} bg-card/30`}
                        >
                            {tech.name}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground"
                >
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500/60" />
                        Frontend
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-zinc-400/60" />
                        Backend
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-200/60" />
                        Infrastructure
                    </span>
                </motion.div>
            </div>
        </section>
    )
}

export default TechStackSection
