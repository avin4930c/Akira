import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MAX_NOTES_LENGTH = 10000;

export function NotesField({ value, onChange, count }: { value: string; onChange: (v: string) => void; count: number }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Mechanic Notes / Diagnosis (Free text) *</Label>
      <Textarea
        id="notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the issue, symptoms, and initial diagnosis... (minimum 10 characters)"
        className="glass-card min-h-[200px] resize-none"
        maxLength={MAX_NOTES_LENGTH}
      />
      <p className="text-xs text-muted-foreground">{count}/{MAX_NOTES_LENGTH} characters</p>
    </div>
  );
}