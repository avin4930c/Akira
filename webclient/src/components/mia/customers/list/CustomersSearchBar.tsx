import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomersSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export function CustomersSearchBar({ value, onChange }: CustomersSearchBarProps) {
    return (
        <div className="relative">
            <Search className="absolute z-10 left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
                placeholder="Search customers by Id, Name or Email"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 bg-[#111111] border border-border/10 rounded-md focus-visible:ring-1 focus-visible:ring-accent"
            />
        </div>
    );
}