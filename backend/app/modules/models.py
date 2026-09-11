from datetime import datetime, timezone
import uuid
from sqlalchemy import String, Text, Boolean, Integer, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

# ============================================================================
# CONTEXT 1: AUTH & MULTI-TENANCY
# ============================================================================
class Workspace(Base):
    __tablename__ = "workspaces"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


# ============================================================================
# CONTEXT 2: SECOND BRAIN (NOTES & DOCUMENTS)
# ============================================================================
class Note(Base):
    __tablename__ = "notes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(36), ForeignKey("workspaces.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False, default="")
    para_category: Mapped[str] = mapped_column(String(50), nullable=False, default="Resource") # Project, Area, Resource, Archive
    tags: Mapped[str] = mapped_column(String(255), nullable=True, default="")
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)


# ============================================================================
# CONTEXT 3: TASKS & PROJECTS
# ============================================================================
class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(36), ForeignKey("workspaces.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True, default="")
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="todo") # todo, in_progress, completed
    priority: Mapped[str] = mapped_column(String(20), nullable=False, default="medium") # urgent, high, medium, low
    para_category: Mapped[str] = mapped_column(String(50), nullable=False, default="Project")
    due_date: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(36), ForeignKey("workspaces.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True, default="")
    progress: Mapped[int] = mapped_column(Integer, default=0) # 0 to 100 percentage
    target_date: Mapped[str] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


# ============================================================================
# CONTEXT 4: DAILY JOURNAL & HABITS
# ============================================================================
class DailyJournal(Base):
    __tablename__ = "daily_journals"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(36), ForeignKey("workspaces.id"), nullable=False, index=True)
    entry_date: Mapped[str] = mapped_column(String(20), nullable=False, index=True) # YYYY-MM-DD
    mood_rating: Mapped[int] = mapped_column(Integer, default=4) # 1 to 5
    reflections: Mapped[str] = mapped_column(Text, nullable=True, default="")
    wins: Mapped[str] = mapped_column(Text, nullable=True, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


class Habit(Base):
    __tablename__ = "habits"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(36), ForeignKey("workspaces.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    streak_count: Mapped[int] = mapped_column(Integer, default=0)
    is_completed_today: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)


# ============================================================================
# CONTEXT 5: UNIVERSAL LIFE GRAPH LINKS
# ============================================================================
class EntityLink(Base):
    __tablename__ = "entity_links"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    workspace_id: Mapped[str] = mapped_column(String(36), ForeignKey("workspaces.id"), nullable=False, index=True)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False) # note, task, project, journal
    source_id: Mapped[str] = mapped_column(String(36), nullable=False)
    target_type: Mapped[str] = mapped_column(String(50), nullable=False)
    target_id: Mapped[str] = mapped_column(String(36), nullable=False)
    link_type: Mapped[str] = mapped_column(String(50), default="relates_to") # depends_on, references, subtask_of
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
