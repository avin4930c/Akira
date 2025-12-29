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

MIA_WEB_SEARCH_QUERY_PROMPT = ChatPromptTemplate.from_template(
    """You are an expert motorcycle mechanic assistant.
Generate a web search query to find external information about a motorcycle service issue.

Vehicle: {year} {make} {model}
Service Type: {service_info}
Mechanic Notes: {mechanic_notes}

Create a search query optimized for finding:
- Common issues and fixes for this specific motorcycle model
- Technical Service Bulletins (TSBs) or recalls
- Community forum discussions about similar problems
- Parts compatibility and replacement guides

Return ONLY the search query text, no other commentary.
Keep the query concise but include the motorcycle make/model/year for specificity."""
)