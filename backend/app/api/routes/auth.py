from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.auth.security import (
    DUMMY_HASH,
    create_access_token,
    hash_password,
    verify_password,
)
from app.core.config import settings
from app.core.rate_limit import RateLimiter, client_ip
from app.database.session import get_db
from app.models import AdminUser
from app.schemas.auth import LoginRequest, PasswordChange, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["Authentification"])

login_limiter = RateLimiter(max_calls=10, period_seconds=15 * 60)


def _authenticate(db: Session, request: Request, email: str, password: str) -> AdminUser:
    key = client_ip(request)
    login_limiter.check(key)
    user = db.scalar(select(AdminUser).where(AdminUser.email == email.strip().lower()))
    # Toujours vérifier un hash : pas de différence de timing selon l'existence du compte
    valid = verify_password(password, user.hashed_password if user else DUMMY_HASH)
    if not user or not user.is_active or not valid:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Identifiants invalides")
    login_limiter.reset(key)
    return user


def _set_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.cookie_name,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    """Connexion du dashboard : pose un cookie httpOnly contenant le JWT."""
    user = _authenticate(db, request, payload.email, payload.password)
    token = create_access_token(str(user.id))
    _set_cookie(response, token)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/token", response_model=TokenResponse, include_in_schema=True)
def token(
    request: Request,
    response: Response,
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Endpoint OAuth2 (bouton « Authorize » de Swagger). username = email."""
    user = _authenticate(db, request, form.username, form.password)
    access = create_access_token(str(user.id))
    _set_cookie(response, access)
    return TokenResponse(access_token=access, user=UserOut.model_validate(user))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    response.delete_cookie(settings.cookie_name, path="/")


@router.get("/me", response_model=UserOut)
def me(admin: AdminUser = Depends(get_current_admin)):
    return admin


@router.put("/password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    payload: PasswordChange,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.current_password, admin.hashed_password):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Mot de passe actuel incorrect")
    admin.hashed_password = hash_password(payload.new_password)
    db.commit()
