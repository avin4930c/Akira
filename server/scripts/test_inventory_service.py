import argparse
import asyncio
import json
from typing import List
from sqlmodel.ext.asyncio.session import AsyncSession

from app.constants.enums.mia_enums import ServiceJobPriorityLevel
from app.core.database import async_engine
from app.clients.embedding_clients.huggingface_embedding_client import (
    get_huggingface_embedding_client,
)
from app.model.response.mia_plan import (
    SuggestedPart,
    TechnicalPlanResponse,
)
from app.services.inventory_service import InventoryService


def _build_plan(part_names: List[str], *, quantity: int) -> TechnicalPlanResponse:
    suggested_parts = [
        SuggestedPart(
            name=name,
            description="",
            quantity=max(1, quantity),
        )
        for name in part_names
        if name.strip()
    ]

    return TechnicalPlanResponse(
        diagnosis_summary="Test service job",
        repair_tasks=[],
        suggested_parts=suggested_parts,
        tips=[],
        estimated_total_minutes=0,
        priority_level=ServiceJobPriorityLevel.low,
        warranty_notes=None,
        follow_up_recommendations=None,
    )


async def run_once(*, parts: List[str], quantity: int, vehicle_model: str | None) -> None:
    embedding_provider = get_huggingface_embedding_client()

    async with AsyncSession(async_engine) as session:
        service = InventoryService(
            session=session, 
            embedding_client=embedding_provider.get_embedding_client()
        )
        plan = _build_plan(parts, quantity=quantity)

        enriched = await service.enrich_technical_plan(plan, vehicle_model=vehicle_model)

        print("\n=== EnrichedTechnicalPlan (summary) ===")
        print(f"total_parts_cost: {enriched.total_parts_cost}")
        print(f"unavailable_parts_count: {enriched.unavailable_parts_count}")

        print("\n=== Per-part results ===")
        for r in enriched.parts_availability:
            mp = r.matched_inventory_part
            print("-")
            print(f"  suggested: {r.suggested_part.name} (qty {r.quantity_requested})")
            print(f"  status: {r.availability_status} | confidence: {r.match_confidence:.3f}")
            if mp:
                print(
                    f"  matched: {mp.part_code} | {mp.name} | stock={mp.stock_quantity} | unit_price={mp.unit_price}"
                )
            else:
                print("  matched: None")
            if r.alternatives:
                print("  alternatives:")
                for a in r.alternatives:
                    print(f"    - {a.part_code} | {a.name} | stock={a.stock_quantity} | unit_price={a.unit_price}")

        print("\n=== Raw JSON (full) ===")
        print(json.dumps(enriched.model_dump(mode="json"), indent=2))


async def interactive(*, quantity: int, vehicle_model: str | None) -> None:
    print("InventoryService interactive test")
    print("Enter part names (blank line to run, 'quit' to exit).")

    while True:
        parts: List[str] = []
        while True:
            s = input("> ").strip()
            if s.lower() in {"quit", "exit"}:
                return
            if not s:
                break
            parts.append(s)

        if not parts:
            print("No parts entered.")
            continue

        await run_once(parts=parts, quantity=quantity, vehicle_model=vehicle_model)


def main() -> None:
    parser = argparse.ArgumentParser(description="Test InventoryService matching against PartInventory")
    parser.add_argument("parts", nargs="*", help="Part names to search")
    parser.add_argument("--qty", type=int, default=1, help="Quantity requested for each part")
    parser.add_argument("--vehicle-model", type=str, default=None, help="Vehicle model context (e.g. 'Honda Activa')")
    parser.add_argument("--interactive", action="store_true", help="Interactive mode")
    args = parser.parse_args()

    if args.interactive or not args.parts:
        asyncio.run(interactive(quantity=args.qty, vehicle_model=args.vehicle_model))
    else:
        asyncio.run(run_once(parts=args.parts, quantity=args.qty, vehicle_model=args.vehicle_model))


if __name__ == "__main__":
    main()
