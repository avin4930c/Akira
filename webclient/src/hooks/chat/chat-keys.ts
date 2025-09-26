export const chatKeys = {
  all: ['chat'] as const,
  threads: () => [...chatKeys.all, 'threads'] as const,
  messages: (threadId: string) => [...chatKeys.all, 'messages', threadId] as const,
}