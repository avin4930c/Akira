import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle2 } from "lucide-react";
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
            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
            : status === ServiceJobStatus.Completed
                ? "bg-green-500/10 text-green-500 border-green-500/20"
                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";

    const handleRevalidateClick = () => {
        onRevalidate();
        toast.warning("This feature is not implemented yet. Please check back later.");
    };

    const handleValidateConfirm = () => {
        onValidate();
        setShowValidateConfirm(false);
    };

    return (
        <>
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <Badge variant="outline" className={statusClass}>{status}</Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">Job ID: {jobId}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-primary/30 hover:bg-primary/10" onClick={handleRevalidateClick}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Re-Validate
                    </Button>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90" onClick={() => setShowValidateConfirm(true)} disabled={isValidated}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {isValidated ? "Already validated" : "Mark as Validated"}
                    </Button>
                </div>
            </div>

            <AlertDialog open={showValidateConfirm} onOpenChange={setShowValidateConfirm}>
                <AlertDialogContent className="bg-background border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Validate Service Job</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            Are you sure you want to validate this service job? This will mark the job as validated and process it through the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleValidateConfirm}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90"
                        >
                            Validate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}