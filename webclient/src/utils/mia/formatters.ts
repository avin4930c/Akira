export function formatEstimatedTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
}

export function capitalizeStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
}