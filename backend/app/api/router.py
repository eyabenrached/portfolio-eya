from fastapi import APIRouter

from app.api.routes import auth, messages, projects, uploads
from app.api.routes.crud_factory import build_crud_router
from app.models import Education, Experience, Skill
from app.schemas.content import (
    EducationCreate,
    EducationOut,
    EducationUpdate,
    ExperienceCreate,
    ExperienceOut,
    ExperienceUpdate,
    SkillCreate,
    SkillOut,
    SkillUpdate,
)

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router)
api_router.include_router(projects.router)
api_router.include_router(projects.admin_router)
api_router.include_router(
    build_crud_router(
        prefix="/skills", tag="Compétences", model=Skill,
        create_schema=SkillCreate, update_schema=SkillUpdate, out_schema=SkillOut,
    )
)
api_router.include_router(
    build_crud_router(
        prefix="/education", tag="Formation", model=Education,
        create_schema=EducationCreate, update_schema=EducationUpdate, out_schema=EducationOut,
    )
)
api_router.include_router(
    build_crud_router(
        prefix="/experiences", tag="Expérience", model=Experience,
        create_schema=ExperienceCreate, update_schema=ExperienceUpdate, out_schema=ExperienceOut,
    )
)
api_router.include_router(messages.router)
api_router.include_router(uploads.router)


@api_router.get("/health", tags=["Santé"])
def health():
    return {"status": "ok"}
