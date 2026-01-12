import { PartPriority, ServiceJobPriorityLevel, TaskCategory, TaskDifficultyLevel, TipCategory, type TechnicalPlanResponse } from "@/types/mia";

export const mockServiceJobData: TechnicalPlanResponse = {
    diagnosis_summary: "The 2025 Honda CBR650R, with 6000 miles, is in for its 2nd free service. Key issues identified include significantly worn front brake pads, requiring immediate replacement for safety. The drive chain shows signs of rust and needs cleaning and lubrication. Tire pressures were found to be low. An unusual engine idle vibration was noted by the mechanic, which requires further diagnosis as the bike is fuel-injected (PGM-FI) and not carburetor-equipped. Overall, the bike is in good condition apart from these identified items.",
    repair_tasks: [
        {
            step_number: 1,
            title: "Pre-Service Inspection & Recall Check",
            description: "Perform a comprehensive pre-ride inspection as per the owner's manual for the 2nd free service (6000 miles/4000 km interval). This includes checking all fluid levels (engine oil, brake fluid, coolant), lights, horn, turn signals, clutch lever freeplay, throttle grip freeplay, brake lever/pedal operation, side stand function, suspension, and major nuts & bolts. Additionally, check the vehicle's VIN against Honda's recall database for any open recalls, specifically the gearshift arm recall for 2024 models, as a precautionary measure.",
            category: TaskCategory.Inspection,
            estimated_minutes: 45,
            difficulty: TaskDifficultyLevel.Easy,
            tools_needed: [],
            safety_notes: "Ensure the motorcycle is securely placed on a stable stand before commencing any inspection or work.",
        },
        {
            step_number: 2,
            title: "Diagnose Engine Idle Vibration",
            description: "The mechanic noted higher than normal engine idle vibration. As the CBR650R is a fuel-injected (PGM-FI) motorcycle, 'carburetor adjustment' is not applicable. Connect to a diagnostic tool to check for any stored PGM-FI error codes. Visually inspect engine mounts for any signs of damage or looseness. If no fault codes are present and mounts are secure, consider this a minor characteristic unless severe or accompanied by other symptoms.",
            category: TaskCategory.Inspection,
            estimated_minutes: 30,
            difficulty: TaskDifficultyLevel.Moderate,
            tools_needed: [
                "Diagnostic scan tool (HDS or equivalent)"
            ],
        },
        {
            step_number: 3,
            title: "Front Brake Pad Replacement",
            description: "The front brake pads show significant wear and require immediate replacement for safety. Loosen caliper mounting bolts, carefully remove the brake caliper, and then remove the old brake pads. Clean caliper pistons and pad guide pins. Install new OEM front brake pads. Reinstall the caliper and torque mounting bolts to specification. Pump the brake lever until firm, then check the brake fluid level in the reservoir and top up with fresh DOT 4 fluid if necessary. Always replace both left and right brake pads simultaneously.",
            category: TaskCategory.Replacement,
            estimated_minutes: 60,
            difficulty: TaskDifficultyLevel.Moderate,
            tools_needed: [
                "Socket wrench set",
                "Torque wrench",
                "Brake pad spreader tool (optional)",
                "Clean rags"
            ],
            safety_notes: "Wear appropriate personal protective equipment (PPE). Do not spill brake fluid on painted surfaces as it can damage paint. Ensure the motorcycle is securely supported on a stable stand. Use a torque wrench for all brake components.",
            torque_specs: "Refer to the Honda CBR650R service manual for specific front brake caliper bolt torque (e.g., 25 Nm)."
        },
        {
            step_number: 4,
            title: "Drive Chain Cleaning & Lubrication",
            description: "Clean the drive chain and sprockets thoroughly using a dry cloth and a chain cleaner specifically designed for O-ring chains. Use a soft brush if the chain is heavily soiled. After cleaning, wipe the chain dry and apply Pro Honda HP Chain Lube or an equivalent O-ring safe lubricant evenly to the entire chain while rotating the rear wheel. Inspect chain slack and adjust if necessary, although not explicitly noted as out of specification, it is a crucial part of comprehensive chain service.",
            category: TaskCategory.Cleaning,
            estimated_minutes: 30,
            difficulty: TaskDifficultyLevel.Easy,
            tools_needed: [
                "Chain cleaner (O-ring safe)",
                "Soft brush",
                "Chain lubricant (O-ring safe)",
                "Clean rags",
                "Rear stand"
            ],
            safety_notes: "Keep fingers clear of the chain and sprockets when rotating the wheel. Avoid getting lubricant on the brakes or tires as this can impair braking performance and tire grip.",
        },
        {
            step_number: 5,
            title: "Tire Pressure Check & Adjustment",
            description: "Check the air pressure of both front and rear tires using a reliable tire pressure gauge. Adjust the pressures to the manufacturer's recommended specifications, which are typically found on a sticker on the swingarm or in the owner's manual.",
            category: TaskCategory.Adjustment,
            estimated_minutes: 10,
            difficulty: TaskDifficultyLevel.Easy,
            tools_needed: [
                "Tire pressure gauge",
                "Air compressor"
            ],
        }
    ],
    suggested_parts: [
        {
            name: "Front Brake Pads (OEM)",
            description: "Required for replacement due to significant wear, ensuring optimal braking performance and safety.",
            quantity: 1,
            category: "brake",
            priority: PartPriority.Required
        },
        {
            name: "O-ring Safe Chain Cleaner",
            description: "Used for thorough cleaning of the drive chain before lubrication, extending chain life.",
            quantity: 1,
            category: "chain",
            priority: PartPriority.Recommended
        },
        {
            name: "Pro Honda HP Chain Lube (or equivalent)",
            description: "Recommended lubricant for O-ring chains to ensure smooth operation and prevent wear and rust.",
            quantity: 1,
            category: "chain",
            priority: PartPriority.Recommended
        },
        {
            name: "DOT 4 Brake Fluid",
            description: "Required for topping up the brake fluid reservoir after front brake pad replacement.",
            quantity: 1,
            category: "brake",
            priority: PartPriority.Required
        }
    ],
    tips: [
        {
            tip: "Always use a torque wrench for critical fasteners, especially on brake components, to prevent over-tightening or under-tightening which can lead to component failure.",
            category: TipCategory.Safety
        },
        {
            tip: "For optimal performance and safety, always use OEM or equivalent quality brake pads and ensure both left and right pads are replaced simultaneously.",
            category: TipCategory.Quality
        },
        {
            tip: "To maximize efficiency, have all necessary tools, parts, and clean-up materials readily available before starting the brake pad replacement and chain service.",
            category: TipCategory.Efficiency
        }
    ],
    estimated_total_minutes: 175,
    priority_level: ServiceJobPriorityLevel.High,
    follow_up_recommendations: "Regularly check and maintain drive chain slack and lubrication to prolong chain and sprocket life. Monitor engine idle for any changes or worsening vibration; if it persists or worsens, a more in-depth PGM-FI system diagnosis may be required. It is recommended to check the specific VIN of the vehicle for any active recalls on the Honda Powersports recall website, as recalls can be model-year specific."
};