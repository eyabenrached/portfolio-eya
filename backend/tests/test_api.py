import io

from PIL import Image

from app.api.routes import auth as auth_routes
from app.api.routes import messages as message_routes


def png_bytes() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (8, 8), "cyan").save(buf, format="PNG")
    return buf.getvalue()


# ---------- Authentification ----------
def test_login_wrong_password(client):
    auth_routes.login_limiter._hits.clear()
    r = client.post("/api/auth/login", json={"email": "admin@example.com", "password": "nope"})
    assert r.status_code == 401


def test_login_sets_httponly_cookie_and_me(client):
    r = client.post("/api/auth/login", json={"email": "ADMIN@example.com", "password": "TestPassword123!"})
    assert r.status_code == 200
    assert "httponly" in r.headers["set-cookie"].lower()
    assert client.get("/api/auth/me").json()["email"] == "admin@example.com"


def test_logout_removes_access(admin):
    assert admin.post("/api/auth/logout").status_code == 204
    admin.cookies.clear()
    assert admin.get("/api/auth/me").status_code == 401


def test_login_rate_limit(client):
    auth_routes.login_limiter._hits.clear()
    codes = [
        client.post("/api/auth/login", json={"email": "x@x.com", "password": "bad"}).status_code
        for _ in range(12)
    ]
    assert codes[:10] == [401] * 10 and 429 in codes[10:]
    auth_routes.login_limiter._hits.clear()


def test_change_password(admin):
    r = admin.put("/api/auth/password", json={"current_password": "TestPassword123!", "new_password": "AnotherPass456!"})
    assert r.status_code == 204
    admin.post("/api/auth/logout")
    admin.cookies.clear()
    ok = admin.post("/api/auth/login", json={"email": "admin@example.com", "password": "AnotherPass456!"})
    assert ok.status_code == 200


# ---------- Protection des routes ----------
def test_write_routes_require_auth(client):
    assert client.post("/api/projects", json={"title": "X"}).status_code == 401
    assert client.put("/api/projects/1", json={"title": "X"}).status_code == 401
    assert client.delete("/api/projects/1").status_code == 401
    assert client.put("/api/projects/reorder", json={"ids": [1]}).status_code == 401
    assert client.get("/api/admin/projects").status_code == 401
    assert client.post("/api/skills", json={"name": "X"}).status_code == 401
    assert client.post("/api/uploads", files={"file": ("a.png", png_bytes(), "image/png")}).status_code == 401
    assert client.get("/api/messages").status_code == 401


# ---------- Projets ----------
def test_project_crud_and_public_visibility(admin):
    created = admin.post(
        "/api/projects",
        json={
            "title": "Mon Projet Été",
            "description": "Desc",
            "technologies": ["React", " react ", "FastAPI", ""],
            "github_url": "https://github.com/x/y",
            "demo_url": "",
            "category": "Web",
            "project_date": "2026-05-01",
            "status": "published",
            "gallery": ["/uploads/a.png", "/uploads/b.png"],
        },
    )
    assert created.status_code == 201, created.text
    p = created.json()
    assert p["slug"] == "mon-projet-ete"
    assert p["technologies"] == ["React", "FastAPI"]
    assert p["demo_url"] is None
    assert p["gallery"] == ["/uploads/a.png", "/uploads/b.png"]

    # visible côté public
    assert [x["id"] for x in admin.get("/api/projects").json()] == [p["id"]]

    # brouillon => invisible côté public, visible côté admin
    admin.put(f"/api/projects/{p['id']}", json={"status": "draft"})
    assert admin.get("/api/projects").json() == []
    assert len(admin.get("/api/admin/projects").json()) == 1
    admin.post("/api/auth/logout")
    admin.cookies.clear()
    assert admin.get(f"/api/projects/{p['id']}").status_code == 404


def test_project_update_gallery_and_delete(admin):
    p = admin.post("/api/projects", json={"title": "A", "gallery": ["/uploads/1.png"]}).json()
    upd = admin.put(f"/api/projects/{p['id']}", json={"gallery": ["/uploads/2.png"], "github_url": "https://g.com"})
    assert upd.json()["gallery"] == ["/uploads/2.png"]
    assert upd.json()["github_url"] == "https://g.com"
    assert admin.delete(f"/api/projects/{p['id']}").status_code == 204
    assert admin.get(f"/api/projects/{p['id']}").status_code == 404
    assert admin.get("/api/projects").json() == []


def test_project_unique_slug_and_reorder(admin):
    a = admin.post("/api/projects", json={"title": "Same"}).json()
    b = admin.post("/api/projects", json={"title": "Same"}).json()
    c = admin.post("/api/projects", json={"title": "Third"}).json()
    assert a["slug"] == "same" and b["slug"] == "same-2"
    assert [x["id"] for x in admin.get("/api/projects").json()] == [a["id"], b["id"], c["id"]]
    assert admin.put("/api/projects/reorder", json={"ids": [c["id"], a["id"], b["id"]]}).status_code == 204
    assert [x["id"] for x in admin.get("/api/projects").json()] == [c["id"], a["id"], b["id"]]


def test_project_search_and_filters(admin):
    admin.post("/api/projects", json={"title": "Audit IA", "technologies": ["Groq"], "category": "IA", "status": "published"})
    admin.post("/api/projects", json={"title": "ERP", "technologies": ["Angular"], "category": "Métier", "status": "draft"})
    assert len(admin.get("/api/admin/projects", params={"search": "groq"}).json()) == 1
    assert len(admin.get("/api/admin/projects", params={"search": "erp"}).json()) == 1
    assert len(admin.get("/api/admin/projects", params={"status": "draft"}).json()) == 1
    assert len(admin.get("/api/admin/projects", params={"category": "IA"}).json()) == 1
    assert admin.get("/api/admin/projects/categories").json() == ["IA", "Métier"]


def test_project_rejects_dangerous_urls(admin):
    r = admin.post("/api/projects", json={"title": "X", "github_url": "javascript:alert(1)"})
    assert r.status_code == 422
    r = admin.post("/api/projects", json={"title": "X", "image": "../../etc/passwd"})
    assert r.status_code == 422


# ---------- Uploads ----------
def test_upload_valid_and_served(admin):
    r = admin.post("/api/uploads", files={"file": ("photo.png", png_bytes(), "image/png")})
    assert r.status_code == 201
    url = r.json()["url"]
    assert url.startswith("/uploads/") and url.endswith(".png")
    assert admin.get(url).status_code == 200


def test_upload_rejects_non_image(admin):
    r = admin.post("/api/uploads", files={"file": ("evil.png", b"<script>alert(1)</script>", "image/png")})
    assert r.status_code == 422


# ---------- Contenu générique ----------
def test_skills_education_experiences_crud(admin):
    s = admin.post("/api/skills", json={"name": "Python", "level": 95}).json()
    assert admin.put(f"/api/skills/{s['id']}", json={"level": 90}).json()["level"] == 90
    assert admin.post("/api/skills", json={"name": "Bad", "level": 150}).status_code == 422
    assert len(admin.get("/api/skills").json()) == 1

    e = admin.post("/api/education", json={"date": "2023", "title": "T", "school": "S", "skills": ["a", "a", "b"]}).json()
    assert e["skills"] == ["a", "b"]
    x = admin.post("/api/experiences", json={"date": "2025", "title": "T", "company": "C", "technologies": ["Git"]}).json()
    assert admin.delete(f"/api/experiences/{x['id']}").status_code == 204
    assert admin.get("/api/experiences").json() == []

    s2 = admin.post("/api/skills", json={"name": "React", "level": 80}).json()
    admin.put("/api/skills/reorder", json={"ids": [s2["id"], s["id"]]})
    assert [i["name"] for i in admin.get("/api/skills").json()] == ["React", "Python"]


# ---------- Messages ----------
def test_contact_message_flow(client):
    message_routes.send_limiter._hits.clear()
    payload = {"name": "Ali", "email": "ali@example.com", "subject": "Hello", "message": "Bonjour !"}
    assert client.post("/api/messages", json=payload).status_code == 201
    assert client.post("/api/messages", json={**payload, "email": "pas-un-email"}).status_code == 422
    # robot (honeypot) : accepté mais non enregistré
    assert client.post("/api/messages", json={**payload, "website": "http://spam"}).status_code == 201

    client.post("/api/auth/login", json={"email": "admin@example.com", "password": "TestPassword123!"})
    msgs = client.get("/api/messages").json()
    assert len(msgs) == 1 and msgs[0]["is_read"] is False
    assert client.get("/api/messages/unread-count").json() == {"count": 1}
    assert client.patch(f"/api/messages/{msgs[0]['id']}", json={"is_read": True}).json()["is_read"] is True
    assert client.get("/api/messages/unread-count").json() == {"count": 0}
    assert client.delete(f"/api/messages/{msgs[0]['id']}").status_code == 204


def test_contact_rate_limit(client):
    message_routes.send_limiter._hits.clear()
    payload = {"name": "A", "email": "a@example.com", "subject": "S", "message": "M"}
    codes = [client.post("/api/messages", json=payload).status_code for _ in range(7)]
    assert codes[:5] == [201] * 5 and codes[5] == 429
    message_routes.send_limiter._hits.clear()


def test_docs_and_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}
    assert client.get("/api/docs").status_code == 200
    assert client.get("/api/openapi.json").status_code == 200
