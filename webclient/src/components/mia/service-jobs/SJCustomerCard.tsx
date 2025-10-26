export function SJCustomerCard({ name, phone, email }: { name: string; phone: string; email: string }) {
    return (
        <div className="glass-card p-6 rounded-xl">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">CUSTOMER</h3>
            <div className="space-y-2">
                <div className="text-lg font-bold">{name}</div>
                <div className="text-sm text-muted-foreground">{phone}</div>
                <div className="text-sm text-muted-foreground">{email}</div>
            </div>
        </div>
    );
}