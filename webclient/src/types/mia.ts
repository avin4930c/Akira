export enum ServiceJobStatus { 
  Pending = "pending",
  InProgress = "in-progress",
  Completed = "completed",
  Validated = "validated",
}

export enum TaskDifficultyLevel {
  Easy = "easy",
  Moderate = "moderate",
  Advanced = "advanced",
}

export enum ServiceJobPriorityLevel {
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

export enum PartPriority {
  Required = "required",
  Recommended = "recommended",
  Optional = "optional",
}

export enum TaskCategory {
  Inspection = "inspection",
  Repair = "repair",
  Replacement = "replacement",
  Adjustment = "adjustment",
  Cleaning = "cleaning",
}

export enum TipCategory {
  Safety = "safety",
  Efficiency = "efficiency",
  Quality = "quality",
  CostSaving = "cost_saving",
}

export enum PartAvailabilityStatus {
  Available = "available",
  Partial = "partial",
  Unavailable = "unavailable",
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_count?: number;
  created_at: string;
}

export interface Vehicle {
  id: string;
  customer_id: string;
  make: string; //TODO: Restrict to known makes
  model: string;
  year: number;
  registration: string;
  mileage: number;
  engine_type: string;
  last_service_date?: string;
}

export interface Mechanic {
  id: string;
  name: string;
  mechanic_code: string;
}

export interface ServiceJob {
  id: string;
  customer_id: string;
  vehicle_id: string;
  mechanic_id: string;
  status: ServiceJobStatus;
  service_info: string;
  mechanic_notes: string;
  validated_at?: string;
  created_at: string;
}

export interface SuggestedPart {
  name: string;
  description: string;
  quantity: number;
  category?: string;
  priority: PartPriority;
}

export interface RepairTask {
  step_number: number;
  title: string;
  description: string;
  category: TaskCategory;
  estimated_minutes: number;
  difficulty: TaskDifficultyLevel;
  tools_needed: string[];
  safety_notes?: string;
  torque_specs?: string;
}

export interface MechanicTip {
  tip: string;
  category: TipCategory;
}

export interface RecommendedFix {
  title: string;
  description: string;
}

export interface TechnicalPlanResponse {
  diagnosis_summary: string;
  repair_tasks: RepairTask[];
  suggested_parts: SuggestedPart[];
  tips: MechanicTip[];
  estimated_total_minutes: number;
  priority_level: ServiceJobPriorityLevel;
  warranty_notes?: string;
  follow_up_recommendations?: string;
}

export interface MatchedInventoryPart {
  id: string;
  part_code: string;
  name: string;
  description?: string;
  stock_quantity: number;
  unit_price: number;
  compatible_models: string[];
}

export interface AlternativePart extends MatchedInventoryPart {
  match_confidence: number;
}

export interface PartAvailabilityResult {
  suggested_part: SuggestedPart;
  matched_inventory_part?: MatchedInventoryPart;
  match_confidence: number;
  quantity_requested: number;
  quantity_available: number;
  availability_status: PartAvailabilityStatus;
  unit_price?: number;
  total_price?: number;
  alternatives: AlternativePart[];
}

export interface EnrichedTechnicalPlan {
  technical_plan: TechnicalPlanResponse;
  parts_availability: PartAvailabilityResult[];
  total_parts_cost: number;
  unavailable_parts_count: number;
}

export interface SelectOption {
  value: string;
  label: string;
  subtitle?: string;
}

export interface JobSummaryProps {
  estimatedTotalMinutes: number;
  priorityLevel: ServiceJobPriorityLevel;
  warrantyNotes?: string;
  followUpRecommendations?: string;
}