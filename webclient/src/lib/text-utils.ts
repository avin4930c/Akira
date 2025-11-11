/**
 * Highlights matching text in a string
 * @param text - The text to search in
 * @param query - The search query to highlight
 * @returns Array of text segments with highlight information
 */
export function highlightText(text: string, query: string): Array<{ text: string; highlight: boolean }> {
    if (!query || !text) {
        return [{ text, highlight: false }];
    }

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) {
        return [{ text, highlight: false }];
    }

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    const result: Array<{ text: string; highlight: boolean }> = [];
    
    if (before) result.push({ text: before, highlight: false });
    if (match) result.push({ text: match, highlight: true });
    if (after) result.push({ text: after, highlight: false });

    return result;
}