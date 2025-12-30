from enum import Enum


class ServiceJobStatus(str, Enum):
    pending = "pending"
    in_progress = "in-progress"
    completed = "completed"
    validated = "validated"


class TaskDifficultyLevel(str, Enum):
    easy = "easy"
    moderate = "moderate"
    advanced = "advanced"


class ServiceJobPriorityLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class PartPriority(str, Enum):
    required = "required"
    recommended = "recommended"
    optional = "optional"


class TaskCategory(str, Enum):
    inspection = "inspection"
    repair = "repair"
    replacement = "replacement"
    adjustment = "adjustment"
    cleaning = "cleaning"


class TipCategory(str, Enum):
    safety = "safety"
    efficiency = "efficiency"
    quality = "quality"
    cost_saving = "cost_saving"