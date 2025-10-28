from enum import Enum

class ServiceJobStatus(str, Enum):
    pending = "pending"
    in_progress = "in-progress"
    completed = "completed"
    validated = "validated"