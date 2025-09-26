import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "./chat-keys";
import { createThread, getThreadMessages, getUserChatThreads } from "@/actions/chat";

export function useChatThreads() {
    const { data, error, isLoading } = useQuery({
        queryKey: chatKeys.threads(),
        queryFn: () => getUserChatThreads(),
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    return { data, error, isLoading }
}

export const useCreateThreadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (title: string) => createThread(title),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
            return data;
        },
        onError: (error) => {
            console.error("Error creating chat thread:", error);
            throw error;
        }
    });
}

export function useThreadMessages(threadId: string) {
    const {data, error, isLoading} = useQuery({
        queryKey: chatKeys.messages(threadId),
        queryFn: () => getThreadMessages(threadId),
        refetchOnWindowFocus: false,
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!threadId,
    })

    return { data, error, isLoading}
}