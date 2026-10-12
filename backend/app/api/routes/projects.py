from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_admin, get_optional_admin
from app.database.session import get_db
from app.models import AdminUser
from app.schemas.common import ReorderRequest
from app.schemas.project import ProjectCreate, ProjectOut, ProjectUpdate
from app.services import project_service as svc

router = APIRouter(prefix="/projects", tags=["Projets"])
admin_router = APIRouter(prefix="/admin/projects", tags=["Projets (admin)"])


@router.get("", response_model=list[ProjectOut])
def list_public_projects(
    search: str | None = Query(None, max_length=100),
    category: str | None = Query(None, max_length=100),
    db: Session = Depends(get_db),
):
    """Projets publiés, triés par ordre d'affichage (utilisé par le site public)."""
    return svc.list_projects(db, search=search, category=category, only_published=True)


@router.get("/categories", response_model=list[str])
def list_public_categories(db: Session = Depends(get_db)):
    return svc.list_categories(db, only_published=True)


@router.put("/reorder", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def reorder_projects(payload: ReorderRequest, db: Session = Depends(get_db)):
    svc.reorder_projects(db, payload.ids)


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    admin: AdminUser | None = Depends(get_optional_admin),
):
    project = svc.get_project(db, project_id)
    if project.status != "published" and admin is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Projet introuvable")
    return project


@router.post(
    "",
    response_model=ProjectOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin)],
)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    return svc.create_project(db, payload)


@router.put("/{project_id}", response_model=ProjectOut, dependencies=[Depends(get_current_admin)])
def update_project(project_id: int, payload: ProjectUpdate, db: Session = Depends(get_db)):
    return svc.update_project(db, project_id, payload)


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_admin)],
)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    svc.delete_project(db, project_id)


# ---- Liste complète pour le dashboard (brouillons et archives inclus) ----
@admin_router.get("", response_model=list[ProjectOut], dependencies=[Depends(get_current_admin)])
def list_admin_projects(
    search: str | None = Query(None, max_length=100),
    category: str | None = Query(None, max_length=100),
    status_filter: Literal["draft", "published", "archived"] | None = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    return svc.list_projects(db, search=search, category=category, status_filter=status_filter)


@admin_router.get("/categories", response_model=list[str], dependencies=[Depends(get_current_admin)])
def list_admin_categories(db: Session = Depends(get_db)):
    return svc.list_categories(db)
