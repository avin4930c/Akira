import { Button } from "@/components/ui/button";
import { CheckCircle2, Save } from "lucide-react";

export function FormActions({ onValidate, onSaveDraft, disabled }: { onValidate: () => void; onSaveDraft: () => void; disabled: boolean }) {
  return (
    <div className="flex gap-4 pt-4">
      <Button onClick={onValidate} className="flex-1 bg-gradient-to-r from-primary to-blue-500 hover:opacity-90" disabled={disabled}>
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Validate via MIA
      </Button>
      <Button variant="outline" className="flex-1 border-primary/30 hover:bg-primary/10" onClick={onSaveDraft} disabled={disabled}>
        <Save className="w-4 h-4 mr-2" />
        Save as Draft
      </Button>
    </div>
  );
}