import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/mia/common/SearchableSelect";

type Option = { value: string; label: string; subtitle?: string };

export function SelectMechanicControl({ options, value, onChange }: { options: Option[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="mechanic">Assign Mechanic *</Label>
      <SearchableSelect
        options={options}
        value={value}
        onValueChange={onChange}
        placeholder="Search and select a mechanic..."
        searchPlaceholder="Search by name or code..."
        emptyText="No mechanics found."
      />
    </div>
  );
}
