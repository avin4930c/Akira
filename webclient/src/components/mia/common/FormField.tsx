import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { UseFormRegister, FieldErrors, RegisterOptions } from "react-hook-form";

interface FormFieldProps<T extends Record<string, any>> {
  id: string;
  label: string;
  placeholder: string;
  type?: "text" | "number" | "date" | "email" | "tel";
  register: UseFormRegister<T>;
  fieldName: keyof T;
  errors: FieldErrors<T>;
  registerOptions?: RegisterOptions;
  required?: boolean;
}

export function FormField<T extends Record<string, any>>({
  id,
  label,
  placeholder,
  type = "text",
  register,
  fieldName,
  errors,
  registerOptions,
  required = false,
}: FormFieldProps<T>) {
  const error = errors[fieldName];
  const fieldNameStr = String(fieldName);

  return (
    <div>
      <Label htmlFor={id}>
        {label} {required && "*"}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="mt-1.5"
        {...(registerOptions ? register(fieldNameStr as any, registerOptions as any) : register(fieldNameStr as any))}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {String(error.message || "Invalid value")}
        </p>
      )}
    </div>
  );
}