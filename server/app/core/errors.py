class AppError(Exception):
    """Base application error."""


class ConflictError(AppError):
    """Raised when a resource already exists or violates a unique constraint."""


class ValidationError(AppError):
    """Raised when input validation fails beyond Pydantic schema checks."""