import os
from dotenv import load_dotenv
import logging

load_dotenv(override=True)

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# assert GEMINI_API_KEY, "GEMINI_API_KEY is not set"
# logging.info("GEMINI_API_KEY is set")

# GEMINI_API_SECRET = os.getenv("GEMINI_API_SECRET")
# assert GEMINI_API_SECRET, "GEMINI_API_SECRET is not set"
# logging.info("GEMINI_API_SECRET is set")

# GEMINI_API_URL = os.getenv("GEMINI_API_URL")
# assert GEMINI_API_URL, "GEMINI_API_URL is not set"
# logging.info("GEMINI_API_URL is set")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")