from dataclasses import dataclass
from typing import List, Optional

from fastapi import Depends
from langchain_core.embeddings import Embeddings
from sqlalchemy import or_
from sqlmodel import Session, select

from app.clients.embedding_clients.base_embedding_client import BaseEmbeddingClient
from app.clients.embedding_clients.huggingface_embedding_client import (
    get_huggingface_embedding_client,
)
from app.constants.inventory import (
    MAX_ALTERNATIVES,
    MAX_UNMATCHED_CANDIDATES,
    MIN_ALTERNATIVE_SIMILARITY_RATIO,
    MIN_SIMILARITY_THRESHOLD,
    VEHICLE_COMPATIBILITY_BOOST,
    VECTOR_SEARCH_LIMIT,
)
from app.core.database import get_session
from app.model.response.mia_plan import (
    AlternativePart,
    EnrichedTechnicalPlan,
    MatchedInventoryPart,
    PartAvailabilityResult,
    SuggestedPart,
    TechnicalPlanResponse,
)
from app.model.sql_models.mia import PartAvailabilityStatus, PartInventory
from app.utils.inventory_utils import (
    build_vehicle_filter_clauses,
    is_vehicle_compatible,
)


@dataclass(frozen=True)
class _ScoredCandidate:
    part: PartInventory
    similarity: float
    vehicle_compatible: bool

    @property
    def final_score(self) -> float:
        boost = VEHICLE_COMPATIBILITY_BOOST if self.vehicle_compatible else 0.0
        return min(1.0, self.similarity + boost)


class InventoryService:
    def __init__(self, session: Session, embedding_client: Embeddings):
        self.session = session
        self.embedding_client = embedding_client

    def _create_search_query(self, suggested_part: SuggestedPart) -> str:
        parts = [suggested_part.name]
        if suggested_part.description:
            parts.append(suggested_part.description)
        if suggested_part.category:
            parts.append(f"Category: {suggested_part.category}")
        return ". ".join(parts)

    async def _semantic_search(
        self,
        query: str,
        vehicle_model: Optional[str] = None,
        limit: int = VECTOR_SEARCH_LIMIT,
    ) -> List[tuple[PartInventory, float]]:
        query_embedding = self.embedding_client.embed_query(query)
        distance_expr = PartInventory.embedding.cosine_distance(query_embedding)
        similarity_expr = 1 - distance_expr

        statement = (
            select(PartInventory, similarity_expr.label("similarity"))
            .where(PartInventory.embedding.isnot(None))
        )

        if vehicle_model:
            vehicle_clauses = build_vehicle_filter_clauses(vehicle_model)
            if vehicle_clauses:
                statement = statement.where(or_(*vehicle_clauses))

        statement = statement.order_by(distance_expr).limit(limit)
        results = self.session.exec(statement).all()
        return [(part, float(sim)) for part, sim in results]

    async def _find_best_match(
        self,
        suggested_part: SuggestedPart,
        vehicle_model: Optional[str],
    ) -> tuple[Optional[_ScoredCandidate], List[_ScoredCandidate]]:
        search_query = self._create_search_query(suggested_part)

        search_results = await self._semantic_search(search_query, vehicle_model)
        if not search_results and vehicle_model:
            search_results = await self._semantic_search(search_query, None)

        if not search_results:
            return None, []

        scored = [
            _ScoredCandidate(
                part=part,
                similarity=similarity,
                vehicle_compatible=is_vehicle_compatible(vehicle_model, part.compatible_models),
            )
            for part, similarity in search_results
        ]

        scored.sort(key=lambda c: (c.vehicle_compatible, c.final_score, c.part.stock_quantity), reverse=True)

        best = scored[0] if scored else None
        if best and best.final_score < MIN_SIMILARITY_THRESHOLD:
            return None, scored[:MAX_UNMATCHED_CANDIDATES]

        alternatives = []
        seen_codes = {best.part.part_code} if best else set()
        for cand in scored[1:]:
            if cand.part.part_code in seen_codes or cand.final_score < MIN_SIMILARITY_THRESHOLD * MIN_ALTERNATIVE_SIMILARITY_RATIO:
                continue
            seen_codes.add(cand.part.part_code)
            alternatives.append(cand)
            if len(alternatives) >= MAX_ALTERNATIVES:
                break

        return best, alternatives

    def _to_matched_inventory_part(self, part: PartInventory) -> MatchedInventoryPart:
        return MatchedInventoryPart(
            id=part.id,
            part_code=part.part_code,
            name=part.name,
            description=part.description,
            stock_quantity=part.stock_quantity,
            unit_price=part.unit_price,
            compatible_models=list(part.compatible_models or []),
        )

    def _availability_status(self, requested: int, available: int, has_valid_match: bool) -> PartAvailabilityStatus:
        if not has_valid_match or available <= 0:
            return PartAvailabilityStatus.unavailable
        if available < requested:
            return PartAvailabilityStatus.partial
        return PartAvailabilityStatus.available

    async def enrich_technical_plan(
        self,
        technical_plan: TechnicalPlanResponse,
        vehicle_model: Optional[str] = None,
    ) -> EnrichedTechnicalPlan:
        parts_availability = []
        total_parts_cost = 0.0
        unavailable_parts_count = 0

        for suggested in technical_plan.suggested_parts or []:
            best, alternatives = await self._find_best_match(suggested, vehicle_model)

            requested_qty = max(1, int(getattr(suggested, "quantity", 1) or 1))
            has_valid_match = best is not None
            best_part = self._to_matched_inventory_part(best.part) if best else None
            available_qty = int(best.part.stock_quantity) if best else 0
            status = self._availability_status(requested_qty, available_qty, has_valid_match)

            unit_price = float(best.part.unit_price) if best else None
            total_price = float(unit_price) * float(requested_qty) if unit_price else None

            if status != PartAvailabilityStatus.available:
                unavailable_parts_count += 1
            else:
                total_parts_cost += float(total_price or 0.0)

            parts_availability.append(
                PartAvailabilityResult(
                    suggested_part=suggested,
                    matched_inventory_part=best_part,
                    match_confidence=float(best.final_score if best else 0.0),
                    quantity_requested=requested_qty,
                    quantity_available=available_qty,
                    availability_status=status,
                    unit_price=unit_price,
                    total_price=total_price,
                    alternatives=[
                        AlternativePart(
                            **self._to_matched_inventory_part(a.part).model_dump(),
                            match_confidence=float(a.final_score),
                        )
                        for a in alternatives
                    ],
                )
            )

        return EnrichedTechnicalPlan(
            technical_plan=technical_plan,
            parts_availability=parts_availability,
            total_parts_cost=float(total_parts_cost),
            unavailable_parts_count=int(unavailable_parts_count),
        )


def get_inventory_service(
    db: Session = Depends(get_session),
    embedding_provider: BaseEmbeddingClient = Depends(get_huggingface_embedding_client),
) -> InventoryService:
    return InventoryService(
        session=db,
        embedding_client=embedding_provider.get_embedding_client(),
    )