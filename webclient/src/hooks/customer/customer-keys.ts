export const customerKeys = {
    all: ['customers'] as const,
    lists: () => [...customerKeys.all, 'list'] as const,
    customer: (customerId: string) => [...customerKeys.all, 'customer', customerId] as const,
    searchSuggestion: (query: string) => [...customerKeys.all, 'searchSuggestions', query] as const,
}