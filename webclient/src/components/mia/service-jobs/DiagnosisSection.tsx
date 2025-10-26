import { Wrench } from "lucide-react";

export function DiagnosisSection({ text }: { text: string }) {
    return (
        <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Diagnosis Summary</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{text}</p>
        </div>
    );
}