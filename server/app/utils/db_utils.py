def escape_like_pattern(value: str) -> str:
    """
    Escape special characters in SQL LIKE/ILIKE patterns to prevent injection.
    
    Special characters in LIKE patterns:
    - % : matches any sequence of characters
    - _ : matches any single character
    - \\ : escape character
    
    Args:
        value: The raw string to be used in a LIKE pattern.
        
    Returns:
        The escaped string safe for use in LIKE/ILIKE queries.
        
    Example:
        >>> escape_like_pattern("50% off")
        '50\\% off'
        >>> escape_like_pattern("user_name")
        'user\\_name'
    """
    if not value:
        return value
    # Escape backslash first, then % and _
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")