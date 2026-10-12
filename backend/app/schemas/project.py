from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.common import clean_media_url, clean_str_list, clean_web_url

ProjectStatus = Literal["draft", "published", "archived"]


class _ProjectValidators(BaseModel):
    @field_validator("demo_url", "github_url", check_fields=False)
    @classmethod
    def _urls(cls, v):
        return clean_web_url(v)

    @field_validator("image", check_fields=False)
    @classmethod
    def _image(cls, v):
        return clean_media_url(v)

    @field_validator("gallery", check_fields=False)
    @classmethod
    def _gallery(cls, v):
        if v is None:
            return None
        cleaned = [clean_media_url(u) for u in v]
        return [u for u in cleaned if u]

    @field_validator("technologies", check_fields=False)
    @classmethod
    def _techs(cls, v):
        return None if v is None else clean_str_list(v)


class ProjectCreate(_ProjectValidators):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=5000)
    image: str | None = None
    gallery: list[str] = Field(default_factory=list)
    technologies: list[str] = Field(default_factory=list)
    demo_url: str | None = None
    github_url: str | None = None
    category: str = Field(default="", max_length=100)
    project_date: date | None = None
    status: ProjectStatus = "published"


class ProjectUpdate(_ProjectValidators):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    image: str | None = None
    gallery: list[str] | None = None
    technologies: list[str] | None = None
    demo_url: str | None = None
    github_url: str | None = None
    category: str | None = Field(default=None, max_length=100)
    project_date: date | None = None
    status: ProjectStatus | None = None


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    slug: str
    description: str
    image: str | None
    gallery: list[str]
    technologies: list[str]
    demo_url: str | None
    github_url: str | None
    category: str
    project_date: date | None
    status: str
    display_order: int
    created_at: datetime
    updated_at: datetime
