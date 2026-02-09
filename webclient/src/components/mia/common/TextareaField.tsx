import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minLength: number;
  maxLength: number;
  minHeight?: string;
  required?: boolean;
  disabled?: boolean;
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  minLength,
  maxLength,
  minHeight = "min-h-[120px]",
  required = true,
  disabled = false,
}: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && "*"}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`glass-card ${minHeight} resize-none`}
        minLength={minLength}
        maxLength={maxLength}
        disabled={disabled}
      />
      <p className="text-xs text-muted-foreground">
        {value.length}/{maxLength} characters
      </p>
    </div>
  );
}