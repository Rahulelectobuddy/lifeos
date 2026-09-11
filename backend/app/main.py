from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.api import api_router

from sqlalchemy import text

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DDL Tables in database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
        # Execute column migrations safely for existing tables
        migration_queries = [
            "ALTER TABLE notes ADD COLUMN IF NOT EXISTS parent_id VARCHAR(36);",
            "ALTER TABLE notes ADD COLUMN IF NOT EXISTS folder_path VARCHAR(255) DEFAULT 'General';",
            "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS target_name VARCHAR(255) DEFAULT '';"
        ]
        for query in migration_queries:
            try:
                await conn.execute(text(query))
            except Exception as e:
                print(f"Migration query execution note: {e}")
    yield
    # Shutdown
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register V1 Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mode": "Phase 1 Web Monolith API"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
