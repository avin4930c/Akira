import { api } from "@/services/api/client";
import { ChatMessage, ChatThread } from "@/types/chat";

export async function createThread(title: string): Promise<ChatThread> {
    try {
        const response = await api.post<ChatThread, {}>(`/chat/threads?title=${title}`, {});
        return response;
    } catch (error) {
        console.error('Error creating new chat thread:', error);
        throw error;
    }
}

export async function getUserChatThreads(): Promise<ChatThread[]> {
    try {
        const response = await api.get<ChatThread[]>('/chat/threads');
        return response;
    } catch (error) {
        console.error('Error fetching user chat threads:', error);
        throw error;
    }
}

export async function getThreadMessages(threadId: string): Promise<ChatMessage[]> {
    try {
        const response = await api.get<ChatMessage[]>(`/chat/threads/${threadId}/messages`);
        return response;
    } catch (error) {
        console.error('Error fetching thread messages:', error);
        throw error;
    }
}