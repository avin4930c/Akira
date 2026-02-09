import { SelectField } from "@/components/mia/common/SelectField";
import type { SelectOption } from "@/types/mia";

interface SelectCustomerControlProps {
    options: SelectOption[];
    value: string;
    onChange: (v: string) => void;
    loading?: boolean;
    disabled?: boolean;
}

export function SelectCustomerControl({ options, value, onChange, loading = false, disabled = false }: SelectCustomerControlProps) {
    return (
        <SelectField
            id="customer"
            label="Select Customer"
            options={options}
            value={value}
            onChange={onChange}
            placeholder="Search and select a customer..."
            searchPlaceholder="Search by Customer Id"
            emptyText="No customers found."
            loading={loading}
            disabled={disabled}
        />
    );
}