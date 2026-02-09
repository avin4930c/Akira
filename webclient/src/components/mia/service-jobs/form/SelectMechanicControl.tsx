import { SelectField } from "@/components/mia/common/SelectField";
import type { SelectOption } from "@/types/mia";

export function SelectMechanicControl({ 
  options, 
  value, 
  onChange, 
  disabled = false,
  loading = false 
}: { 
  options: SelectOption[]; 
  value: string; 
  onChange: (v: string) => void; 
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <SelectField
      id="mechanic"
      label="Assign Mechanic"
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Search and select a mechanic..."
      searchPlaceholder="Search by name or code..."
      emptyText="No mechanics found."
      disabled={disabled}
      loading={loading}
    />
  );
}