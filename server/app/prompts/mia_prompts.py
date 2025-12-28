from langchain_core.prompts import ChatPromptTemplate

MIA_RAG_QUERY_GENERATION_PROMPT = ChatPromptTemplate.from_template(
    """You are an expert motorcycle mechanic assistant.
Analyze the following service job details to create a targeted search query for the technical manual.

Service Type: {service_info}
Mechanic Notes: {mechanic_notes}

Identify the core technical problems, symptoms, or maintenance procedures mentioned.
Formulate a concise search query to find relevant repair procedures, specifications, or troubleshooting guides.
Return ONLY the search query text, no other commentary."""
)