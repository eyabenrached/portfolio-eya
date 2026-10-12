"""Initialisation : compte admin + contenu actuel du portfolio (si les tables sont vides)."""
import shutil
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth.security import hash_password
from app.core.config import settings
from app.database.session import SessionLocal
from app.models import AdminUser, Education, Experience, Project, ProjectImage, Skill
from app.services.project_service import slugify
from app.services.upload_service import upload_path

ASSETS = Path(__file__).parent / "seed_assets"

PROJECTS = [
    {
        "title": "Plateforme d'audit IA",
        "description": "Analyse intelligente du code source avec IA, GitLab API, FastAPI et Next.js. Détection des vulnérabilités, recommandations et génération de tests.",
        "technologies": ["Next.js", "FastAPI", "PostgreSQL", "Groq", "GitLab"],
        "category": "Full Stack & IA",
        "asset": "project1.png",
    },
    {
        "title": "ERP Transport",
        "description": "Application de gestion des chauffeurs, véhicules, missions et plannings pour optimiser les opérations de transport.",
        "technologies": ["Angular", "Spring Boot", "MySQL"],
        "category": "Application métier",
        "asset": "project2.png",
    },
    {
        "title": "Portfolio Personnel",
        "description": "Portfolio moderne et responsive développé avec Next.js, Tailwind CSS et Framer Motion.",
        "technologies": ["Next.js", "Tailwind CSS", "Framer Motion"],
        "category": "Web",
        "asset": "project3.png",
    },
]

SKILLS = [
    ("Next.js", 90), ("React", 85), ("Angular", 80), ("FastAPI", 90),
    ("Spring Boot", 80), ("Python", 95), ("PostgreSQL", 85), ("Git", 90),
]

EDUCATION = [
    {
        "date": "2023 – 2026",
        "title": "Technologie de l'Informatique",
        "school": "ISET de Nabeul",
        "description": "Formation orientée vers le développement informatique, le développement web, les bases de données et la conception de solutions numériques.",
        "skills": ["Développement Web", "Bases de données", "Programmation", "Systèmes d'information"],
    }
]

EXPERIENCES = [
    {
        "date": "2025 – 2026",
        "title": "Projet de fin d'études — Développement Full Stack & IA",
        "company": "Neopolis Development",
        "description": "Conception d'une plateforme intelligente d'audit de code source. L'application analyse des dépôts GitLab, détecte les vulnérabilités, génère des recommandations et facilite la création de Merge Requests.",
        "technologies": ["Next.js", "FastAPI", "PostgreSQL", "Python", "GitLab", "LLM"],
    },
    {
        "date": "Stage",
        "title": "Stage en développement web",
        "company": "Eurafr Tours",
        "description": "Participation au développement et à l'amélioration de solutions web destinées à la gestion des activités de l'entreprise.",
        "technologies": ["Développement Web", "JavaScript", "Base de données", "Git"],
    },
]


def _is_empty(db: Session, model) -> bool:
    return (db.scalar(select(func.count()).select_from(model)) or 0) == 0


def seed_admin(db: Session) -> None:
    email = settings.admin_email.strip().lower()
    if db.scalar(select(AdminUser).where(AdminUser.email == email)) is None:
        db.add(AdminUser(email=email, hashed_password=hash_password(settings.admin_password)))
        db.commit()
        print(f"[seed] compte admin créé : {email}")


def seed_content(db: Session) -> None:
    if _is_empty(db, Project):
        for order, item in enumerate(PROJECTS, start=1):
            target = f"seed-{item['asset']}"
            shutil.copyfile(ASSETS / item["asset"], upload_path() / target)
            db.add(
                Project(
                    title=item["title"],
                    slug=slugify(item["title"]),
                    description=item["description"],
                    technologies=item["technologies"],
                    category=item["category"],
                    image=f"/uploads/{target}",
                    status="published",
                    display_order=order,
                )
            )
        print(f"[seed] {len(PROJECTS)} projets créés")
    if _is_empty(db, Skill):
        for order, (name, level) in enumerate(SKILLS, start=1):
            db.add(Skill(name=name, level=level, display_order=order))
    if _is_empty(db, Education):
        for order, item in enumerate(EDUCATION, start=1):
            db.add(Education(**item, display_order=order))
    if _is_empty(db, Experience):
        for order, item in enumerate(EXPERIENCES, start=1):
            db.add(Experience(**item, display_order=order))
    db.commit()


def main() -> None:
    with SessionLocal() as db:
        seed_admin(db)
        if settings.seed_demo_data:
            seed_content(db)


if __name__ == "__main__":
    main()
