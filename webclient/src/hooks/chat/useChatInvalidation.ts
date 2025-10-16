import { useQueryClient } from '@tanstack/react-query';
import { chatKeys } from './chat-keys';

export function useChatInvalidation() {
    const queryClient = useQueryClient();

    const invalidateThreads = () => {
        queryClient.invalidateQueries({ queryKey: chatKeys.threads() });
    };

    const invalidateMessages = (threadId: string) => {
        queryClient.invalidateQueries({ queryKey: chatKeys.messages(threadId) });
    };

    const invalidateAllChatData = () => {
        queryClient.invalidateQueries({ queryKey: chatKeys.all });
    };

    const invalidateThreadAndMessages = (threadId: string) => {
        invalidateThreads();
        invalidateMessages(threadId);
    };

    return {
        invalidateThreads,
        invalidateMessages,
        invalidateAllChatData,
        invalidateThreadAndMessages,
    };
}