import { list } from "postcss";

export const mechanicKeys = {
    all: ["mechanics"] as const,
    list: () => [...mechanicKeys.all, "list"] as const,
}