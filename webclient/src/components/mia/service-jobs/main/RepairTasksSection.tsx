import { Wrench, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { RepairTask } from "@/types/mia";

const difficultyColors: Record<string, string> = {
    "Easy": "bg-[#27C93F]/10 text-[#27C93F] border-[#27C93F]/20",
    "Moderate": "bg-[#FFBD2E]/10 text-[#FFBD2E] border-[#FFBD2E]/20",
    "Hard": "bg-[#FF5F56]/10 text-[#FF5F56] border-[#FF5F56]/20",
    "Expert": "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function RepairTasksSection({ tasks }: { tasks: RepairTask[] }) {
    return (
        <div className="w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#161616] border border-border/20 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground/90">Execution Plan</h3>
                    <p className="text-[13px] text-muted-foreground">Structured sequential repair tasks</p>
                </div>
            </div>

            <div className="space-y-4">
                {tasks.map((task) => (
                    <div
                        key={task.step_number}
                        className="bg-[#111111] border border-border/10 rounded-xl p-5 hover:border-border/30 transition-colors relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                            <div className="w-32 h-32 bg-accent/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded border border-border/10 bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                                        <span className="text-[11px] font-mono text-muted-foreground">{task.step_number}</span>
                                    </div>
                                    <h4 className="font-medium text-base sm:text-lg text-foreground/90">{task.title}</h4>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[12px] px-2 py-0.5 rounded-md font-mono bg-border/5 text-muted-foreground border border-border/10">
                                        {task.category}
                                    </span>
                                    <span className={`text-[12px] px-2 py-0.5 rounded-md font-medium border ${difficultyColors[task.difficulty] || 'bg-border/5 text-muted-foreground border-border/10'}`}>
                                        {task.difficulty}
                                    </span>
                                    <span className="text-[12px] px-2 py-0.5 rounded-md font-mono bg-accent/10 border border-accent/20 text-accent flex items-center">
                                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                                        {task.estimated_minutes} min
                                    </span>
                                </div>
                            </div>

                            <p className="text-[14px] sm:text-[15px] text-zinc-300 leading-relaxed pl-9 mb-4">
                                {task.description}
                            </p>

                            <div className="pl-9 space-y-3">
                                {task.tools_needed && task.tools_needed.length > 0 && (
                                    <div className="flex items-start gap-2">
                                        <Wrench className="w-4 h-4 text-muted-foreground/60 mt-0.5 shrink-0" />
                                        <div className="flex flex-wrap gap-1.5">
                                            {task.tools_needed.map((tool, idx) => (
                                                <span key={idx} className="text-[12px] sm:text-[13px] px-2 py-0.5 bg-[#1a1a1a] border border-border/5 rounded text-zinc-400">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {task.torque_specs && (
                                    <div className="flex items-center gap-2 text-[13px] sm:text-[14px] bg-[#1a1a1a] border border-border/5 p-2 rounded-md inline-flex">
                                        <span className="text-muted-foreground font-mono">Torque:</span>
                                        <span className="text-zinc-300 font-medium">{task.torque_specs}</span>
                                    </div>
                                )}

                                {task.safety_notes && (
                                    <div className="flex items-start gap-2 mt-2 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-md">
                                        <AlertTriangle className="w-4 h-4 text-yellow-500/70 mt-0.5 shrink-0" />
                                        <p className="text-[13px] sm:text-[14px] text-yellow-500/90 leading-relaxed">
                                            {task.safety_notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}