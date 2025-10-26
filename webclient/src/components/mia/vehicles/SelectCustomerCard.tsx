import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/mia/common/SearchableSelect";

interface Option {
    value: string;
    label: string;
    subtitle?: string;
}

interface SelectCustomerCardProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
}

export function SelectCustomerCard({ options, value, onChange }: SelectCustomerCardProps) {
    return (
        <div className="glass-card p-6 rounded-xl">
            <Label className="text-base font-semibold mb-3 block">Select Customer</Label>
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