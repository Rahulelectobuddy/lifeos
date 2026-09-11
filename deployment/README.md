# 🚢 Container Deployment & Operations Guide — Life OS

**Document Version:** 1.0.0  
**Target Platform:** Production / Staging Container Stack (Docker Compose + NGINX Reverse Proxy)  
**Port Exposure:** `http://0.0.0.0:80` (Unified Ingress Architecture)  

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
- **Docker Compose:** `v2.20+` or `docker-compose`

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

---

## 5. Accessing from Another Machine on LAN / Network

Because NGINX listens on `0.0.0.0:80`, Life OS is immediately accessible to any phone, laptop, or computer on your local network (LAN).

### Step 1: Find Server's IP Address
Run on your server:
```bash
hostname -I | awk '{print $1}'
```
*(Example output: `192.168.1.100` or `10.0.0.55`)*

### Step 2: Open Firewall (if UFW enabled)
```bash
sudo ufw allow 80/tcp
```

### Step 3: Access via Web Browser on Remote Machine
On your phone, laptop, or tablet, open your browser and navigate to:
```text
http://<YOUR_SERVER_IP>/
```
*(Example: `http://192.168.1.100/`)*

---

## 6. Verification & Service Health Checks

| Resource | Target URL | Expected Response |
| :--- | :--- | :--- |
| **Web Application UI** | `http://<SERVER_IP>/` | Loads Cypher Life OS 3-Column Interface |
| **API Health Check** | `http://<SERVER_IP>/api/v1/notes` | Returns JSON array of notes |
| **OpenAPI Docs** | `http://<SERVER_IP>/api/v1/openapi.json` | Returns FastAPI OpenAPI specification |

---

## 7. Managing & Troubleshooting

### View Container Logs
```bash
docker compose logs -f
```

### Restart Services
```bash
docker compose restart
```

### Stop Stack
```bash
docker compose down
```
