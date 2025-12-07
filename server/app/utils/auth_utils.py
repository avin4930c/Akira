import re
from typing import Optional, List
from fastapi import Request, HTTPException
from jwt import PyJWTError, decode
from app.settings.settings import settings


class AuthUtil:
    def __init__(self):
        self.public_key = settings.CLERK_JWT_PUBLIC_KEY

    def get_user_id_from_token(self, session_token: str | None) -> str | None:
        """
        Decode and validate JWT token using Clerk's public key
        Returns user ID from token subject claim
        """
        try:
            if not session_token:
                raise HTTPException(status_code=401, detail="Missing or invalid token")

            if not self.public_key:
                raise HTTPException(status_code=500, detail="Server configuration error: Missing Clerk public key")

            payload = decode(
                session_token,
                self.public_key,
                algorithms=["RS256"],
                options={"verify_aud": False},
            )
            return payload["sub"]
        except PyJWTError as e:
            raise HTTPException(
                status_code=401, detail=f"Invalid token: {str(e)}"
            ) from e

    @staticmethod
    def extract_bearer_token(request: Request) -> Optional[str]:
        """Extract bearer token from Authorization header"""
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None

        if not auth_header.startswith("Bearer "):
            return None

        parts = auth_header.split(" ")
        if len(parts) != 2:
            return None

        return parts[1]

    @staticmethod
    def is_public_route(
        path: str, method: str, public_routes: List[re.Pattern]
    ) -> bool:
        """Check if route is public and doesn't require authentication"""

        # Handle CORS preflight requests
        if method == "OPTIONS":
            return True

        for pattern in public_routes:
            if pattern.match(path):
                return True

        return False


auth_util = AuthUtil()