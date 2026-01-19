from enum import Enum


class ServiceJobStatus(str, Enum):
    pending = "pending"
    in_progress = "in-progress"
    completed = "completed"
    failed = "failed"
    validated = "validated"


class ProcessingStage(str, Enum):
    queued = "queued"
    fetching_vehicle_data = "fetching_vehicle_data"
    researching = "researching"
    generating_plan = "generating_plan"
    checking_inventory = "checking_inventory"
    completed = "completed"
    failed = "failed"

    @property
    def label(self) -> str:
        labels = {
            "queued": "Queued for processing...",
            "fetching_vehicle_data": "Loading vehicle information...",
            "researching": "Researching technical resources...",
            "generating_plan": "AI generating repair plan...",
            "checking_inventory": "Checking parts availability...",
            "completed": "Plan ready!",
            "failed": "Processing failed",
        }
        return labels.get(self.value, self.value)

    @property
    def progress(self) -> int:
        progress_map = {
            "queued": 0,
            "fetching_vehicle_data": 10,
            "researching": 30,
            "generating_plan": 60,
            "checking_inventory": 85,
            "completed": 100,
            "failed": 0,
        }
        return progress_map.get(self.value, 0)


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