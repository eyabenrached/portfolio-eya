from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuration chargée depuis les variables d'environnement (.env)."""

    model_config = SettingsConfigDict(env_file=("../.env", ".env"), extra="ignore")

    project_name: str = "Portfolio API"
    environment: str = "development"

    database_url: str = "postgresql+psycopg://portfolio:portfolio@localhost:5432/portfolio"

    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 60 * 8
    cookie_name: str = "access_token"
    cookie_secure: bool = False  # mettre à true derrière HTTPS

    cors_origins: str = "http://localhost:3000"

    upload_dir: str = "uploads"
    max_upload_mb: int = 5

    admin_email: str = "admin@example.com"
    admin_password: str = "ChangeMe123!"
    seed_demo_data: bool = True

    @model_validator(mode="after")
    def _refuse_insecure_production(self) -> "Settings":
        """En production, refuse de démarrer avec les valeurs par défaut/faibles."""
        if self.environment.lower() == "production":
            problems = []
            if len(self.secret_key) < 32 or "change" in self.secret_key.lower():
                problems.append("SECRET_KEY (32 caractères minimum, valeur aléatoire)")
            if len(self.admin_password) < 10 or "change" in self.admin_password.lower():
                problems.append("ADMIN_PASSWORD (10 caractères minimum, pas la valeur par défaut)")
            if problems:
                raise ValueError("Configuration production non sécurisée : à définir → " + " ; ".join(problems))
        return self

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
