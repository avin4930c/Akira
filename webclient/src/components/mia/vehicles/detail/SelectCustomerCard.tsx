import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/mia/common/SearchableSelect";
import { useState, useMemo } from "react";
import { useDebouncedValue } from "@/hooks/common/useDebouncedValue";
import { useCustomerSearchSuggestions } from "@/hooks/customer/useCustomer";
import type { Customer } from "@/types/mia";

interface SelectCustomerCardProps {
    value: string;
    onChange: (value: string) => void;
    selectedCustomer?: Customer | null;
}

export function SelectCustomerCard({ value, onChange, selectedCustomer }: SelectCustomerCardProps) {
    const [search, setSearch] = useState("");
    const debounced = useDebouncedValue(search, 400);
    const { data: suggestions, isLoading } = useCustomerSearchSuggestions(debounced);

    const options = useMemo(() => {
        const base = (suggestions ?? []).map((c) => ({
            value: c.id,
            label: c.name,
            subtitle: `${c.phone} • ${c.email}`,
        }));
        if (value && selectedCustomer && !base.some(o => o.value === value)) {
            base.unshift({ value: selectedCustomer.id, label: selectedCustomer.name, subtitle: `${selectedCustomer.phone} • ${selectedCustomer.email}` });
        }
        return base;
    }, [suggestions, selectedCustomer, value]);

    return (
        <div className="glass-card p-6 rounded-xl">
            <Label className="text-base font-semibold mb-3 block">Select Customer</Label>
            <SearchableSelect
                options={options}
                value={value}
                onValueChange={onChange}
                placeholder="Search and select a customer..."
                searchPlaceholder="Search by name, phone, or email..."
                emptyText={debounced ? "No customers found." : "Type to search customers..."}
                onSearchChange={setSearch}
                loading={isLoading}
            />
        </div>
    );
}