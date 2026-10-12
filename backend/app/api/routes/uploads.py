from fastapi import APIRouter, Depends, File, UploadFile, status

from app.auth.deps import get_current_admin
from app.services.upload_service import save_image

router = APIRouter(prefix="/uploads", tags=["Uploads"])


@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_admin)])
async def upload_image(file: UploadFile = File(...)):
    """Envoie une image (JPEG/PNG/WebP/GIF, 5 Mo max) et retourne son URL."""
    return {"url": await save_image(file)}
