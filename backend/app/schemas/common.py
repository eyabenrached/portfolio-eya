from pydantic import BaseModel, Field


def clean_str_list(values: list[str] | None, *, max_items: int = 30, max_len: int = 60) -> list[str]:
    """Nettoie une liste de tags : trim, supprime les vides et les doublons (ordre conservé)."""
    if values is None:
        return []
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        item = str(value).strip()
        if not item or item.lower() in seen:
            continue
        if len(item) > max_len:
            raise ValueError(f"Chaque élément doit faire au plus {max_len} caractères")
        seen.add(item.lower())
        result.append(item)
    if len(result) > max_items:
        raise ValueError(f"Maximum {max_items} éléments")
    return result


def clean_web_url(value: str | None) -> str | None:
    """Accepte uniquement http(s) — évite les liens `javascript:` côté frontend."""
    if value is None:
        return None
    value = value.strip()
    if not value:
        return None
    if not value.lower().startswith(("http://", "https://")):
        raise ValueError("L'URL doit commencer par http:// ou https://")
    return value


def clean_media_url(value: str | None) -> str | None:
    """Image uploadée (/uploads/...) ou URL externe http(s)."""
    if value is None:
        return None
    value = value.strip()
    if not value:
        return None
    if value.startswith("/uploads/") and ".." not in value:
        return value
    if value.lower().startswith(("http://", "https://")):
        return value
    raise ValueError("Image invalide : utilisez /uploads/... ou une URL http(s)")


class ReorderRequest(BaseModel):
    ids: list[int] = Field(min_length=1, description="IDs dans le nouvel ordre d'affichage")
