import React from 'react'
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, 
        y: 0, 
        transition: { 
            duration: 1, 
            delay: i * 0.15, 
            ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number]
        }
    })
};

const HeroSection = () => {
    return (
        <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-start bg-background">
            
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
                    style={{ backgroundImage: "url('/images/home_page/hero-motorcycle.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-background" />
            </div>

            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] max-w-[1000px] h-[500px] bg-[radial-gradient(ellipse,hsl(24_100%_58%/0.25)_0%,transparent_70%)] blur-[100px] pointer-events-none z-0" />
            
            <motion.div 
                className="absolute top-[20%] left-[15%] w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none z-0"
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
                className="absolute top-[40%] right-[15%] w-72 h-72 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none z-0"
                animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                
                <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
                    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/[0.04] shadow-[0_0_15px_hsl(24_100%_58%/0.1)] backdrop-blur-md">
                        <Activity className="w-4 h-4 text-accent" />
                        <span className="text-[13px] font-medium tracking-wide text-foreground">Meet MIA</span>
                        <div className="h-4 w-px bg-border/50 mx-1" />
                        <span className="text-[13px] text-muted-foreground">Mechanic Intelligence Assistant</span>
                    </div>
                </motion.div>

                <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl text-5xl md:text-[5.5rem] font-bold tracking-tight text-foreground leading-[1.05] mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Motorcycle diagnostics.
                    </motion.div>
                    <motion.div
                        className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-400 to-accent inline-block pb-2 hover:opacity-80 transition-opacity"
                        initial={{ opacity: 0, scale: 0.95, backgroundPosition: '200% center' }}
                        animate={{ opacity: 1, scale: 1, backgroundPosition: '0% center' }}
                        transition={{ 
                            opacity: { duration: 1.2, delay: 0.5 },
                            scale: { duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
                            backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" }
                        }}
                        style={{ backgroundSize: '200% auto' }}
                    >
                        Elevated by AI.
                    </motion.div>
                </motion.h1>

                <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 text-zinc-400 font-light">
                    <motion.span
                         initial={{ opacity: 0, y: 15 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                    MIA transforms your workshop workflows by ingesting symptoms, running semantic searches across OEM service manuals, and delivering sequential repair plans with real-time inventory matching.
                    </motion.span>
                </motion.p>

                <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-6 mb-20 w-full justify-center">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent via-orange-400 to-accent rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
                        <Button variant="hero" size="xl" className="relative w-full sm:w-auto min-w-[220px] shadow-2xl shadow-accent/20 border border-white/10" asChild>
                            <Link href="/mia" className="flex items-center">
                                Launch MIA Pipeline
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </motion.div>
                            </Link>
                        </Button>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-border/50 to-muted/50 rounded-xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <Button variant="outline" size="xl" className="relative w-full sm:w-auto min-w-[220px] bg-black/50 backdrop-blur-xl border-border/50 hover:bg-black/80 hover:text-foreground shadow-xl transition-all duration-300" asChild>
                            <Link href="/chat">
                                Try Chat Assistant
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    custom={4} initial="hidden" animate="visible" variants={fadeUp} 
                    className="w-full max-w-5xl rounded-[24px] p-[1px] bg-gradient-to-b from-border/50 via-border/10 to-transparent relative group perspective-[2000px] z-10"
                >
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full bg-[#0a0a0a] rounded-[23px] overflow-hidden shadow-2xl flex flex-col border border-black/80 transition-transform duration-700 ease-out group-hover:rotate-x-[2deg] group-hover:rotate-y-[-2deg]"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none" />
                        
                        <div className="h-12 w-full bg-[#141414] border-b border-border/10 flex items-center px-4 justify-between">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-border/40" />
                                <div className="w-3 h-3 rounded-full bg-border/40" />
                                <div className="w-3 h-3 rounded-full bg-border/40" />
                            </div>
                            <div className="flex bg-[#1e1e1e] rounded-md px-4 py-1 flex-1 max-w-sm mx-4 border border-border/5 justify-center">
                                <Activity className="w-4 h-4 text-accent/50 mr-2" />
                                <span className="text-[12px] font-mono text-muted-foreground/60 tracking-wider">mia / service-job / sj-9284</span>
                            </div>
                            <div className="w-16" />
                        </div>

                        <div className="flex flex-col md:flex-row bg-[#0a0a0a] text-left divide-y md:divide-y-0 md:divide-x divide-border/10 max-h-[600px] overflow-hidden">
                            
                            <div className="flex-[1.4] p-6 md:p-8 flex flex-col gap-8 overflow-hidden">
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#111111] border border-border/10 rounded-xl p-4 relative group">
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                            <div className="w-24 h-24 bg-orange-500/5 rounded-full blur-2xl transform translate-x-4 -translate-y-4" />
                                        </div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-[#1a1a1a] rounded-lg border border-border/5">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500/80"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                                                </div>
                                                <span className="text-[14px] font-medium text-orange-500">Vehicle</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-base font-semibold text-zinc-100 mb-1">YZF-R6</h4>
                                            <p className="text-[13px] text-zinc-400">2018 • Yamaha</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#111111] border border-border/10 rounded-xl p-4 relative group">
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                            <div className="w-24 h-24 bg-accent/5 rounded-full blur-2xl transform translate-x-4 -translate-y-4" />
                                        </div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-[#1a1a1a] rounded-lg border border-border/5">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent/80"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                                </div>
                                                <span className="text-[14px] font-medium text-accent">Customer</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-base font-semibold text-zinc-100 mb-1">John Doe</h4>
                                            <p className="text-[13px] text-zinc-400">john.doe@example.com</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#161616] border border-border/20 shadow-sm">
                                            <CheckCircle2 className="w-4 h-4 text-accent" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold tracking-tight text-foreground/90">Execution Plan</h3>
                                            <p className="text-[13px] text-muted-foreground">Structured sequential repair tasks</p>
                                        </div>
                                    </div>
                                    
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 2.5, duration: 0.5 }}
                                        className="bg-[#111111] border border-border/10 rounded-xl p-5 hover:border-border/30 transition-colors relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                            <div className="w-32 h-32 bg-accent/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded border border-border/10 bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                                                    <span className="text-[11px] font-mono text-muted-foreground">1</span>
                                                </div>
                                                <h4 className="font-medium text-base sm:text-lg text-foreground/90">Adjust Valve Clearances</h4>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[12px] px-2 py-0.5 rounded-md font-mono bg-border/5 text-muted-foreground border border-border/10">Engine</span>
                                                <span className="text-[12px] px-2 py-0.5 rounded-md font-medium border bg-[#FF5F56]/10 text-[#FF5F56] border-[#FF5F56]/20">Hard</span>
                                                <span className="text-[12px] px-2 py-0.5 rounded-md font-mono bg-accent/10 border border-accent/20 text-accent flex items-center">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                    180 min
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-[14px] sm:text-[15px] text-zinc-300 leading-relaxed pl-9 mb-4 relative z-10">
                                            Intake target: 0.11-0.20mm. Exhaust target: 0.21-0.25mm. Note: Cylinders 2 & 3 commonly tight on this generation.
                                        </p>
                                        <div className="pl-9 flex flex-col gap-3 relative z-10">
                                            <div className="flex items-start gap-2">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/60 mt-0.5 shrink-0"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                                                <div className="flex flex-wrap gap-1.5">
                                                    <span className="text-[12px] sm:text-[13px] px-2 py-0.5 bg-[#1a1a1a] border border-border/5 rounded text-zinc-400">
                                                        Feeler Gauges
                                                    </span>
                                                    <span className="text-[12px] sm:text-[13px] px-2 py-0.5 bg-[#1a1a1a] border border-border/5 rounded text-zinc-400">
                                                        Micrometer
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-[13px] sm:text-[14px] bg-[#1a1a1a] border border-border/5 p-2 rounded-md inline-flex">
                                                <span className="text-muted-foreground font-mono">Torque:</span>
                                                <span className="text-zinc-300 font-medium">Cam cap bolts: 10 Nm</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                            
                            <div className="flex-1 p-6 md:p-8 bg-[#111] flex flex-col gap-6">
                                
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold tracking-tight text-zinc-100 flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                            </span>
                                            Active Resolution
                                        </h3>
                                        <div className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                                            Generating
                                        </div>
                                    </div>

                                    <div className="group relative rounded-xl border border-border/10 bg-[#0a0a0a] overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <div className="p-4 flex flex-col gap-3 font-mono text-[12px]">
                                            <motion.div 
                                                initial={{ opacity: 0, x: -10 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                transition={{ delay: 1, duration: 0.5 }}
                                                className="flex items-center gap-3 text-zinc-400"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                                <span>Synthesizing vector context...</span>
                                            </motion.div>
                                            <motion.div 
                                                initial={{ opacity: 0, x: -10 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                transition={{ delay: 2, duration: 0.5 }}
                                                className="flex items-center gap-3 text-zinc-400"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                                                <span>Calculating repair labor hours...</span>
                                            </motion.div>
                                            <motion.div 
                                                initial={{ opacity: 0, x: -10 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                transition={{ delay: 3, duration: 0.5 }}
                                                className="flex items-center gap-3 text-zinc-100"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,95,86,0.8)]" />
                                                <span>Matching semantic inventory</span>
                                                <span className="w-1 h-3 bg-accent animate-pulse" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#161616] border border-border/20 shadow-sm">
                                            <Layers className="w-3 h-3 text-accent" />
                                        </div>
                                        <h3 className="text-[13px] font-semibold tracking-tight text-foreground/90">Suggested Parts</h3>
                                    </div>
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 3.5, duration: 0.5 }}
                                        className="bg-[#111111] border border-border/10 rounded-xl p-4 relative group"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-border/20 group-hover:bg-accent/50 transition-colors" />
                                        <div className="pl-3 relative z-10">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px] font-medium text-foreground/90">Valve Shim Kit (7.48mm)</span>
                                                    <AlertCircle className="w-3.5 h-3.5 text-[#FF5F56]" />
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded-md font-medium border bg-[#FF5F56]/10 text-[#FF5F56] border-[#FF5F56]/20">Required</span>
                                            </div>
                                            <div className="flex flex-col gap-2 mt-2">
                                                <div className="flex items-center justify-between text-[12px] p-2.5 bg-[#161616] rounded-md border border-border/10">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-zinc-200">Yamaha OEM Shim Kit</span>
                                                        <span className="text-muted-foreground font-mono text-[10px]">SKU: YAM-748-KIT</span>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-zinc-100 font-medium">$85.00</span>
                                                        <span className="text-[10px] px-1.5 py-[1px] rounded font-medium border bg-[#27C93F]/10 text-[#27C93F] border-[#27C93F]/20">
                                                            In Stock (12)
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            </div>
            
            <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-6 w-full flex justify-center z-10"
            >
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 px-8 py-3 rounded-full border border-accent/20 bg-[#111111]/80 backdrop-blur-md shadow-[0_0_15px_hsl(24_100%_58%/0.1)]">
                    {[
                        "LANGGRAPH",
                        "REDIS",
                        "PGVECTOR",
                        "RABBITMQ"
                    ].map((tech, i, arr) => (
                        <React.Fragment key={tech}>
                            <span className="text-accent/90 font-mono text-[12px] font-semibold tracking-[0.2em] drop-shadow-[0_0_8px_hsl(24_100%_58%/0.5)]">
                                {tech}
                            </span>
                            {i < arr.length - 1 && (
                                <span className="text-accent/30">•</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

export default HeroSection