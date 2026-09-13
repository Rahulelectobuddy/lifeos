from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.modules.models import Note, Task, Project, Area, DailyJournal, Habit, EntityLink, Workspace
from app.modules import schemas
from app.core.security import create_access_token, verify_access_token, STATIC_USER

api_router = APIRouter()

# DEFAULT WORKSPACE ID
DEFAULT_WS_ID = "default_ws"


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================
@api_router.post("/auth/login", response_model=schemas.TokenResponse)
async def login(credentials: schemas.LoginRequest):
    if credentials.username == STATIC_USER["username"] and credentials.password == STATIC_USER["password"]:
        token = create_access_token({"sub": STATIC_USER["username"], "email": STATIC_USER["email"]})
        user_info = {
            "username": STATIC_USER["username"],
            "name": STATIC_USER["name"],
            "email": STATIC_USER["email"],
            "role": STATIC_USER["role"]
        }
        return {"access_token": token, "token_type": "bearer", "user": user_info}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password"
    )

@api_router.get("/auth/me")
async def get_current_user(token: str):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return {
        "username": STATIC_USER["username"],
        "name": STATIC_USER["name"],
        "email": STATIC_USER["email"],
        "role": STATIC_USER["role"]
    }


async def ensure_default_workspace(db: AsyncSession):
    stmt = select(Workspace).where(Workspace.id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    ws = res.scalar_one_or_none()
    if not ws:
        ws = Workspace(id=DEFAULT_WS_ID, name="Cypher Workspace", slug="cypher-workspace")
        db.add(ws)
        await db.commit()

    # Auto-seed demo data if notes table is empty
    note_stmt = select(Note).where(Note.workspace_id == DEFAULT_WS_ID)
    note_res = await db.execute(note_stmt)
    if len(note_res.scalars().all()) == 0:
        await populate_seed_data(db)


async def populate_seed_data(db: AsyncSession):
    # 1. Seed Notes
    demo_notes = [
        Note(
            id="nt-1",
            workspace_id=DEFAULT_WS_ID,
            title="Proxmox VE Homelab Cluster Architecture & RTX 4090 Passthrough",
            content="## Infrastructure Specification\n\n- Primary Node: AMD EPYC 7002 series (64 Core)\n- Passthrough GPU: RTX 4090 24GB VRAM\n- Storage Pool: ZFS RaidZ2 4x 4TB NVMe SSDs\n\n### Backlink Connections\n- See [[Project - Migrate Homelab to Proxmox VE]]\n- Linked to [[Daily Log 2026-09-10]]",
            para_category="Resource",
            folder_path="Infrastructure",
            tags="proxmox, homelab, hardware, zfs",
            is_pinned=True,
        ),
        Note(
            id="nt-2",
            workspace_id=DEFAULT_WS_ID,
            title="Cypher LifeOS Design Tokens & HSL Color Palette Specifications",
            content="### Light Theme Default Token System\n\n- Soft Off-white canvas: `hsl(220, 20%, 97%)`\n- Pure white card surface: `hsl(0, 0%, 100%)`\n- Deep charcoal typography: `hsl(222, 25%, 12%)`\n- Glassmorphism backdrop blur: `12px`",
            para_category="Resource",
            folder_path="Design",
            tags="design, css, tokens, design-system",
            is_pinned=True,
        ),
        Note(
            id="nt-3",
            workspace_id=DEFAULT_WS_ID,
            title="Weekly Architecture Review & Production Refactoring Log",
            content="Completed 6-screen Web wireframe suite in Penpot with 89 interactive prototyping triggers.",
            para_category="Archive",
            folder_path="General",
            tags="review, architecture, web",
            is_pinned=False,
        )
    ]
    db.add_all(demo_notes)

    # 2. Seed Tasks
    demo_tasks = [
        Task(id="tsk-1", workspace_id=DEFAULT_WS_ID, title="Review Proxmox VE Backup Server ZFS Snapshot", status="completed", priority="high", para_category="Project", target_name="Migrate Homelab to Proxmox VE", due_date="2026-09-11"),
        Task(id="tsk-2", workspace_id=DEFAULT_WS_ID, title="Implement FastAPI Modular Monolith API Routers", status="in_progress", priority="urgent", para_category="Project", target_name="Life OS Web MVP Release v1.0", due_date="2026-09-11"),
        Task(id="tsk-3", workspace_id=DEFAULT_WS_ID, title="Audit Penpot 6-screen Web Prototyping Transitions", status="completed", priority="medium", para_category="Resource", target_name="", due_date="2026-09-10"),
        Task(id="tsk-4", workspace_id=DEFAULT_WS_ID, title="Log Daily Habits & Reflection Entry", status="todo", priority="medium", para_category="Area", target_name="Personal Growth", due_date="2026-09-11"),
        Task(id="tsk-5", workspace_id=DEFAULT_WS_ID, title="Test Command Palette (⌘K) Keyboard Shortcuts", status="todo", priority="low", para_category="Project", target_name="Life OS Web MVP Release v1.0", due_date="2026-09-12"),
    ]
    db.add_all(demo_tasks)

    # 3. Seed Projects
    demo_projects = [
        Project(id="prj-1", workspace_id=DEFAULT_WS_ID, title="Migrate Homelab to Proxmox VE", description="Cluster migration with ZFS storage and GPU passthrough.", progress=85, target_date="2026-09-30", status="active"),
        Project(id="prj-2", workspace_id=DEFAULT_WS_ID, title="Life OS Web MVP Release v1.0", description="Vite + React responsive web application deployment.", progress=90, target_date="2026-09-15", status="active"),
        Project(id="prj-3", workspace_id=DEFAULT_WS_ID, title="Universal Knowledge Graph Engine", description="Polymorphic relationship graph and backlink inspector.", progress=60, target_date="2026-10-01", status="active"),
    ]
    db.add_all(demo_projects)

    # 4. Seed Daily Journal
    demo_journal = DailyJournal(
        id="jnl-1",
        workspace_id=DEFAULT_WS_ID,
        entry_date="2026-09-11",
        mood_rating=5,
        reflections="Great velocity today! Delivered full end-to-end Penpot interactive wireframes for Web, updated all project documentation, defined backend architecture, and launched local execution build.",
        wins="1. Completed Penpot 6-screen web wireframe suite.\n2. Standardized Light Mode design tokens.\n3. Defined FastAPI backend architecture."
    )
    db.add(demo_journal)

    # 5. Seed Habits
    demo_habits = [
        Habit(id="hbt-1", workspace_id=DEFAULT_WS_ID, name="Morning Deep Work Session (2 Hours)", streak_count=14, is_completed_today=True),
        Habit(id="hbt-2", workspace_id=DEFAULT_WS_ID, name="Daily Habit & Reflection Journaling", streak_count=9, is_completed_today=True),
        Habit(id="hbt-3", workspace_id=DEFAULT_WS_ID, name="Physical Workout / Cardio (45 Min)", streak_count=5, is_completed_today=False),
        Habit(id="hbt-4", workspace_id=DEFAULT_WS_ID, name="Read 20 Pages of Technical Literature", streak_count=12, is_completed_today=True),
    ]
    db.add_all(demo_habits)

    # 6. Seed Entity Links (Life Graph)
    demo_links = [
        EntityLink(id="lnk-1", workspace_id=DEFAULT_WS_ID, source_type="note", source_id="nt-1", target_type="project", target_id="prj-1", link_type="supports"),
        EntityLink(id="lnk-2", workspace_id=DEFAULT_WS_ID, source_type="task", source_id="tsk-1", target_type="project", target_id="prj-1", link_type="subtask_of"),
        EntityLink(id="lnk-3", workspace_id=DEFAULT_WS_ID, source_type="note", source_id="nt-2", target_type="project", target_id="prj-2", link_type="defines_spec"),
        EntityLink(id="lnk-4", workspace_id=DEFAULT_WS_ID, source_type="journal", source_id="jnl-1", target_type="task", target_id="tsk-2", link_type="logs_progress"),
    ]
    db.add_all(demo_links)
    await db.commit()


# ============================================================================
# SEED DATA ENDPOINT
# ============================================================================
@api_router.post("/seed", status_code=status.HTTP_201_CREATED)
async def seed_demo_data(db: AsyncSession = Depends(get_db)):
    """Populates initial seed data matching Penpot design specs."""
    await ensure_default_workspace(db)

    # 1. Seed Notes
    note_stmt = select(Note).where(Note.workspace_id == DEFAULT_WS_ID)
    note_res = await db.execute(note_stmt)
    if len(note_res.scalars().all()) == 0:
        demo_notes = [
            Note(
                id="nt-1",
                workspace_id=DEFAULT_WS_ID,
                title="Proxmox VE Homelab Cluster Architecture & RTX 4090 Passthrough",
                content="## Infrastructure Specification\n\n- Primary Node: AMD EPYC 7002 series (64 Core)\n- Passthrough GPU: RTX 4090 24GB VRAM\n- Storage Pool: ZFS RaidZ2 4x 4TB NVMe SSDs\n\n### Backlink Connections\n- See [[Project - Migrate Homelab to Proxmox VE]]\n- Linked to [[Daily Log 2026-09-10]]",
                para_category="Resource",
                tags="proxmox, homelab, hardware, zfs",
                is_pinned=True,
            ),
            Note(
                id="nt-2",
                workspace_id=DEFAULT_WS_ID,
                title="Cypher LifeOS Design Tokens & HSL Color Palette Specifications",
                content="### Light Theme Default Token System\n\n- Soft Off-white canvas: `hsl(220, 20%, 97%)`\n- Pure white card surface: `hsl(0, 0%, 100%)`\n- Deep charcoal typography: `hsl(222, 25%, 12%)`\n- Glassmorphism backdrop blur: `12px`",
                para_category="Resource",
                tags="design, css, tokens, design-system",
                is_pinned=True,
            ),
            Note(
                id="nt-3",
                workspace_id=DEFAULT_WS_ID,
                title="Weekly Architecture Review & Production Refactoring Log",
                content="Completed 6-screen Web wireframe suite in Penpot with 89 interactive prototyping triggers.",
                para_category="Archive",
                tags="review, architecture, web",
                is_pinned=False,
            )
        ]
        db.add_all(demo_notes)

    # 2. Seed Tasks
    task_stmt = select(Task).where(Task.workspace_id == DEFAULT_WS_ID)
    task_res = await db.execute(task_stmt)
    if len(task_res.scalars().all()) == 0:
        demo_tasks = [
            Task(id="tsk-1", workspace_id=DEFAULT_WS_ID, title="Review Proxmox VE Backup Server ZFS Snapshot", status="completed", priority="high", para_category="Project", due_date="2026-09-11"),
            Task(id="tsk-2", workspace_id=DEFAULT_WS_ID, title="Implement FastAPI Modular Monolith API Routers", status="in_progress", priority="urgent", para_category="Project", due_date="2026-09-11"),
            Task(id="tsk-3", workspace_id=DEFAULT_WS_ID, title="Audit Penpot 6-screen Web Prototyping Transitions", status="completed", priority="medium", para_category="Resource", due_date="2026-09-10"),
            Task(id="tsk-4", workspace_id=DEFAULT_WS_ID, title="Log Daily Habits & Reflection Entry", status="todo", priority="medium", para_category="Area", due_date="2026-09-11"),
            Task(id="tsk-5", workspace_id=DEFAULT_WS_ID, title="Test Command Palette (⌘K) Keyboard Shortcuts", status="todo", priority="low", para_category="Project", due_date="2026-09-12"),
        ]
        db.add_all(demo_tasks)

    # 3. Seed Projects
    proj_stmt = select(Project).where(Project.workspace_id == DEFAULT_WS_ID)
    proj_res = await db.execute(proj_stmt)
    if len(proj_res.scalars().all()) == 0:
        demo_projects = [
            Project(id="prj-1", workspace_id=DEFAULT_WS_ID, title="Migrate Homelab to Proxmox VE", description="Cluster migration with ZFS storage and GPU passthrough.", progress=85, target_date="2026-09-30", status="active"),
            Project(id="prj-2", workspace_id=DEFAULT_WS_ID, title="Life OS Web MVP Release v1.0", description="Vite + React responsive web application deployment.", progress=90, target_date="2026-09-15", status="active"),
            Project(id="prj-3", workspace_id=DEFAULT_WS_ID, title="Universal Knowledge Graph Engine", description="Polymorphic relationship graph and backlink inspector.", progress=60, target_date="2026-10-01", status="active"),
        ]
        db.add_all(demo_projects)

    # 4. Seed Daily Journal
    jnl_stmt = select(DailyJournal).where(DailyJournal.workspace_id == DEFAULT_WS_ID)
    jnl_res = await db.execute(jnl_stmt)
    if len(jnl_res.scalars().all()) == 0:
        demo_journal = DailyJournal(
            id="jnl-1",
            workspace_id=DEFAULT_WS_ID,
            entry_date="2026-09-11",
            mood_rating=5,
            reflections="Great velocity today! Delivered full end-to-end Penpot interactive wireframes for Web, updated all project documentation, defined backend architecture, and launched local execution build.",
            wins="1. Completed Penpot 6-screen web wireframe suite.\n2. Standardized Light Mode design tokens.\n3. Defined FastAPI backend architecture."
        )
        db.add(demo_journal)

    # 5. Seed Habits
    hbt_stmt = select(Habit).where(Habit.workspace_id == DEFAULT_WS_ID)
    hbt_res = await db.execute(hbt_stmt)
    if len(hbt_res.scalars().all()) == 0:
        demo_habits = [
            Habit(id="hbt-1", workspace_id=DEFAULT_WS_ID, name="Morning Deep Work Session (2 Hours)", streak_count=14, is_completed_today=True),
            Habit(id="hbt-2", workspace_id=DEFAULT_WS_ID, name="Daily Habit & Reflection Journaling", streak_count=9, is_completed_today=True),
            Habit(id="hbt-3", workspace_id=DEFAULT_WS_ID, name="Physical Workout / Cardio (45 Min)", streak_count=5, is_completed_today=False),
            Habit(id="hbt-4", workspace_id=DEFAULT_WS_ID, name="Read 20 Pages of Technical Literature", streak_count=12, is_completed_today=True),
        ]
        db.add_all(demo_habits)

    # 6. Seed Entity Links (Life Graph)
    link_stmt = select(EntityLink).where(EntityLink.workspace_id == DEFAULT_WS_ID)
    link_res = await db.execute(link_stmt)
    if len(link_res.scalars().all()) == 0:
        demo_links = [
            EntityLink(id="lnk-1", workspace_id=DEFAULT_WS_ID, source_type="note", source_id="nt-1", target_type="project", target_id="prj-1", link_type="supports"),
            EntityLink(id="lnk-2", workspace_id=DEFAULT_WS_ID, source_type="task", source_id="tsk-1", target_type="project", target_id="prj-1", link_type="subtask_of"),
            EntityLink(id="lnk-3", workspace_id=DEFAULT_WS_ID, source_type="note", source_id="nt-2", target_type="project", target_id="prj-2", link_type="defines_spec"),
            EntityLink(id="lnk-4", workspace_id=DEFAULT_WS_ID, source_type="journal", source_id="jnl-1", target_type="task", target_id="tsk-2", link_type="logs_progress"),
        ]
        db.add_all(demo_links)

    await db.commit()
    return {"status": "success", "message": "Demo data populated successfully"}


# ============================================================================
# NOTES ENDPOINTS
# ============================================================================
@api_router.get("/notes", response_model=List[schemas.NoteOut])
async def list_notes(db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Note).where(Note.workspace_id == DEFAULT_WS_ID).order_by(Note.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@api_router.get("/notes/{note_id}", response_model=schemas.NoteOut)
async def get_note(note_id: str, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Note).where(Note.id == note_id).where(Note.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    note = res.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@api_router.post("/notes", response_model=schemas.NoteOut, status_code=status.HTTP_201_CREATED)
async def create_note(note_in: schemas.NoteCreate, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    note = Note(
        workspace_id=DEFAULT_WS_ID,
        title=note_in.title,
        content=note_in.content,
        para_category=note_in.para_category,
        folder_path=note_in.folder_path or "General",
        parent_id=note_in.parent_id,
        tags=note_in.tags,
        is_pinned=note_in.is_pinned
    )
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return note

@api_router.patch("/notes/{note_id}", response_model=schemas.NoteOut)
async def update_note(note_id: str, note_update: schemas.NoteUpdate, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Note).where(Note.id == note_id).where(Note.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    note = res.scalar_one_or_none()
    update_data = note_update.model_dump(exclude_unset=True)
    if not note:
        note = Note(
            id=note_id,
            workspace_id=DEFAULT_WS_ID,
            title=update_data.get("title", "Untitled Note"),
            content=update_data.get("content", ""),
            para_category=update_data.get("para_category", "Resource"),
            folder_path=update_data.get("folder_path", "General"),
            tags=update_data.get("tags", ""),
            is_pinned=update_data.get("is_pinned", False)
        )
        db.add(note)
    else:
        for field, val in update_data.items():
            setattr(note, field, val)
    
    await db.commit()
    await db.refresh(note)
    return note

@api_router.delete("/notes/{note_id}")
async def delete_note(note_id: str, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Note).where(Note.id == note_id).where(Note.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    note = res.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    await db.delete(note)
    await db.commit()
    return {"status": "success", "message": f"Note {note_id} deleted"}


# ============================================================================
# TASKS & PROJECTS ENDPOINTS
# ============================================================================
@api_router.get("/tasks", response_model=List[schemas.TaskOut])
async def list_tasks(db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Task).where(Task.workspace_id == DEFAULT_WS_ID).order_by(Task.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@api_router.post("/tasks", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
async def create_task(task_in: schemas.TaskCreate, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    task = Task(
        workspace_id=DEFAULT_WS_ID,
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        priority=task_in.priority,
        para_category=task_in.para_category,
        target_name=task_in.target_name,
        due_date=task_in.due_date
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task

@api_router.patch("/tasks/{task_id}", response_model=schemas.TaskOut)
async def update_task(task_id: str, task_update: schemas.TaskUpdate, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Task).where(Task.id == task_id).where(Task.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    task = res.scalar_one_or_none()
    update_data = task_update.model_dump(exclude_unset=True)
    if not task:
        task = Task(
            id=task_id,
            workspace_id=DEFAULT_WS_ID,
            title=update_data.get("title", "Untitled Task"),
            description=update_data.get("description", ""),
            status=update_data.get("status", "todo"),
            priority=update_data.get("priority", "medium"),
            para_category=update_data.get("para_category", "Project"),
            target_name=update_data.get("target_name", ""),
            due_date=update_data.get("due_date", "")
        )
        db.add(task)
    else:
        for field, val in update_data.items():
            setattr(task, field, val)
    
    await db.commit()
    await db.refresh(task)
    return task

@api_router.delete("/tasks/{task_id}")
async def delete_task(task_id: str, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Task).where(Task.id == task_id).where(Task.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    task = res.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await db.delete(task)
    await db.commit()
    return {"status": "success", "message": f"Task {task_id} deleted"}

@api_router.get("/projects", response_model=List[schemas.ProjectOut])
async def list_projects(db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Project).where(Project.workspace_id == DEFAULT_WS_ID).order_by(Project.created_at.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@api_router.post("/projects", response_model=schemas.ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(project_in: schemas.ProjectCreate, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    project = Project(
        workspace_id=DEFAULT_WS_ID,
        title=project_in.title,
        description=project_in.description,
        progress=project_in.progress,
        target_date=project_in.target_date,
        status=project_in.status
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project

@api_router.patch("/projects/{project_id}", response_model=schemas.ProjectOut)
async def update_project(project_id: str, project_update: schemas.ProjectUpdate, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Project).where(Project.id == project_id).where(Project.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    project = res.scalar_one_or_none()
    update_data = project_update.model_dump(exclude_unset=True)
    if not project:
        project = Project(
            id=project_id,
            workspace_id=DEFAULT_WS_ID,
            title=update_data.get("title", "Untitled Project"),
            description=update_data.get("description", ""),
            progress=update_data.get("progress", 0),
            target_date=update_data.get("target_date", ""),
            status=update_data.get("status", "active")
        )
        db.add(project)
    else:
        for field, val in update_data.items():
            setattr(project, field, val)
    
    await db.commit()
    await db.refresh(project)
    return project

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Project).where(Project.id == project_id).where(Project.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    project = res.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await db.delete(project)
    await db.commit()
    return {"status": "success", "message": f"Project {project_id} deleted"}


# ============================================================================
# AREAS OF LIFE ENDPOINTS
# ============================================================================
@api_router.get("/areas", response_model=List[schemas.AreaOut])
async def list_areas(db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Area).where(Area.workspace_id == DEFAULT_WS_ID).order_by(Area.created_at.asc())
    res = await db.execute(stmt)
    areas = res.scalars().all()
    if len(areas) == 0:
        demo_areas = [
            Area(id="ara-1", workspace_id=DEFAULT_WS_ID, name="Health & Fitness", description="Physical wellness, exercise, nutrition, and sleep hygiene."),
            Area(id="ara-2", workspace_id=DEFAULT_WS_ID, name="Finance & Wealth", description="Budgeting, investment portfolio, expense tracking, and savings."),
            Area(id="ara-3", workspace_id=DEFAULT_WS_ID, name="Career & Deep Work", description="Professional skills, work projects, publications, and networking."),
            Area(id="ara-4", workspace_id=DEFAULT_WS_ID, name="Homelab & Infrastructure", description="Server maintenance, ZFS pools, network security, and self-hosted services."),
            Area(id="ara-5", workspace_id=DEFAULT_WS_ID, name="Personal Growth", description="Reading, learning, habit consistency, and daily reflection."),
            Area(id="ara-6", workspace_id=DEFAULT_WS_ID, name="Daily Routines", description="Morning routine, evening shutdown, weekly planning, and chores.")
        ]
        db.add_all(demo_areas)
        await db.commit()
        stmt = select(Area).where(Area.workspace_id == DEFAULT_WS_ID).order_by(Area.created_at.asc())
        res = await db.execute(stmt)
        areas = res.scalars().all()
    return areas

@api_router.post("/areas", response_model=schemas.AreaOut, status_code=status.HTTP_201_CREATED)
async def create_area(area_in: schemas.AreaCreate, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    area = Area(
        workspace_id=DEFAULT_WS_ID,
        name=area_in.name,
        description=area_in.description,
        icon=area_in.icon,
        color=area_in.color
    )
    db.add(area)
    await db.commit()
    await db.refresh(area)
    return area

@api_router.patch("/areas/{area_id}", response_model=schemas.AreaOut)
async def update_area(area_id: str, area_update: schemas.AreaUpdate, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Area).where(Area.id == area_id).where(Area.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    area = res.scalar_one_or_none()
    update_data = area_update.model_dump(exclude_unset=True)
    if not area:
        area = Area(
            id=area_id,
            workspace_id=DEFAULT_WS_ID,
            name=update_data.get("name", "Untitled Area"),
            description=update_data.get("description", ""),
            icon=update_data.get("icon", ""),
            color=update_data.get("color", "")
        )
        db.add(area)
    else:
        for field, val in update_data.items():
            setattr(area, field, val)
    
    await db.commit()
    await db.refresh(area)
    return area

@api_router.delete("/areas/{area_id}")
async def delete_area(area_id: str, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Area).where(Area.id == area_id).where(Area.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    area = res.scalar_one_or_none()
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    
    await db.delete(area)
    await db.commit()
    return {"status": "success", "message": f"Area {area_id} deleted"}


# ============================================================================
# DAILY JOURNAL & HABITS ENDPOINTS
# ============================================================================
@api_router.get("/journal", response_model=List[schemas.DailyJournalOut])
async def list_journals(db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(DailyJournal).where(DailyJournal.workspace_id == DEFAULT_WS_ID).order_by(DailyJournal.entry_date.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@api_router.post("/journal", response_model=schemas.DailyJournalOut, status_code=status.HTTP_201_CREATED)
async def create_journal(journal_in: schemas.DailyJournalCreate, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    journal = DailyJournal(
        workspace_id=DEFAULT_WS_ID,
        entry_date=journal_in.entry_date,
        mood_rating=journal_in.mood_rating,
        reflections=journal_in.reflections,
        wins=journal_in.wins
    )
    db.add(journal)
    await db.commit()
    await db.refresh(journal)
    return journal

@api_router.get("/habits", response_model=List[schemas.HabitOut])
async def list_habits(db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Habit).where(Habit.workspace_id == DEFAULT_WS_ID).order_by(Habit.created_at.asc())
    res = await db.execute(stmt)
    return res.scalars().all()

@api_router.post("/habits/{habit_id}/toggle", response_model=schemas.HabitOut)
async def toggle_habit(habit_id: str, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Habit).where(Habit.id == habit_id).where(Habit.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    habit = res.scalar_one_or_none()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    habit.is_completed_today = not habit.is_completed_today
    if habit.is_completed_today:
        habit.streak_count += 1
    else:
        habit.streak_count = max(0, habit.streak_count - 1)
        
@api_router.post("/habits", response_model=schemas.HabitOut, status_code=status.HTTP_201_CREATED)
async def create_habit(habit_in: schemas.HabitCreate, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    habit = Habit(
        workspace_id=DEFAULT_WS_ID,
        name=habit_in.name,
        streak_count=habit_in.streak_count,
        is_completed_today=habit_in.is_completed_today
    )
    db.add(habit)
    await db.commit()
    await db.refresh(habit)
    return habit

@api_router.delete("/habits/{habit_id}")
async def delete_habit(habit_id: str, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(Habit).where(Habit.id == habit_id).where(Habit.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    habit = res.scalar_one_or_none()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    await db.delete(habit)
    await db.commit()
    return {"status": "success", "message": f"Habit {habit_id} deleted"}


# ============================================================================
# LIFE GRAPH LINKS ENDPOINTS
# ============================================================================
@api_router.get("/graph", response_model=List[schemas.EntityLinkOut])
async def list_graph_links(db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    stmt = select(EntityLink).where(EntityLink.workspace_id == DEFAULT_WS_ID)
    res = await db.execute(stmt)
    return res.scalars().all()

@api_router.post("/graph", response_model=schemas.EntityLinkOut, status_code=status.HTTP_201_CREATED)
async def create_graph_link(link_in: schemas.EntityLinkCreate, db: AsyncSession = Depends(get_db)):
    await ensure_default_workspace(db)
    link = EntityLink(
        workspace_id=DEFAULT_WS_ID,
        source_type=link_in.source_type,
        source_id=link_in.source_id,
        target_type=link_in.target_type,
        target_id=link_in.target_id,
        link_type=link_in.link_type
    )
    db.add(link)
    await db.commit()
    await db.refresh(link)
    return link
