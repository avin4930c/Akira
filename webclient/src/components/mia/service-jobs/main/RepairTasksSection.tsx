import { Wrench, Clock, AlertTriangle, ToolCase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RepairTask } from "@/types/mia";
import { difficultyColors, taskCategoryColors } from "@/constants/mia/colors";

export function RepairTasksSection({ tasks }: { tasks: RepairTask[] }) {
    return (
        <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <ToolCase className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Repair Tasks</h3>
            </div>

            <div className="space-y-4">
                {tasks.map((task) => (
                    <div
                        key={task.step_number}
                        className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-3"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-sm font-bold text-primary">{task.step_number}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-base mb-1">{task.title}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {task.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pl-11">
                            <Badge variant="outline" className={taskCategoryColors[task.category] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}>
                                {task.category}
                            </Badge>
                            <Badge variant="outline" className={difficultyColors[task.difficulty]}>
                                {task.difficulty}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                <Clock className="w-3 h-3 mr-1" />
                                {task.estimated_minutes} min
                            </Badge>
                        </div>

                        {task.tools_needed.length > 0 && (
                            <div className="pl-11 pt-2">
                                <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                    <Wrench className="w-3 h-3" />
                                    Tools Needed:
                                </div>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    {task.tools_needed.map((tool, idx) => (
                                        <li key={idx}>{tool}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {task.safety_notes && (
                            <div className="pl-11 pt-2">
                                <div className="flex items-start gap-2 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/30">
                                    <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-semibold text-yellow-400 mb-1">Safety Notes</div>
                                        <p className="text-xs text-yellow-200/80">{task.safety_notes}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {task.torque_specs && (
                            <div className="pl-11 pt-2">
                                <div className="flex items-start gap-2 p-3 rounded-md bg-blue-500/10 border border-blue-500/30">
                                    <div className="text-xs">
                                        <span className="font-semibold text-blue-400">Torque Specs: </span>
                                        <span className="text-blue-200/80">{task.torque_specs}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}