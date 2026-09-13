from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

# Workspace Schemas
class WorkspaceBase(BaseModel):
    name: str
    slug: str

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceOut(WorkspaceBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Note Schemas
class NoteBase(BaseModel):
    title: str
    content: str = ""
    para_category: str = "Resource"
    folder_path: Optional[str] = "General"
    parent_id: Optional[str] = None
    tags: Optional[str] = ""
    is_pinned: bool = False

class NoteCreate(NoteBase):
    workspace_id: str = "default_ws"

class NoteOut(NoteBase):
    id: str
    workspace_id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = ""
    status: str = "todo"
    priority: str = "medium"
    para_category: str = "Project"
    target_name: Optional[str] = ""
    due_date: Optional[str] = None

class TaskCreate(TaskBase):
    workspace_id: str = "default_ws"

class TaskOut(TaskBase):
    id: str
    workspace_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Project Schemas
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = ""
    progress: int = 0
    target_date: Optional[str] = None
    status: str = "active"

class ProjectCreate(ProjectBase):
    workspace_id: str = "default_ws"

class ProjectOut(ProjectBase):
    id: str
    workspace_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Daily Journal Schemas
class DailyJournalBase(BaseModel):
    entry_date: str
    mood_rating: int = 4
    reflections: Optional[str] = ""
    wins: Optional[str] = ""

class DailyJournalCreate(DailyJournalBase):
    workspace_id: str = "default_ws"

class DailyJournalOut(DailyJournalBase):
    id: str
    workspace_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    para_category: Optional[str] = None
    folder_path: Optional[str] = None
    parent_id: Optional[str] = None
    tags: Optional[str] = None
    is_pinned: Optional[bool] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    para_category: Optional[str] = None
    target_name: Optional[str] = None
    due_date: Optional[str] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    progress: Optional[int] = None
    target_date: Optional[str] = None
    status: Optional[str] = None


# Area Schemas
class AreaBase(BaseModel):
    name: str
    description: Optional[str] = ""
    icon: Optional[str] = ""
    color: Optional[str] = ""

class AreaCreate(AreaBase):
    workspace_id: str = "default_ws"

class AreaUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None

class AreaOut(AreaBase):
    id: str
    workspace_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Habit Schemas
class HabitBase(BaseModel):
    name: str
    streak_count: int = 0
    is_completed_today: bool = False

class HabitCreate(HabitBase):
    workspace_id: str = "default_ws"

class HabitOut(HabitBase):
    id: str
    workspace_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Entity Link (Life Graph) Schemas
class EntityLinkBase(BaseModel):
    source_type: str
    source_id: str
    target_type: str
    target_id: str
    link_type: str = "relates_to"

class EntityLinkCreate(EntityLinkBase):
    workspace_id: str = "default_ws"

class EntityLinkOut(EntityLinkBase):
    id: str
    workspace_id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Auth Schemas
class LoginRequest(BaseModel):
    username: str
    password: str
    mfa_code: Optional[str] = None
    mfa_token: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class MfaVerifyRequest(BaseModel):
    mfa_token: str
    mfa_code: str

class MfaChallengeResponse(BaseModel):
    mfa_required: bool = True
    mfa_token: str
    message: str = "Multi-Factor Authentication code required"

class MfaSetupResponse(BaseModel):
    secret: str
    otpauth_url: str
    current_code: str

class MfaEnableRequest(BaseModel):
    secret: str
    code: str

class MfaStatusResponse(BaseModel):
    mfa_enabled: bool
    secret: Optional[str] = None


