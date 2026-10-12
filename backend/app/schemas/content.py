from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.schemas.common import clean_str_list


class _Out(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    display_order: int


# ---- Compétences ----
class SkillCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    level: int = Field(default=50, ge=0, le=100)


class SkillUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    level: int | None = Field(default=None, ge=0, le=100)


class SkillOut(_Out):
    name: str
    level: int


# ---- Formation ----
class _TagsMixin(BaseModel):
    @field_validator("skills", "technologies", check_fields=False)
    @classmethod
    def _tags(cls, v):
        return None if v is None else clean_str_list(v)


class EducationCreate(_TagsMixin):
    date: str = Field(min_length=1, max_length=100)
    title: str = Field(min_length=1, max_length=200)
    school: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=3000)
    skills: list[str] = Field(default_factory=list)


class EducationUpdate(_TagsMixin):
    date: str | None = Field(default=None, min_length=1, max_length=100)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    school: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=3000)
    skills: list[str] | None = None


class EducationOut(_Out):
    date: str
    title: str
    school: str
    description: str
    skills: list[str]


# ---- Expérience ----
class ExperienceCreate(_TagsMixin):
    date: str = Field(min_length=1, max_length=100)
    title: str = Field(min_length=1, max_length=200)
    company: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=3000)
    technologies: list[str] = Field(default_factory=list)


class ExperienceUpdate(_TagsMixin):
    date: str | None = Field(default=None, min_length=1, max_length=100)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    company: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=3000)
    technologies: list[str] | None = None


class ExperienceOut(_Out):
    date: str
    title: str
    company: str
    description: str
    technologies: list[str]


# ---- Messages de contact ----
class MessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=5000)
    website: str = Field(default="", max_length=200, description="Champ piège anti-spam (doit rester vide)")

    @field_validator("name", "subject", "message")
    @classmethod
    def _strip(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Champ requis")
        return v


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    subject: str
    message: str
    is_read: bool
    created_at: datetime


class MessageReadUpdate(BaseModel):
    is_read: bool
