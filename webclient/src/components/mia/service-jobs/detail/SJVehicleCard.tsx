export function SJVehicleCard({ title, registration, mileage }: { title: string; registration: string; mileage: string }) {
    return (
        <div className="glass-card p-6 rounded-xl">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">VEHICLE</h3>
            <div className="space-y-2">
                <div className="text-lg font-bold">{title}</div>
                <div className="text-sm text-muted-foreground">Registration: {registration}</div>
                <div className="text-sm text-muted-foreground">Mileage: {mileage}</div>
            </div>
        </div>
    );
}