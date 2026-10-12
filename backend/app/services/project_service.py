import re
import unicodedata

from fastapi import HTTPException, status
from sqlalchemy import String, cast, func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.models import Project, ProjectImage
from app.schemas.project import ProjectCreate, ProjectUpdate
from app.services.upload_service import delete_local_file


def slugify(text: str) -> str:
    ascii_text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_text.lower()).strip("-")
    return slug[:180] or "projet"


def _unique_slug(db: Session, base: str, exclude_id: int | None = None) -> str:
    slug, n = base, 2
    while True:
        stmt = select(Project.id).where(Project.slug == slug)
        if exclude_id is not None:
            stmt = stmt.where(Project.id != exclude_id)
        if db.scalar(stmt) is None:
            return slug
        slug = f"{base}-{n}"
        n += 1


def _set_gallery(project: Project, urls: list[str]) -> None:
    project.images = [ProjectImage(url=u, position=i) for i, u in enumerate(urls)]


def list_projects(
    db: Session,
    *,
    search: str | None = None,
    category: str | None = None,
    status_filter: str | None = None,
    only_published: bool = False,
) -> list[Project]:
    stmt = select(Project).options(selectinload(Project.images))
    if only_published:
        stmt = stmt.where(Project.status == "published")
    elif status_filter:
        stmt = stmt.where(Project.status == status_filter)
    if category:
        stmt = stmt.where(Project.category == category)
    if search and search.strip():
        like = f"%{search.strip()}%"
        stmt = stmt.where(
            or_(
                Project.title.ilike(like),
                Project.description.ilike(like),
                Project.category.ilike(like),
                cast(Project.technologies, String).ilike(like),
            )
        )
    return list(db.scalars(stmt.order_by(Project.display_order, Project.id)))


def list_categories(db: Session, *, only_published: bool = False) -> list[str]:
    stmt = select(Project.category).where(Project.category != "").distinct()
    if only_published:
        stmt = stmt.where(Project.status == "published")
    return sorted(db.scalars(stmt))


def get_project(db: Session, project_id: int) -> Project:
    project = db.scalar(
        select(Project).options(selectinload(Project.images)).where(Project.id == project_id)
    )
    if project is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Projet introuvable")
    return project


def create_project(db: Session, payload: ProjectCreate) -> Project:
    data = payload.model_dump()
    gallery = data.pop("gallery")
    last = db.scalar(select(func.max(Project.display_order))) or 0
    project = Project(
        **data,
        slug=_unique_slug(db, slugify(payload.title)),
        display_order=last + 1,
    )
    _set_gallery(project, gallery)
    db.add(project)
    db.commit()
    return get_project(db, project.id)


def update_project(db: Session, project_id: int, payload: ProjectUpdate) -> Project:
    project = get_project(db, project_id)
    data = payload.model_dump(exclude_unset=True)
    gallery = data.pop("gallery", None)
    old_files = {project.image, *project.gallery}

    for key, value in data.items():
        # Les champs non nullables ne peuvent pas être remis à None
        if value is None and key in {"title", "description", "category", "status"}:
            continue
        setattr(project, key, value)
    if gallery is not None:
        _set_gallery(project, gallery)
    db.commit()

    # Nettoyage des fichiers qui ne sont plus référencés
    project = get_project(db, project_id)
    for url in old_files - {project.image, *project.gallery}:
        _delete_if_orphan(db, url)
    return project


def _delete_if_orphan(db: Session, url: str | None) -> None:
    if not url:
        return
    used = db.scalar(select(Project.id).where(Project.image == url).limit(1)) or db.scalar(
        select(ProjectImage.id).where(ProjectImage.url == url).limit(1)
    )
    if not used:
        delete_local_file(url)


def delete_project(db: Session, project_id: int) -> None:
    project = get_project(db, project_id)
    files = {project.image, *project.gallery}
    db.delete(project)
    db.commit()
    for url in files:
        _delete_if_orphan(db, url)


def reorder_projects(db: Session, ids: list[int]) -> None:
    rows = {p.id: p for p in db.scalars(select(Project).where(Project.id.in_(ids)))}
    missing = [i for i in ids if i not in rows]
    if missing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"IDs introuvables : {missing}")
    for position, project_id in enumerate(ids, start=1):
        rows[project_id].display_order = position
    db.commit()
