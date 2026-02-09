import { getMechanics } from "@/actions/service-job";
import { useQuery } from "@tanstack/react-query";
import { mechanicKeys } from "./mehcanic-keys";

export function useMechanics() {
    const { data, error, isLoading } = useQuery({
        queryKey: mechanicKeys.list(),
        queryFn: () => getMechanics(),
        refetchOnWindowFocus: false,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return { data, error, isLoading };
}