# Candidate Notes & Actions API Contract

## Candidate Notes API

### Get All Notes for a Candidate

**Endpoint:** `GET /api/v1/candidates/:candidate_id/notes`

**Headers:**
```
Authorization: Bearer <JWT>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "notes": [
    {
      "id": "note-uuid-123",
      "candidate_id": "candidate-uuid-456",
      "author": {
        "id": "user-uuid-789",
        "name": "Kim Van Rompay"
      },
      "content": "Initial screening completed. Strong technical skills demonstrated in code sample.",
      "created_at": "2024-02-01T10:30:00Z",
      "updated_at": "2024-02-01T10:30:00Z"
    },
    {
      "id": "note-uuid-124",
      "candidate_id": "candidate-uuid-456",
      "author": {
        "id": "user-uuid-790",
        "name": "Team Lead"
      },
      "content": "Scheduled for technical interview on Feb 5th at 2PM.",
      "created_at": "2024-02-02T14:15:00Z",
      "updated_at": "2024-02-02T14:15:00Z"
    }
  ]
}
```

---

### Add a Note

**Endpoint:** `POST /api/v1/candidates/:candidate_id/notes`

**Headers:**
```
Authorization: Bearer <JWT>
Content-Type: application/json
```

**Request Body:**
```json
{
  "note": {
    "content": "Candidate showed excellent problem-solving skills during technical interview."
  }
}
```

**Response (201 Created):**
```json
{
  "note": {
    "id": "note-uuid-125",
    "candidate_id": "candidate-uuid-456",
    "author": {
      "id": "user-uuid-789",
      "name": "Kim Van Rompay"
    },
    "content": "Candidate showed excellent problem-solving skills during technical interview.",
    "created_at": "2024-02-04T19:20:00Z",
    "updated_at": "2024-02-04T19:20:00Z"
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "error": "Validation error",
  "message": "Note content cannot be empty"
}
```

404 Not Found:
```json
{
  "error": "Candidate not found",
  "message": "No candidate exists with id: candidate-uuid-456"
}
```

---

### Update a Note

**Endpoint:** `PATCH /api/v1/candidates/:candidate_id/notes/:note_id`

**Request Body:**
```json
{
  "note": {
    "content": "Updated note content here"
  }
}
```

**Response (200 OK):**
```json
{
  "note": {
    "id": "note-uuid-125",
    "candidate_id": "candidate-uuid-456",
    "author": {
      "id": "user-uuid-789",
      "name": "Kim Van Rompay"
    },
    "content": "Updated note content here",
    "created_at": "2024-02-04T19:20:00Z",
    "updated_at": "2024-02-04T19:25:00Z"
  }
}
```

---

### Delete a Note

**Endpoint:** `DELETE /api/v1/candidates/:candidate_id/notes/:note_id`

**Response (204 No Content)**

---

## Candidate Actions API

### Archive Candidate

**Endpoint:** `PATCH /api/v1/candidates/:id`

**Request Body:**
```json
{
  "candidate": {
    "status": "archived"
  }
}
```

**Response (200 OK):**
```json
{
  "candidate": {
    "id": "candidate-uuid-456",
    "status": "archived",
    "archived_at": "2024-02-04T19:30:00Z",
    "updated_at": "2024-02-04T19:30:00Z"
  }
}
```

**Notes:**
- Archived candidates are hidden from active candidate lists but can be restored
- Archive preserves all candidate data

---

### Reject Candidate

**Endpoint:** `PATCH /api/v1/candidates/:id`

**Request Body:**
```json
{
  "candidate": {
    "status": "rejected",
    "rejection_reason": "Not a good fit for company culture" // Optional
  }
}
```

**Response (200 OK):**
```json
{
  "candidate": {
    "id": "candidate-uuid-456",
    "status": "rejected",
    "rejection_reason": "Not a good fit for company culture",
    "rejected_at": "2024-02-04T19:35:00Z",
    "updated_at": "2024-02-04T19:35:00Z"
  }
}
```

**Notes:**
- Rejected candidates remain in the system for record-keeping
- Can include optional rejection reason
- Rejection triggers email notification (if configured)

---

### Delete Candidate (Permanent)

**Endpoint:** `DELETE /api/v1/candidates/:id`

**Headers:**
```
Authorization: Bearer <JWT>
Content-Type: application/json
```

**Response (204 No Content)**

**Error Responses:**

403 Forbidden:
```json
{
  "error": "Permission denied",
  "message": "Only account owners can permanently delete candidates"
}
```

404 Not Found:
```json
{
  "error": "Candidate not found",
  "message": "No candidate exists with id: candidate-uuid-456"
}
```

**Notes:**
- Permanent deletion removes ALL candidate data including:
  - Personal information
  - Assessment results  
  - Application history
  - Notes
  - Events
- This action CANNOT be undone
- Requires confirmation in frontend
- May be restricted to account owners/admins only

---

## Frontend Implementation

### Notes Panel

**State Management:**
```typescript
showNotesPanel = false;  // Toggle visibility
newNoteContent = '';     // Form input
candidateNotes: Note[] = [];  // Loaded from API
```

**Loading Notes:**
```typescript
loadNotes(candidateId: string) {
  this.noteService.getNotes(candidateId).subscribe(notes => {
    this.candidateNotes = notes;
  });
}
```

**Adding a Note:**
```typescript
addNote() {
  this.noteService.createNote(this.candidateId, {
    content: this.newNoteContent
  }).subscribe(note => {
    this.candidateNotes.push(note);
    this.newNoteContent = '';
  });
}
```

### Action Buttons

**Archive:**
```typescript
archiveCandidate() {
  this.candidateService.updateCandidate(this.candidateId, {
    status: 'archived'
  }).subscribe(() => {
    this.router.navigate(['/dashboard/candidates']);
  });
}
```

**Reject:**
```typescript
rejectCandidate() {
  const reason = prompt('Rejection reason (optional):');
  this.candidateService.updateCandidate(this.candidateId, {
    status: 'rejected',
    rejection_reason: reason || undefined
  }).subscribe(() => {
    this.router.navigate(['/dashboard/candidates']);
  });
}
```

**Delete:**
```typescript
deleteCandidate() {
  const confirmed = confirm('Permanently delete? This cannot be undone.');
  if (confirmed) {
    this.candidateService.deleteCandidate(this.candidateId).subscribe(() => {
      this.router.navigate(['/dashboard/candidates']);
    });
  }
}
```

---

## Database Schema

### Notes Table

```sql
CREATE TABLE candidate_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT content_not_empty CHECK (length(trim(content)) > 0)
);

CREATE INDEX idx_candidate_notes_candidate_id ON candidate_notes(candidate_id);
CREATE INDEX idx_candidate_notes_created_at ON candidate_notes(created_at DESC);
```

### Candidates Table Updates

```sql
ALTER TABLE candidates ADD COLUMN archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE candidates ADD COLUMN rejected_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE candidates ADD COLUMN rejection_reason TEXT;
```

---

## Testing Checklist

### Notes API
- [ ] GET /api/v1/candidates/:id/notes returns empty array when no notes
- [ ] POST /api/v1/candidates/:id/notes creates note successfully
- [ ] POST validates content is not empty
- [ ] Notes are returned in chronological order (oldest first)
- [ ] Author information is populated correctly
- [ ] Only authorized users can view/add notes

### Actions API
- [ ] PATCH with status='archived' works
- [ ] PATCH with status='rejected' works  
- [ ] DELETE permanently removes candidate
- [ ] DELETE requires confirmation
- [ ] DELETE is restricted to appropriate roles
- [ ] Archived candidates can be restored
- [ ] Rejected candidates remain viewable

---

## Summary

**New Endpoints:**
1. `GET /api/v1/candidates/:id/notes` - List all notes
2. `POST /api/v1/candidates/:id/notes` - Add new note
3. `PATCH /api/v1/candidates/:id/notes/:note_id` - Update note
4. `DELETE /api/v1/candidates/:id/notes/:note_id` - Delete note
5. `PATCH /api/v1/candidates/:id` - Update status (archive/reject)
6. `DELETE /api/v1/candidates/:id` - Permanent deletion

**UI Components:**
- Slide-out notes panel (chat-style)
- Bottom danger zone with Archive/Reject/Delete buttons
- Real-time note timestamps ("5m ago", "2h ago", etc.)
