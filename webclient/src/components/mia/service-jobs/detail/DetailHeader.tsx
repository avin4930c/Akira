import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, LayoutTemplate, Download } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { ServiceJobStatus } from "@/types/mia";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DetailHeaderProps {
    title: string;
    jobId: string;
    status: ServiceJobStatus;
    onRevalidate: () => void;
    onValidate: () => void;
}

export function DetailHeader({ title, jobId, status, onRevalidate, onValidate }: DetailHeaderProps) {
    const [showValidateConfirm, setShowValidateConfirm] = useState(false);
    const isValidated = status === ServiceJobStatus.Validated;

    const statusClass =
        status === ServiceJobStatus.Validated
            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
            : status === ServiceJobStatus.Completed
                ? "bg-[#27C93F]/10 text-[#27C93F] border-[#27C93F]/20"
                : "bg-[#FFBD2E]/10 text-[#FFBD2E] border-[#FFBD2E]/20";

    const handleRevalidateClick = () => {
        onRevalidate();
        toast.warning("This feature is not implemented yet. Please check back later.");
    };

    const handleExportPdf = () => {
        toast.info("PDF Export will be implemented soon");
    };

    const handleValidateConfirm = () => {
        onValidate();
        setShowValidateConfirm(false);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mb-2 border-b border-border/10">
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex w-12 h-12 rounded-xl bg-[#111] border border-border/20 items-center justify-center">
                        <LayoutTemplate className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground/90">{title}</h1>
                            <span className={cn("text-[11px] px-2 py-0.5 rounded font-medium border uppercase tracking-wider", statusClass)}>
                                {status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-[13px] text-muted-foreground font-mono mt-1 flex items-center gap-2">
                            <span>JOB ID:</span> 
                            <span className="text-foreground/70">{jobId}</span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="bg-[#111] border-border/10 hover:border-border/30 hover:bg-[#161616]" onClick={handleExportPdf}>
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Export PDF
                    </Button>
                    <Button variant="outline" size="sm" className="bg-[#111] border-border/10 hover:border-border/30 hover:bg-[#161616]" onClick={handleRevalidateClick}>
                        <RefreshCw className="w-3.5 h-3.5 mr-2" />
                        Re-run Pipeline
                    </Button>
                    {(status === ServiceJobStatus.Completed || status === ServiceJobStatus.Validated) && (
                        <Button 
                            size="sm"
                            className="bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 hover:text-accent font-medium shadow-none" 
                            onClick={() => setShowValidateConfirm(true)} 
                            disabled={isValidated}
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                            {isValidated ? "Validated" : "Commit Execution"}
                        </Button>
                    )}
                </div>
            </div>

            <AlertDialog open={showValidateConfirm} onOpenChange={setShowValidateConfirm}>
                <AlertDialogContent className="bg-[#111] border-border/20 sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Commit Execution Plan</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            This will freeze the current repair pipeline state. Submitting marks this job as validated and pushes events down the queue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="bg-[#161616] border-border/10 text-muted-foreground hover:bg-[#1a1a1a] hover:text-foreground">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleValidateConfirm}
                            className="bg-accent text-white hover:bg-accent/90 focus:ring-accent"
                        >
                            Validate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}