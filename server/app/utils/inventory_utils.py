import re
from typing import Iterable, Optional

from sqlalchemy import cast, String
from app.model.sql_models.mia import PartInventory
from app.utils.db_utils import escape_like_pattern


_WORD_RE = re.compile(r"[a-z0-9]+")


def normalize_text(value: str) -> str:
    """Normalize text to lowercase alphanumeric tokens."""
    value = (value or "").casefold()
    return " ".join(_WORD_RE.findall(value))


def token_set(value: str) -> set[str]:
    """Extract normalized tokens as a set."""
    return set(normalize_text(value).split())


def is_vehicle_compatible(
    vehicle_model: Optional[str],
    compatible_models: Iterable[str],
) -> bool:
    if not vehicle_model:
        return True

    vm = normalize_text(vehicle_model)
    if not vm:
        return True

    vm_tokens = token_set(vehicle_model)

    for model in compatible_models or []:
        model_norm = normalize_text(model)
        model_tokens = token_set(model)

        if vm in model_norm or model_norm in vm:
            return True

        if vm_tokens and model_tokens:
            significant_overlap = {t for t in (vm_tokens & model_tokens) if len(t) > 3}
            if significant_overlap:
                return True

    return False


def build_vehicle_filter_clauses(vehicle_model: str) -> list:
    vm_normalized = normalize_text(vehicle_model)
    if not vm_normalized:
        return []

    tokens = [t for t in vm_normalized.split() if len(t) >= 3]
    if not tokens:
        return []

    clauses = []
    for token in tokens[:3]:
        pattern = f"%{escape_like_pattern(token)}%"
        clauses.append(
            cast(PartInventory.compatible_models, String).ilike(pattern, escape="\\")
        )
    return clauses
