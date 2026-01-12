import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/mia/common/SearchableSelect";
import { motion } from "framer-motion";
import type { SelectOption } from "@/types/mia";

export function SelectVehicleControl({
  options,
  value,
  onChange,
  visible,
  loading,
}: {
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  loading: boolean;
}) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="space-y-2"
    >
      <Label htmlFor="vehicle">Select Vehicle *</Label>
      {loading ? (
        <div className="p-4 rounded-lg border border-border/50 text-sm text-muted-foreground text-center">
          Loading vehicles...
        </div>
      ) : options.length === 0 ? (
        <div className="p-4 rounded-lg border border-border/50 text-sm text-muted-foreground text-center">
          This customer has no vehicles. Please add a vehicle first.
        </div>
      ) : (
        <SearchableSelect
          options={options}
          value={value}
          onValueChange={onChange}
          placeholder="Choose a vehicle..."
          searchPlaceholder="Search vehicles..."
          emptyText="No vehicles found."
        />
      )}
    </motion.div>
  );
}