from pydantic import BaseModel, Field
from typing import List, Optional
from app.constants.enums.mia_enums import (
    TaskDifficultyLevel,
    ServiceJobPriorityLevel,
    PartPriority,
    TaskCategory,
    TipCategory,
)
from app.model.sql_models.mia import PartAvailabilityStatus


class SuggestedPart(BaseModel):
    """A part suggested by the LLM for the service job (before inventory validation)."""

    name: str = Field(description="Name of the part")
    description: str = Field(description="Why this part is needed for the service")
    quantity: int = Field(default=1, ge=1, description="Quantity required")
    category: Optional[str] = Field(
        default=None, description="Part category (e.g., brake, chain, electrical, engine)"
    )
    priority: PartPriority = Field(
        default=PartPriority.required,
        description="How critical this part is for the job",
    )


class RepairTask(BaseModel):
    step_number: int = Field(ge=1, description="Order of execution")
    title: str = Field(description="Short title of the task")
    description: str = Field(description="Detailed instructions for the task")
    category: TaskCategory = Field(description="Type of task")
    estimated_minutes: int = Field(
        ge=1, description="Estimated time to complete in minutes"
    )
    difficulty: TaskDifficultyLevel = Field(description="Difficulty level of the task")
    tools_needed: List[str] = Field(
        default_factory=list, description="Tools required for this task"
    )
    safety_notes: Optional[str] = Field(
        default=None, description="Safety warnings or precautions for this task"
    )
    torque_specs: Optional[str] = Field(
        default=None,
        description="Torque specifications if applicable (e.g., '25 Nm for brake caliper bolts')",
    )


class MechanicTip(BaseModel):
    tip: str = Field(description="The tip content")
    category: TipCategory = Field(description="Category of the tip")


class TechnicalPlanResponse(BaseModel):
    diagnosis_summary: str = Field(
        description="Summary of the diagnosed issue(s) and root cause analysis"
    )
    repair_tasks: List[RepairTask] = Field(
        description="Ordered list of tasks to complete the service"
    )
    suggested_parts: List[SuggestedPart] = Field(
        default_factory=list, description="Parts needed for the service"
    )
    tips: List[MechanicTip] = Field(
        default_factory=list, description="Helpful tips for the mechanic"
    )
    estimated_total_minutes: int = Field(
        ge=0, description="Total estimated time for all tasks in minutes"
    )
    priority_level: ServiceJobPriorityLevel = Field(
        description="Overall priority/urgency of this service job"
    )
    warranty_notes: Optional[str] = Field(
        default=None,
        description="Any warranty considerations or notes",
    )
    follow_up_recommendations: Optional[str] = Field(
        default=None,
        description="Recommendations for future maintenance or follow-up checks",
    )

class MatchedInventoryPart(BaseModel):
    """Inventory part data returned from database lookup."""

    id: str
    part_code: str
    name: str
    description: Optional[str] = None
    stock_quantity: int
    unit_price: float
    compatible_models: List[str] = Field(default_factory=list)


class AlternativePart(MatchedInventoryPart):
    """Alternative part with confidence score."""

    match_confidence: float = Field(
        ge=0.0, le=1.0, description="How well this alternative matches (0-1)"
    )


class PartAvailabilityResult(BaseModel):
    suggested_part: SuggestedPart = Field(
        description="The original part suggestion from LLM"
    )
    matched_inventory_part: Optional[MatchedInventoryPart] = Field(
        default=None, description="Matched part from inventory (if found)"
    )
    match_confidence: float = Field(
        default=0.0, ge=0.0, le=1.0, description="How well the part name matched (0-1)"
    )
    quantity_requested: int = Field(ge=1, description="Quantity needed for the job")
    quantity_available: int = Field(
        default=0, ge=0, description="Available stock quantity"
    )
    availability_status: PartAvailabilityStatus = Field(
        default=PartAvailabilityStatus.unavailable,
        description="Availability status based on stock vs requested",
    )
    unit_price: Optional[float] = Field(
        default=None, ge=0, description="Price per unit from inventory"
    )
    total_price: Optional[float] = Field(
        default=None, ge=0, description="Total price (unit_price * quantity_requested)"
    )
    alternatives: List[AlternativePart] = Field(
        default_factory=list,
        description="Alternative compatible parts with confidence scores",
    )


class EnrichedTechnicalPlan(BaseModel):
    """
    The final enriched plan after inventory lookup.
    Contains the original technical plan plus real inventory data.
    """

    technical_plan: TechnicalPlanResponse = Field(
        description="The original LLM-generated technical plan"
    )
    parts_availability: List[PartAvailabilityResult] = Field(
        default_factory=list, description="Inventory lookup results for each part"
    )
    total_parts_cost: float = Field(
        default=0.0, ge=0, description="Sum of all available parts cost"
    )
    unavailable_parts_count: int = Field(
        default=0, ge=0, description="Count of parts not available or partially available"
    )
    
class MiaStageEvent(BaseModel):
    stage: str
    stage_label: str
    progress: int
    error: Optional[str] = None