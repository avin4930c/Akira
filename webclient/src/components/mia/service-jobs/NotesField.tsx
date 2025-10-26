import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NotesField({ value, onChange, count }: { value: string; onChange: (v: string) => void; count: number }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Mechanic Notes / Diagnosis *</Label>
      <Textarea
        id="notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the issue, symptoms, and initial diagnosis... (minimum 10 characters)"
        className="glass-card min-h-[200px] resize-none"
      />
      <p className="text-xs text-muted-foreground">{count}/1000 characters</p>
    </div>
  );
}