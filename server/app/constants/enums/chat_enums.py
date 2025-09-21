from enum import Enum

class SenderEnum(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"