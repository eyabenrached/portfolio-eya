from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.auth.security import decode_access_token
from app.core.config import settings
from app.database.session import get_db
from app.models import AdminUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token", auto_error=False)


def get_optional_admin(
    request: Request,
    bearer: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> AdminUser | None:
    """Admin connecté (cookie httpOnly ou en-tête Bearer), sinon None."""
    token = bearer or request.cookies.get(settings.cookie_name)
    if not token:
        return None
    subject = decode_access_token(token)
    if not subject or not subject.isdigit():
        return None
    user = db.get(AdminUser, int(subject))
    if user is None or not user.is_active:
        return None
    return user


def get_current_admin(admin: AdminUser | None = Depends(get_optional_admin)) -> AdminUser:
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Non authentifié",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return admin
