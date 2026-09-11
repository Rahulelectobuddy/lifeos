# 🚢 Container Deployment & Operations Guide — Life OS

**Document Version:** 1.0.0  
**Target Platform:** Production / Staging Container Stack (Docker Compose + NGINX Reverse Proxy)  
**Port Exposure:** `http://localhost:80` (Unified Single-Entry Architecture)  

---

## 1. Overview & Architecture

Life OS deploys as an integrated containerized stack using **Docker Compose** and **NGINX Reverse Proxy**. All traffic enters via **Port 80**, routing API requests to the FastAPI backend service and serving the static React Single Page Application (SPA).

```text
                                UNIFIED INGRESS (Port 80)
                                            │
                                            ▼
                             ┌─────────────────────────────┐
                             │    NGINX REVERSE PROXY      │
                             │      (Container: 80)        │
                             └──────────────┬──────────────┘
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     │ (HTTP /api/* & /ws/*)                       │ (HTTP /*)
                     ▼                                             ▼
      ┌─────────────────────────────┐               ┌─────────────────────────────┐
      │     FASTAPI BACKEND API     │               │     REACT FRONTEND SPA      │
      │    (Container: 8000)        │               │      (Container: 80)        │
      └──────────────┬──────────────┘               └─────────────────────────────┘
                     │
       ┌─────────────┴─────────────┐
       ▼                           ▼
┌──────────────┐            ┌──────────────┐
│ POSTGRES 16  │            │   REDIS 7    │
│(Container:5432)           │(Container:6379)
└──────────────┘            └──────────────┘
```

---

## 2. Prerequisites

Ensure the deployment host has the following tools installed:

- **Docker Engine:** `v24.0+`
- **Docker Compose:** `v2.20+`

Verify installation:
```bash
docker --version
docker compose version
```

---

## 3. Quick Start Deployment (Single Command)

To launch the complete Life OS stack on **Port 80**:

```bash
# 1. Navigate to deployment directory
cd deployment

# 2. (Optional) Create .env configuration file
cp .env.example .env

# 3. Build containers and launch stack in background
docker compose up -d --build
```

---

## 4. Initializing Demo Seed Data

Once the stack is running, seed the initial demo data (notes, tasks, projects, journal entries, habits, and graph links) by calling the backend seed endpoint:

```bash
curl -X POST http://localhost/api/v1/seed
```

### Expected Output
```json
{
  "status": "success",
  "message": "Demo data populated successfully"
}
```

---

## 5. Verification & Service Health Checks

### Check Container Status
```bash
docker compose ps
```

All 5 containers (`lifeos_nginx`, `lifeos_frontend`, `lifeos_backend`, `lifeos_postgres`, `lifeos_redis`) should display status `Up` or `Up (healthy)`.

### Test Endpoints

| Resource | Target URL | Expected Response |
| :--- | :--- | :--- |
| **Web Application UI** | `http://localhost/` | Loads Cypher Life OS 3-Column Interface |
| **API Health Check** | `http://localhost/api/v1/notes` | Returns JSON array of notes |
| **OpenAPI Docs** | `http://localhost/api/v1/openapi.json` | Returns FastAPI OpenAPI specification |

---

## 6. Managing & Troubleshooting

### View Container Logs
```bash
# Follow all container logs live
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f reverse-proxy
```

### Restart Services
```bash
docker compose restart
```

### Stop Stack
```bash
docker compose down
```

### Destroy Stack (Including Data Volumes)
```bash
docker compose down -v
```

---

## 7. Production Hardening & SSL/TLS Setup

To terminate SSL/TLS for domain deployment:
1. Update `deployment/nginx.conf` to add port 443 SSL listener.
2. Mount Certbot / Let's Encrypt certificates volume (`/etc/letsencrypt`) into `lifeos_nginx`.
3. Force HTTP-to-HTTPS redirect rule (`return 301 https://$host$request_uri;`).
