import { Mail, Phone, User } from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";

interface OwnerInfoCardProps {
    name: string;
    phone: string;
    email: string;
    userId: string;
}

export function OwnerInfoCard({ name, phone, email, userId }: OwnerInfoCardProps) {
    return (
        <div className="bg-[#111111] border border-border/10 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Owner Information</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium mt-1">{name}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                    </div>
                    <div className="font-medium mt-1">{phone}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                    </div>
                    <div className="font-medium mt-1">{email}</div>
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">User ID</div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="font-mono text-sm">{userId}</div>
                        <CopyButton text={userId} />
                    </div>
                </div>
            </div>
        </div>
    );
}