import { TextareaField } from "@/components/mia/common/TextareaField";
import { MAX_SERVICE_INFO_LENGTH, MIN_SERVICE_INFO_LENGTH } from "@/constants/notesFieldConstants";

export function ServiceInfoField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <TextareaField
      id="service-info"
      label="Service Information"
      value={value}
      onChange={onChange}
      placeholder="Describe the service requested (e.g., Oil change, Brake inspection, General maintenance)... (minimum 5 characters)"
      minLength={MIN_SERVICE_INFO_LENGTH}
      maxLength={MAX_SERVICE_INFO_LENGTH}
      minHeight="min-h-[120px]"
    />
  );
}