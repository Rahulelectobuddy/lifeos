# ⚙️ Backend Architecture Specification — Life OS

**Document Version:** 1.0.0  
**Status:** Approved  
**Target Platform:** Web Application (Phase 1 Core MVP) / Multi-Tenant Modular API  
**Core Stack:** Python 3.12 (AsyncIO), FastAPI, PostgreSQL 16, SQLAlchemy 2.0 (Async), Redis 7, MinIO  

---

## 1. Executive Summary & Stack Choices

Life OS utilizes a **Modular Monolith** architecture for its backend services layer. This provides strong domain boundaries, strict code organization, high developer velocity, and zero operational microservice overhead during **Phase 1 Web Application** deployment, while maintaining a clear upgrade path to distributed microservices if required in Phase 2/3.

```text
                                  CLIENT LAYER
                   ┌────────────────────────────────────────┐
                   │    Responsive Web (Vite + React)       │
                   └───────────────────┬────────────────────┘
                                       │ (HTTP/REST + WebSockets)
                                       ▼
                            REVERSE PROXY / NGINX
                                       │
                                       ▼
                   ┌────────────────────────────────────────┐
                   │        FASTAPI BACKEND MONOLITH        │
                   │                                        │
                   │  ┌──────────────┐    ┌──────────────┐  │
                   │  │ Auth & Tenant│    │ Second Brain │  │
                   │  └──────────────┘    └──────────────┘  │
                   │  ┌──────────────┐    ┌──────────────┐  │
                   │  │ Tasks/Project│    │ Life Graph   │  │
                   │  └──────────────┘    └──────────────┘  │
                   │  ┌──────────────┐    ┌──────────────┐  │
                   │  │ Communication│    │ AI & Search  │  │
                   │  └──────────────┘    └──────────────┘  │
                   └───────────────────┬────────────────────┘
                                       │
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
  PostgreSQL 16                     Redis 7                          MinIO
(Relational & Graph SQL)     (Cache, Pub/Sub & Workers)        (Vault Object Store)
```

### Core Technology Stack Table

| Component | Technology | Rationale & Usage |
| :--- | :--- | :--- |
| **Runtime** | Python 3.12 | Native async performance, strong typing support, rich AI/LLM ecosystem. |
| **Web Framework** | FastAPI | High-performance ASGI framework with automatic OpenAPI spec generation and native WebSocket support. |
| **Relational & Graph Database** | PostgreSQL 16 | ACID-compliant transactional engine housing core entities and the `entity_links` polymorphic relationship graph. |
| **Async ORM & Migrations** | SQLAlchemy 2.0 (Async) + Alembic | Asynchronous database access layer (`asyncpg`) with strict type hint support and automated Alembic migrations. |
| **In-Memory Cache & Message Broker**| Redis 7 | High-speed caching, API rate limiting, WebSocket Pub/Sub backplane, and ARQ background job queue. |
| **Object Storage** | MinIO (S3-Compatible) | Private vault object storage for markdown files, attachments, PDFs, images, and automated database backups. |
| **Task Queue & Async Workers** | ARQ / Celery | Asynchronous background processing for document OCR, search indexing, and scheduled backups. |
| **Structured Logging & Telemetry** | Structlog + OpenTelemetry | JSON structured logging, distributed request tracing (`trace_id`), and Prometheus metrics collection. |

---

## 2. Modular Monolith Directory & Module Layout

The backend repository is organized into isolated domain modules under `app/modules/`, ensuring clean separation of concerns and preventing cross-domain spaghetti code.

```text
backend/
├── app/
│   ├── api/                           # Public API Transport Layer
│   │   ├── v1/                        # API Version 1 Routers
│   │   │   ├── auth.py
│   │   │   ├── notes.py
│   │   │   ├── tasks.py
│   │   │   ├── graph.py
│   │   │   ├── chat.py
│   │   │   └── websockets.py
│   │   └── router.py                  # Main API Router Aggregator
│   │
│   ├── core/                          # Cross-Cutting Infrastructure & Config
│   │   ├── config.py                  # Pydantic BaseSettings Environment Specs
│   │   ├── security.py                # Password Hashing, JWT Tokens, Passkey Auth
│   │   ├── database.py                # Async PostgreSQL Engine & Session Manager
│   │   ├── redis.py                   # Redis Client Pool & Cache Helpers
│   │   ├── minio.py                   # S3/MinIO Storage Client
│   │   └── exceptions.py              # Custom Domain Exceptions & Exception Handlers
│   │
│   ├── middleware/                    # HTTP & WS Request Pipeline Middlewares
│   │   ├── auth_middleware.py         # JWT Token & User Context Injection
│   │   ├── tenant_middleware.py       # Organization & Workspace Isolation Enforcer
│   │   ├── rate_limit.py              # Redis Sliding-Window Rate Limiter
│   │   └── logging.py                 # Structured Request/Response Logger (Structlog)
│   │
│   ├── modules/                       # Bounded Domain Context Modules
│   │   ├── auth_tenant/               # Context 1: Identity & Multi-Tenancy
│   │   │   ├── models.py              # Organization, Workspace, User, Session DDL
│   │   │   ├── schemas.py             # Pydantic Input/Output Schemas
│   │   │   ├── repository.py          # Database Access Queries
│   │   │   └── service.py             # SSO, MFA, Org Management Logic
│   │   │
│   │   ├── second_brain/              # Context 2: Knowledge & Vault
│   │   │   ├── models.py              # Note, Document, Tag, Attachment DDL
│   │   │   ├── schemas.py
│   │   │   ├── repository.py
│   │   │   └── service.py             # Markdown Parsing, Vault Storage, OCR Trigger
│   │   │
│   │   ├── tasks_projects/            # Context 3: Execution & PARA Workspace
│   │   │   ├── models.py              # Task, Project, Milestone, Goal DDL
│   │   │   ├── schemas.py
│   │   │   ├── repository.py
│   │   │   └── service.py             # Task Dependencies, PARA Triage, Calendar Sync
│   │   │
│   │   ├── life_graph/                # Context 4: Universal Entity Graph
│   │   │   ├── models.py              # EntityLink Polymorphic Graph Table DDL
│   │   │   ├── schemas.py
│   │   │   ├── repository.py          # Graph Traversal & Backlink Queries
│   │   │   └── service.py             # Link Creation, Bi-directional Sync
│   │   │
│   │   ├── communication/             # Context 5: Real-time Messaging & Channels
│   │   │   ├── models.py              # Channel, Message, DM DDL
│   │   │   ├── schemas.py
│   │   │   ├── repository.py
│   │   │   └── service.py             # Message Handling, Mention Parsing
│   │   │
│   │   └── ai_search/                 # Context 6: Search & AI Gateway
│   │       ├── schemas.py
│   │       ├── router_service.py      # LLM Gateway (Ollama / Gemini / OpenAI)
│   │       └── search_service.py      # PostgreSQL Full-Text Search Queries
│   │
│   ├── websockets/                    # WebSocket Connection Engine
│   │   ├── manager.py                 # Active Connection Registry
│   │   └── pubsub.py                  # Redis Pub/Sub Event Listener
│   │
│   └── workers/                       # Async Task Queue Workers (ARQ)
│       ├── worker.py                  # Task Queue Worker Entrypoint
│       ├── ocr_tasks.py               # MinIO Document PDF/Image OCR Jobs
│       ├── search_tasks.py            # FTS & Vector Indexing Jobs
│       └── backup_tasks.py            # Automated Encryption Backup Jobs
│
├── alembic/                           # Database Migration Scripts
├── tests/                             # Pytest Suite (Unit, Integration, E2E)
├── Dockerfile                         # Container Image Build
└── main.py                            # FastAPI Application Entrypoint
```

---

## 3. Clean Layered Architecture Breakdown

Each module strictly follows a **4-Layer Architecture** pattern:

```text
[ Transport Layer (APIRouter / WebSockets) ]
                   │
                   ▼ (Pydantic Schemas / DTOs)
[ Application Service Layer (Business Logic) ]
                   │
                   ▼ (Domain Models / Entities)
[ Repository Data Access Layer (SQLAlchemy 2.0 Async Queries) ]
                   │
                   ▼ (Database Connections)
[ Infrastructure Layer (PostgreSQL / Redis / MinIO / External APIs) ]
```

1. **Transport Layer (`api/v1/`)**: Receives HTTP/WebSocket requests, executes request schema validation via Pydantic v2, delegates execution to Application Services, and returns HTTP responses formatted with standard status codes.
2. **Middleware Layer (`middleware/`)**: Intercepts requests prior to handler execution to extract JWT tokens, populate request state with user/tenant context (`request.state.tenant`), verify rate limits, and record distributed tracing IDs.
3. **Application Service Layer (`modules/<domain>/service.py`)**: Contains core domain business rules, handles transaction management (`UnitOfWork`), enforces authorization constraints, dispatches domain events to Redis, and triggers async worker tasks.
4. **Repository Layer (`modules/<domain>/repository.py`)**: Encapsulates raw database interactions using SQLAlchemy 2.0 Async ORM. Handles domain query construction, filtering by workspace ID, and pagination.
5. **Infrastructure Layer (`core/`)**: Manages low-level async connection pools for PostgreSQL (`asyncpg`), Redis, MinIO object storage, and external AI providers.

---

## 4. Multi-Tenancy & Security Architecture

Life OS provides **Day-1 strict Multi-Tenancy** supporting Organizations and Workspaces.

```text
   ┌────────────────────────────────────────────────────────────┐
   │                       ORGANIZATION                         │
   │  (e.g., "Cypher Corp" - Org ID: 018f...a1)                  │
   └─────────────────────────────┬──────────────────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌────────────────────────────────┐              ┌────────────────────────────────┐
│      PERSONAL WORKSPACE        │              │        TEAM WORKSPACE          │
│ (Workspace ID: 018f...b2)      │              │ (Workspace ID: 018f...c3)      │
│ • User's Notes & Daily Journal │              │ • Shared Projects & Documents  │
└────────────────────────────────┘              └────────────────────────────────┘
```

### 4.1 Tenant Resolution Flow

1. **JWT Auth Token Extraction**: The client passes an `Authorization: Bearer <JWT>` header with every HTTP request.
2. **Token Payload Claims**:
   ```json
   {
     "sub": "usr_99182312",
     "org_id": "org_77182910",
     "active_workspace_id": "ws_12983019",
     "roles": ["workspace_admin", "note_editor"],
     "exp": 1726089600
   }
   ```
3. **Context Injection**: `TenantMiddleware` extracts and validates `org_id` and `active_workspace_id`. It stores them in Python's `contextvars` (`CurrentTenantContext`), making them available throughout the request lifecycle without manual parameter passing.

### 4.2 Mandatory Query Scoping

Every database query generated by the repository layer MUST enforce workspace scoping:

```python
# app/modules/second_brain/repository.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.modules.second_brain.models import Note

class NoteRepository:
    def __init__(self, session: AsyncSession, workspace_id: str):
        self.session = session
        self.workspace_id = workspace_id

    async def get_by_id(self, note_id: str) -> Note | None:
        stmt = (
            select(Note)
            .where(Note.id == note_id)
            .where(Note.workspace_id == self.workspace_id) # Mandatory Isolation
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
```

---

## 5. Real-Time WebSocket Architecture

Real-time capabilities (chat messages, live collaboration indicators, notification updates) are powered by a **FastAPI WebSocket Engine** integrated with a **Redis Pub/Sub Backplane**.

```text
 ┌─────────────────────────────┐        ┌─────────────────────────────┐
 │    Web Client Replica A     │        │    Web Client Replica B     │
 └──────────────┬──────────────┘        └──────────────┬──────────────┘
                │ WebSocket                            │ WebSocket
                ▼                                      ▼
 ┌─────────────────────────────┐        ┌─────────────────────────────┐
 │  FastAPI Container Node 1   │        │  FastAPI Container Node 2   │
 └──────────────┬──────────────┘        └──────────────┬──────────────┘
                │ Redis Pub                      ▲ Redis Sub
                └──────────────┐        ┌────────┘
                               ▼        │
                     ┌────────────────────┐
                     │   REDIS 7 PUB/SUB  │
                     │  Channel: ws_events│
                     └────────────────────┘
```

### WebSocket Frame Format

All WebSocket messages follow a standardized JSON envelope:

```json
{
  "event_type": "chat.message_sent",
  "workspace_id": "ws_12983019",
  "channel_id": "chn_44819201",
  "payload": {
    "message_id": "msg_90182301",
    "sender_id": "usr_99182312",
    "content": "Updated the Proxmox architecture diagram.",
    "created_at": "2026-09-11T19:30:00Z"
  }
}
```

---

## 6. Background Task Processing & Queues

Heavy computations and asynchronous side-effects are decoupled from the HTTP request cycle using **ARQ** (Async Redis Queue).

```text
[ HTTP API Endpoint ] ──(Enqueues Job)──► [ Redis Task Queue ]
                                                  │
                                                  ▼
                                       [ ARQ Worker Process ]
                                                  │
                       ┌──────────────────────────┼──────────────────────────┐
                       ▼                          ▼                          ▼
               [ MinIO OCR Job ]        [ FTS Indexer Job ]       [ Backup Worker Job ]
```

### Worker Task Types

1. **MinIO PDF/Image OCR Job**: Triggered when a document or receipt is uploaded to MinIO. Extracts text asynchronously and populates the `documents.ocr_content` database column.
2. **Search Indexing Job**: Asynchronously updates PostgreSQL Full-Text Search TSVector columns whenever notes or projects are modified.
3. **Scheduled Encrypted Backup Job**: Nightly worker process that dumps the PostgreSQL database, encrypts the output via `AES-256 GCM`, and uploads the archive to a protected MinIO backup bucket.

---

## 7. AI Router & Gateway Architecture

The AI layer in backend architecture provides a unified gateway abstracting both local and cloud LLM providers.

```text
                        ┌────────────────────────┐
                        │     AI SERVICE LAYER   │
                        └───────────┬────────────┘
                                    │
                        ┌───────────▼────────────┐
                        │   AI ROUTER GATEWAY    │
                        └───────────┬────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
 ┌──────────────┐            ┌──────────────┐            ┌──────────────┐
 │ Ollama / vLLM│            │ Google Gemini│            │ OpenAI API   │
 │ (Local LLM)  │            │ (Cloud AI)   │            │ (Cloud AI)   │
 └──────────────┘            └──────────────┘            └──────────────┘
```

### Provider Abstraction Interface

```python
# app/modules/ai_search/router_service.py
from typing import AsyncGenerator
from abc import ABC, abstractmethod

class LLMProvider(ABC):
    @abstractmethod
    async def generate_stream(self, prompt: str, system_context: str) -> AsyncGenerator[str, None]:
        pass

class AIRouterGateway:
    def __init__(self, primary_provider: LLMProvider, fallback_provider: LLMProvider):
        self.primary = primary_provider
        self.fallback = fallback_provider

    async def stream_completion(self, prompt: str, context: str) -> AsyncGenerator[str, None]:
        try:
            async for chunk in self.primary.generate_stream(prompt, context):
                yield chunk
        except Exception:
            async for chunk in self.fallback.generate_stream(prompt, context):
                yield chunk
```

---

## 8. Standardized RFC 7807 Error Handling & Response Envelope

All API errors strictly conform to the **RFC 7807 (Problem Details for HTTP APIs)** specification to ensure seamless, predictable error handling on the frontend.

### Error Envelope Example (`404 Not Found`)

```json
{
  "type": "https://api.lifeos.io/errors/resource-not-found",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "Note with ID 'nt_88192031' does not exist in workspace 'ws_12983019'.",
  "instance": "/api/v1/notes/nt_88192031",
  "error_code": "NOTE_NOT_FOUND",
  "timestamp": "2026-09-11T19:32:00Z"
}
```

---

## 9. Verification & Sign-Off Matrix

| Role | Review Focus | Status |
| :--- | :--- | :--- |
| **Backend Architect** | Modular Monolith layout, FastAPI Async pattern, SQLAlchemy 2.0 Async ORM | Approved |
| **Database Lead** | Multi-tenant query isolation (`workspace_id`), Alembic migrations, Redis caching | Approved |
| **Security Engineer** | JWT Tenant claims, RFC 7807 error format, MinIO AES-256 backup pipeline | Approved |
| **System Lead** | Alignment with Phase 1 Web Application scope and SDLC Step 10 directives | Approved |
