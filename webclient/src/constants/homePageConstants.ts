import { MessageCircle, Wrench, Cpu, Database, FileSearch, Globe, Package } from "lucide-react";

export const features = [
    {
        icon: Wrench,
        title: 'MIA — Mechanic Intelligence Assistant',
        description: 'A multi-step AI diagnostic pipeline for professional mechanics. Submit a service job and MIA generates structured repair plans with real parts from your inventory.',
        features: [
            'Parallel RAG retrieval (pgvector) + Tavily web search for grounded diagnostics',
            'Structured TechnicalPlanResponse with repair tasks, parts, tips & estimated hours',
            'RabbitMQ job queue with Redis Pub/Sub → SSE progress streaming',
            'Semantic inventory matching to suggest real parts from your workshop stock',
        ],
        cta: 'Explore MIA',
        href: '/mia',
        gradient: 'from-orange-500 to-amber-600'
    },
    {
        icon: MessageCircle,
        title: 'Akira Chat',
        description: 'A conversational AI assistant built on LangGraph and Gemini, purpose-built for motorcycle riders. Ask anything — from troubleshooting a sputtering engine to choosing the right tire compound.',
        features: [
            'Real-time WebSocket streaming with token-by-token output',
            'LangGraph StateGraph workflow with conditional title generation & summarization',
            'Context-aware conversations with automatic thread summarization',
            'Markdown rendering with syntax highlighting and copy support',
        ],
        cta: 'Try Chat',
        href: '/chat',
        gradient: 'from-amber-600 to-orange-500'
    }
];

export const steps = [
    {
        number: '01',
        icon: MessageCircle,
        title: 'Ask or Submit',
        description: 'Type a question in Akira Chat or submit a service job to MIA with vehicle details and symptoms.',
    },
    {
        number: '02',
        icon: Cpu,
        title: 'AI Processes',
        description: 'LangGraph workflows analyze your input — Chat streams a response in real-time, MIA runs a multi-step diagnostic pipeline via RabbitMQ.',
    },
    {
        number: '03',
        icon: Wrench,
        title: 'Get Results',
        description: 'Receive expert guidance instantly in chat, or a full diagnostic plan with repair tasks, parts, and tips from MIA.',
    },
];
export const pipelineSteps = [
    {
        icon: FileSearch,
        label: 'Ingest',
        detail: 'Vehicle data, symptoms & customer context',
    },
    {
        icon: Database,
        label: 'RAG Retrieval',
        detail: 'pgvector semantic search across service manuals',
    },
    {
        icon: Globe,
        label: 'Web Search',
        detail: 'Tavily queries for TSBs, recalls & known issues',
    },
    {
        icon: Cpu,
        label: 'LLM Analysis',
        detail: 'Gemini generates structured TechnicalPlanResponse',
    },
    {
        icon: Package,
        label: 'Inventory Match',
        detail: 'Semantic matching against real workshop parts stock',
    },
];

export const infrastructureCallouts = [
    { label: 'Job Queue', value: 'RabbitMQ', detail: 'Async job processing' },
    { label: 'Progress Stream', value: 'Redis -> SSE', detail: 'Real-time updates to client' },
    { label: 'Embeddings', value: 'pgvector', detail: 'Semantic similarity search' },
];

export const stack = [
    { name: 'Next.js', category: 'frontend' },
    { name: 'React', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'Tailwind CSS', category: 'frontend' },
    { name: 'Framer Motion', category: 'frontend' },
    { name: 'Zustand', category: 'frontend' },
    { name: 'TanStack Query', category: 'frontend' },
    { name: 'FastAPI', category: 'backend' },
    { name: 'LangGraph', category: 'backend' },
    { name: 'Gemini', category: 'backend' },
    { name: 'PostgreSQL', category: 'backend' },
    { name: 'pgvector', category: 'backend' },
    { name: 'RabbitMQ', category: 'backend' },
    { name: 'Redis', category: 'backend' },
    { name: 'SQLModel', category: 'backend' },
    { name: 'Tavily', category: 'backend' },
    { name: 'Clerk', category: 'infra' },
    { name: 'Docker', category: 'infra' },
    { name: 'WebSocket', category: 'infra' },
    { name: 'SSE', category: 'infra' },
];

export const categoryColors: Record<string, string> = {
    frontend: 'border-orange-500/30 text-orange-500',
    backend: 'border-zinc-400/30 text-zinc-400',
    infra: 'border-amber-200/30 text-amber-200',
};
