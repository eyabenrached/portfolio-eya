from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.core.rate_limit import RateLimiter, client_ip
from app.database.session import get_db
from app.models import ContactMessage
from app.schemas.content import MessageCreate, MessageOut, MessageReadUpdate

router = APIRouter(prefix="/messages", tags=["Messages de contact"])
send_limiter = RateLimiter(max_calls=5, period_seconds=10 * 60)
admin = [Depends(get_current_admin)]


@router.post("", status_code=status.HTTP_201_CREATED)
def send_message(payload: MessageCreate, request: Request, db: Session = Depends(get_db)):
    """Formulaire de contact public (limité à 5 messages / 10 min / IP)."""
    send_limiter.check(client_ip(request))
    if payload.website:  # robot : on répond OK sans rien enregistrer
        return {"detail": "Message envoyé"}
    db.add(
        ContactMessage(
            name=payload.name,
            email=str(payload.email),
            subject=payload.subject,
            message=payload.message,
        )
    )
    db.commit()
    return {"detail": "Message envoyé"}


@router.get("", response_model=list[MessageOut], dependencies=admin)
def list_messages(unread_only: bool = Query(False), db: Session = Depends(get_db)):
    stmt = select(ContactMessage).order_by(ContactMessage.created_at.desc(), ContactMessage.id.desc())
    if unread_only:
        stmt = stmt.where(ContactMessage.is_read.is_(False))
    return list(db.scalars(stmt))


@router.get("/unread-count", dependencies=admin)
def unread_count(db: Session = Depends(get_db)):
    count = db.scalar(select(func.count()).select_from(ContactMessage).where(ContactMessage.is_read.is_(False)))
    return {"count": count or 0}


@router.patch("/{message_id}", response_model=MessageOut, dependencies=admin)
def mark_message(message_id: int, payload: MessageReadUpdate, db: Session = Depends(get_db)):
    msg = db.get(ContactMessage, message_id)
    if msg is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Message introuvable")
    msg.is_read = payload.is_read
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=admin)
def delete_message(message_id: int, db: Session = Depends(get_db)):
    msg = db.get(ContactMessage, message_id)
    if msg is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Message introuvable")
    db.delete(msg)
    db.commit()
