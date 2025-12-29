# API Endpoints для Subject Detail Page

## Base URL

```
http://localhost:8000/api/v1
```

---

## Lessons API

### GET /lessons/{lesson_id}

Получение детальной информации об уроке.

**Response:**

```json
{
    "id": "string",
    "title": "string",
    "description": "string",
    "video_url": "string",
    "duration": 0,
    "order": 0,
    "section_id": "string",
    "subject_id": "string",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "section": {
        "id": "string",
        "title": "string"
    },
    "subject": {
        "id": "string",
        "title": "string",
        "total_lessons": 0,
        "total_duration": 0
    },
    "next_lesson_id": "string | null",
    "prev_lesson_id": "string | null",
    "tasks": [
        {
            "id": "string",
            "title": "string",
            "type": "test | assignment",
            "questions_count": 0
        }
    ]
}
```

---

### GET /lessons/{lesson_id}/progress

Получение прогресса пользователя по уроку.

**Response:**

```json
{
    "lesson_id": "string",
    "watched_seconds": 0,
    "is_completed": false,
    "completed_at": "2024-01-01T00:00:00Z | null"
}
```

---

### PATCH /lessons/{lesson_id}/progress

Обновление прогресса просмотра.

**Request:**

```json
{
    "watched_seconds": 0,
    "is_completed": false
}
```

**Response:** `LessonProgress`

---

### POST /lessons/{lesson_id}/complete

Отметить урок как завершенный.

**Response:** `LessonProgress`

---

## Comments API

### GET /lessons/{lesson_id}/comments

Получение комментариев к уроку с пагинацией.

**Query Parameters:**

-   `page` (int, default: 1)
-   `page_size` (int, default: 20)

**Response:**

```json
{
    "items": [
        {
            "id": "string",
            "author_name": "string",
            "author_initial": "string",
            "text": "string",
            "created_at": "2024-01-01T00:00:00Z",
            "lesson_id": "string"
        }
    ],
    "total": 0,
    "page": 1,
    "page_size": 20
}
```

---

### POST /lessons/{lesson_id}/comments

Создание нового комментария.

**Request:**

```json
{
    "text": "string"
}
```

**Response:** `Comment`

---

### PATCH /comments/{comment_id}

Редактирование комментария (только автор).

**Request:**

```json
{
    "text": "string"
}
```

**Response:** `Comment`

---

### DELETE /comments/{comment_id}

Удаление комментария (только автор).

**Response:** `204 No Content`

---

## FastAPI Models (Python)

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum

class TaskType(str, Enum):
    TEST = "test"
    ASSIGNMENT = "assignment"

class LessonTask(BaseModel):
    id: str
    title: str
    type: TaskType
    questions_count: Optional[int] = None

class SectionInfo(BaseModel):
    id: str
    title: str

class SubjectInfo(BaseModel):
    id: str
    title: str
    total_lessons: int
    total_duration: int

class Lesson(BaseModel):
    id: str
    title: str
    description: str
    video_url: str
    duration: int
    order: int
    section_id: str
    subject_id: str
    created_at: datetime
    updated_at: datetime

class LessonDetail(Lesson):
    section: SectionInfo
    subject: SubjectInfo
    next_lesson_id: Optional[str] = None
    prev_lesson_id: Optional[str] = None
    tasks: List[LessonTask] = []

class LessonProgress(BaseModel):
    lesson_id: str
    watched_seconds: int
    is_completed: bool
    completed_at: Optional[datetime] = None

class Comment(BaseModel):
    id: str
    author_name: str
    author_initial: str
    text: str
    created_at: datetime
    lesson_id: str

class CreateCommentRequest(BaseModel):
    text: str

class UpdateCommentRequest(BaseModel):
    text: str

class UpdateProgressRequest(BaseModel):
    watched_seconds: int
    is_completed: Optional[bool] = None

class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    page_size: int
```

---

## FastAPI Routes Example

```python
from fastapi import APIRouter, Depends, HTTPException
from typing import List

router = APIRouter()

@router.get("/lessons/{lesson_id}", response_model=LessonDetail)
async def get_lesson(lesson_id: str):
    # TODO: Implement
    pass

@router.get("/lessons/{lesson_id}/progress", response_model=LessonProgress)
async def get_lesson_progress(lesson_id: str, user = Depends(get_current_user)):
    # TODO: Implement
    pass

@router.patch("/lessons/{lesson_id}/progress", response_model=LessonProgress)
async def update_lesson_progress(
    lesson_id: str,
    data: UpdateProgressRequest,
    user = Depends(get_current_user)
):
    # TODO: Implement
    pass

@router.post("/lessons/{lesson_id}/complete", response_model=LessonProgress)
async def complete_lesson(lesson_id: str, user = Depends(get_current_user)):
    # TODO: Implement
    pass

@router.get("/lessons/{lesson_id}/comments")
async def get_comments(lesson_id: str, page: int = 1, page_size: int = 20):
    # TODO: Implement
    pass

@router.post("/lessons/{lesson_id}/comments", response_model=Comment)
async def create_comment(
    lesson_id: str,
    data: CreateCommentRequest,
    user = Depends(get_current_user)
):
    # TODO: Implement
    pass

@router.patch("/comments/{comment_id}", response_model=Comment)
async def update_comment(
    comment_id: str,
    data: UpdateCommentRequest,
    user = Depends(get_current_user)
):
    # TODO: Implement
    pass

@router.delete("/comments/{comment_id}", status_code=204)
async def delete_comment(comment_id: str, user = Depends(get_current_user)):
    # TODO: Implement
    pass
```
