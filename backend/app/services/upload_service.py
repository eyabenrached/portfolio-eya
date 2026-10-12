import io
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError

from app.core.config import settings

ALLOWED_FORMATS = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp", "GIF": ".gif"}
UPLOAD_PREFIX = "/uploads/"


def upload_path() -> Path:
    path = Path(settings.upload_dir).resolve()
    path.mkdir(parents=True, exist_ok=True)
    return path


async def save_image(file: UploadFile) -> str:
    """Valide (taille + contenu réel de l'image) puis enregistre le fichier. Retourne l'URL relative."""
    max_bytes = settings.max_upload_mb * 1024 * 1024
    data = await file.read(max_bytes + 1)
    if len(data) > max_bytes:
        raise HTTPException(
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            f"Image trop lourde (max {settings.max_upload_mb} Mo)",
        )
    try:
        with Image.open(io.BytesIO(data)) as img:
            img.verify()
            fmt = img.format or ""
    except (UnidentifiedImageError, OSError, SyntaxError):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Fichier image invalide")
    if fmt not in ALLOWED_FORMATS:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY, "Formats acceptés : JPEG, PNG, WebP, GIF"
        )
    name = f"{uuid.uuid4().hex}{ALLOWED_FORMATS[fmt]}"
    (upload_path() / name).write_bytes(data)
    return f"{UPLOAD_PREFIX}{name}"


def delete_local_file(url: str | None) -> None:
    """Supprime un fichier uploadé (ignore les URL externes et les erreurs)."""
    if not url or not url.startswith(UPLOAD_PREFIX):
        return
    target = (upload_path() / url[len(UPLOAD_PREFIX):]).resolve()
    if upload_path() in target.parents and target.is_file():
        try:
            target.unlink()
        except OSError:
            pass
