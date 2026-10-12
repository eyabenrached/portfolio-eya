from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin
from app.database.session import get_db
from app.schemas.common import ReorderRequest
from app.services.crud import OrderedCRUD


def build_crud_router(*, prefix: str, tag: str, model, create_schema, update_schema, out_schema) -> APIRouter:
    """Routeur REST complet : lecture publique, écriture réservée à l'admin."""
    crud = OrderedCRUD(model)
    router = APIRouter(prefix=prefix, tags=[tag])
    admin = [Depends(get_current_admin)]

    @router.get("", response_model=list[out_schema])
    def list_items(db: Session = Depends(get_db)):
        return crud.list_all(db)

    @router.put("/reorder", status_code=status.HTTP_204_NO_CONTENT, dependencies=admin)
    def reorder(payload: ReorderRequest, db: Session = Depends(get_db)):
        crud.reorder(db, payload.ids)

    @router.get("/{item_id}", response_model=out_schema)
    def get_item(item_id: int, db: Session = Depends(get_db)):
        return crud.get(db, item_id)

    @router.post("", response_model=out_schema, status_code=status.HTTP_201_CREATED, dependencies=admin)
    def create_item(payload: create_schema, db: Session = Depends(get_db)):
        return crud.create(db, payload.model_dump())

    @router.put("/{item_id}", response_model=out_schema, dependencies=admin)
    def update_item(item_id: int, payload: update_schema, db: Session = Depends(get_db)):
        return crud.update(db, item_id, payload.model_dump(exclude_unset=True, exclude_none=True))

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=admin)
    def delete_item(item_id: int, db: Session = Depends(get_db)):
        crud.delete(db, item_id)

    return router
