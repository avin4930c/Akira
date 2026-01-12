import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/mia/common/SearchableSelect";
import type { SelectOption } from "@/types/mia";

interface SelectFieldProps {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  loading?: boolean;
  required?: boolean;
}

export function SelectField({
  id,
  label,
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  loading = false,
  required = true,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && "*"}
      </Label>
      <SearchableSelect
        options={options}
        value={value}
        onValueChange={onChange}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        emptyText={emptyText}
        loading={loading}
      />
    </div>
  );
}