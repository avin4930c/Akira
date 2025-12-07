from langchain_core.prompts import ChatPromptTemplate

THREAD_TITLE_PROMPT = ChatPromptTemplate.from_messages(
	[
		(
			"system",
			"""You are an assistant that names chat conversations.
Generate a short, descriptive title (max 60 characters) for the conversation below.
- Capture the main topic or intent.
- Avoid quotes, emojis, trailing punctuation, and generic words like "Chat" or "Conversation".
- Use Title Case.
If the content is insufficient, respond with: UNSURE""",
		),
		(
			"system",
			"Current title: {current_title}\nConversation transcript:\n{conversation}\n",
		),
		("human", "Provide the new title now."),
	]
)
