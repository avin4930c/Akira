import { Button } from "@/components/ui/button";
import { CheckCircle2, X, Loader2 } from "lucide-react";

interface FormActionsProps {
  onSubmit: () => void;
  onCancel: () => void;
  disabled: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function FormActions({ 
  onSubmit, 
  onCancel, 
  disabled,
  submitLabel = "Validate via MIA",
  cancelLabel = "Cancel",
  loading = false,
}: FormActionsProps) {
  const isLoading = loading || (submitLabel?.includes("...") ?? false);
  
  return (
    <div className="flex gap-4 pt-4">
      <Button 
        onClick={onSubmit} 
        className="flex-1 bg-gradient-to-r from-primary to-blue-500 hover:opacity-90" 
        disabled={disabled || loading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <CheckCircle2 className="w-4 h-4 mr-2" />
        )}
        {submitLabel}
      </Button>
      <Button 
        variant="outline" 
        className="flex-1 border-primary/30 hover:bg-primary/10" 
        onClick={onCancel} 
        disabled={loading}
      >
        <X className="w-4 h-4 mr-2" />
        {cancelLabel}
      </Button>
    </div>
  );
}