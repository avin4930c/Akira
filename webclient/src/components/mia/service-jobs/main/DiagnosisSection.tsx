import { Activity } from "lucide-react";

export function DiagnosisSection({ text }: { text: string }) {
    return (
        <div className="w-full relative bg-[#111111] border border-border/10 rounded-xl p-6 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                <div className="w-32 h-32 bg-accent/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10" />
            </div>
            
            <div className="relative z-10 flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#161616] border border-border/20 shadow-sm">
                    <Activity className="w-4 h-4 text-accent" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground/90">Diagnostic Analysis</h3>
            </div>
            
            <p className="text-[15px] sm:text-base text-zinc-300 leading-relaxed font-medium">
                {text}
            </p>
        </div>
    );
}