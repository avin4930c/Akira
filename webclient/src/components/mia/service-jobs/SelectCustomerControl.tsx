import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/mia/common/SearchableSelect";

type Option = { value: string; label: string; subtitle?: string };

export function SelectCustomerControl({ options, value, onChange }: { options: Option[]; value: string; onChange: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <Label htmlFor="customer">Select Customer *</Label>
            <SearchableSelect
                options={options}
                value={value}
                onValueChange={onChange}
                placeholder="Search and select a customer..."
                searchPlaceholder="Search by name, phone, or email..."
                emptyText="No customers found."
            />
        </div>
    );
}