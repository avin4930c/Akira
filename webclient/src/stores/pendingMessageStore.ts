import { create } from 'zustand';

interface PendingMessage {
    message: string;
    threadId: string;
    timestamp: number;
}

interface PendingMessageStore {
    pendingMessages: Map<string, PendingMessage>;

    setPendingMessage: (threadId: string, message: string) => void;

    consumePendingMessage: (threadId: string) => string | null;

    hasPendingMessage: (threadId: string) => boolean;

    clearOldMessages: () => void;
}

export const usePendingMessageStore = create<PendingMessageStore>((set, get) => ({
    pendingMessages: new Map(),

    setPendingMessage: (threadId: string, message: string) => {
        set((state) => {
            const newMap = new Map(state.pendingMessages);
            newMap.set(threadId, {
                message,
                threadId,
                timestamp: Date.now(),
            });
            return { pendingMessages: newMap };
        });
    },

    consumePendingMessage: (threadId: string) => {
        const state = get();
        const pendingMessage = state.pendingMessages.get(threadId);

        if (pendingMessage) {
            set((state) => {
                const newMap = new Map(state.pendingMessages);
                newMap.delete(threadId);
                return { pendingMessages: newMap };
            });
            return pendingMessage.message;
        }

        return null;
    },

    hasPendingMessage: (threadId: string) => {
        return get().pendingMessages.has(threadId);
    },

    clearOldMessages: () => {
        set(() => {
            return { pendingMessages: new Map() };
        });
    },
}));