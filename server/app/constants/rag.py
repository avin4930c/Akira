# =============================================================================
# File Upload Limits
# =============================================================================

# Maximum file size for PDF uploads (in MB)
MAX_FILE_SIZE_MB: int = 50

# Maximum file size in bytes (derived from MB)
MAX_FILE_SIZE_BYTES: int = MAX_FILE_SIZE_MB * 1024 * 1024

# =============================================================================
# File Validation
# =============================================================================

# PDF magic bytes - PDF files start with %PDF
PDF_MAGIC_BYTES: bytes = b"%PDF"

# Supported file extensions for ingestion
SUPPORTED_FILE_EXTENSIONS: tuple[str, ...] = (".pdf",)

# =============================================================================
# Chunking Configuration
# =============================================================================

# Default chunk size in tokens
DEFAULT_CHUNK_SIZE: int = 512

# Default overlap between chunks in tokens
DEFAULT_CHUNK_OVERLAP: int = 50

# Token encoding name for tiktoken
DEFAULT_TOKEN_ENCODING: str = "cl100k_base"

from app.settings.settings import settings

# =============================================================================
# Embedding Configuration
# =============================================================================

# Embedding vector dimension
# Dynamically set based on configuration
EMBEDDING_DIMENSION: int = settings.LOCAL_EMBEDDING_DIMENSION if settings.USE_LOCAL_EMBEDDINGS else 3072

# Batch size for embedding API calls
EMBEDDING_BATCH_SIZE: int = 100

# Maximum retries for rate-limited embedding requests
EMBEDDING_MAX_RETRIES: int = 3

# Delay between embedding batches (seconds)
EMBEDDING_BATCH_DELAY: float = 0.5

# =============================================================================
# Search Configuration
# =============================================================================

# Default number of results to return
DEFAULT_TOP_K: int = 5

# Default context window for retrieve_with_context
DEFAULT_CONTEXT_WINDOW: int = 1

# =============================================================================
# Rag Request Text Length Limits
# =============================================================================

MAX_TEXT_LENGTH = 1_000_000  # 1M chars (~250K tokens)
MAX_QUERY_LENGTH = 2_000
MAX_SOURCE_LENGTH = 500