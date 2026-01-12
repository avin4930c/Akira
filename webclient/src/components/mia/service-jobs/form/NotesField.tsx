import { TextareaField } from "@/components/mia/common/TextareaField";
import { MAX_NOTES_LENGTH, MIN_NOTES_LENGTH } from "@/constants/notesFiledConstants";

export function NotesField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <TextareaField
      id="notes"
      label="Mechanic Notes / Diagnosis (Free text)"
      value={value}
      onChange={onChange}
      placeholder="Describe the issue, symptoms, and initial diagnosis... (minimum 10 characters)"
      minLength={MIN_NOTES_LENGTH}
      maxLength={MAX_NOTES_LENGTH}
      minHeight="min-h-[200px]"
    />
  );
}