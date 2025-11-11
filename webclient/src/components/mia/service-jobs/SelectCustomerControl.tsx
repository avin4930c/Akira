import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/mia/common/SearchableSelect";

type Option = { value: string; label: string; subtitle?: string };

interface SelectCustomerControlProps {
    options: Option[];
    value: string;
    onChange: (v: string) => void;
    loading?: boolean;
}

export function SelectCustomerControl({ options, value, onChange, loading = false }: SelectCustomerControlProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="customer">Select Customer *</Label>
            <SearchableSelect
                options={options}
                value={value}
                onValueChange={onChange}
                placeholder="Search and select a customer..."
                searchPlaceholder="Search by Customer Id"
                emptyText={"No customers found."}
                loading={loading}
            />
        </div>
    );
}