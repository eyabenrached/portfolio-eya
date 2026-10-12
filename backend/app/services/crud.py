from typing import Generic, TypeVar

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

ModelT = TypeVar("ModelT")


class OrderedCRUD(Generic[ModelT]):
    """CRUD générique pour les modèles ayant une colonne `display_order`."""

    def __init__(self, model: type[ModelT]):
        self.model = model

    def list_all(self, db: Session) -> "list[ModelT]":
        stmt = select(self.model).order_by(self.model.display_order, self.model.id)
        return list(db.scalars(stmt))

    def get(self, db: Session, item_id: int) -> ModelT:
        obj = db.get(self.model, item_id)
        if obj is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Élément introuvable")
        return obj

    def create(self, db: Session, data: dict) -> ModelT:
        last = db.scalar(select(func.max(self.model.display_order))) or 0
        obj = self.model(**data, display_order=last + 1)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    def update(self, db: Session, item_id: int, data: dict) -> ModelT:
        obj = self.get(db, item_id)
        for key, value in data.items():
            setattr(obj, key, value)
        db.commit()
        db.refresh(obj)
        return obj

    def delete(self, db: Session, item_id: int) -> None:
        db.delete(self.get(db, item_id))
        db.commit()

    def reorder(self, db: Session, ids: list[int]) -> None:
        rows = {o.id: o for o in db.scalars(select(self.model).where(self.model.id.in_(ids)))}
        missing = [i for i in ids if i not in rows]
        if missing:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"IDs introuvables : {missing}")
        for position, item_id in enumerate(ids, start=1):
            rows[item_id].display_order = position
        db.commit()
