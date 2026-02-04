# Backend API Specification for Candidate Detail Page

This document describes the exact data structure the frontend expects from the backend API for the candidate detail functionality.

## API Endpoint

```
GET /api/v1/candidates/:id
```

## Response Format

The backend must return a JSON response with the following structure:

```json
{
  "candidate": {
    // ... CandidateDetail object (see below)
  }
}
```

## CandidateDetail Object Structure

The `candidate` object must include ALL of the following fields:

### Required Base Fields

```typescript
{
  // Identity fields
  "id": "string (UUID)",                    // Example: "4a6526cf-19bc-4d4d-ba1c-320968336267"
  "first_name": "string",                   // Example: "John"
  "last_name": "string",                    // Example: "Doe"
  "full_name": "string",                    // Example: "John Doe"
  "email": "string (email)",                // Example: "john.doe@example.com"
  
  // Optional contact
  "phone": "string | null",                 // Example: "+1234567890" or null
  
  // Status fields
  "status": "string",                       // One of: "new", "in_process", "hired", "rejected"
  "source": "string",                       // One of: "manual", "invited", "applied"
  "preferred_language": "string",           // Example: "en", "nl", "fr"
  
  // File references
  "cv_url": "string | null",                // Example: "https://storage.example.com/cv/123.pdf" or null
  
  // Counts and references
  "applications_count": "number",           // Example: 2
  "latest_application_id": "string | null", // Example: "app-uuid-123" or null
  
  // Timestamps
  "created_at": "string (ISO 8601)",        // Example: "2023-10-15T14:30:00Z"
  "updated_at": "string (ISO 8601)",        // Example: "2023-11-20T09:15:00Z"
  
  // Additional detail-specific fields
  "notes": "string | null",                 // Recruiter notes about the candidate (or null)
  
  // Nested arrays
  "applications": [...],                     // Array of ApplicationSummary objects
  "events": [...]                           // Array of CandidateEvent objects
}
```

### Optional KPI Match Fields

These fields are used for the C.O.R.E. Profiler feature (0-100 scores):

```typescript
{
  "expectation_match": "number | null",     // 0-100, or null if not assessed
  "values_match": "number | null",          // 0-100, or null if not assessed
  "potential_match": "number | null",       // 0-100, or null if not assessed
  "skills_match": "number | null"          // 0-100, or null if not assessed
}
```

**Mapping:**
- `values_match` → Character (C)
- `potential_match` → Originality (O)
- `expectation_match` → Resilience (R)
- `skills_match` → Excellence (E)

### Optional Invitation Fields

Only include these when `source === "invited"`:

```typescript
{
  "invitation_status": "string | null",     // Example: "pending", "accepted", "expired"
  "invited_by": {                           // Or null
    "id": "string (UUID)",
    "name": "string"
  },
  "invited_for_job": {                      // Or null
    "id": "string (UUID)",
    "title": "string"
  },
  "invitation_sent_at": "string (ISO 8601) | null",
  "invitation_accepted_at": "string (ISO 8601) | null",
  "invitation_expired": "boolean | null"
}
```

### Applications Array

Each item in the `applications` array must have:

```typescript
{
  "id": "string (UUID)",
  "position_applied": "string",             // Job title
  "status": "string",                       // Example: "submitted", "reviewing", "accepted"
  "mbti_result": "string | null",          // Example: "INTJ" or null
  "submitted_at": "string (ISO 8601)",
  "skill_tests_count": "number",           // Example: 3
  "all_tests_passed": "boolean"            // true if all tests passed
}
```

### Events Array

Each item in the `events` array must have:

```typescript
{
  "id": "number",                           // Numeric ID
  "event_type": "string",                   // Example: "candidate_created", "note_added", "status_changed"
  "triggered_by": {                         // Or null for system events
    "id": "string (UUID)",
    "name": "string"
  },
  "metadata": "object | null",              // Any JSON object with event-specific data
  "occurred_at": "string (ISO 8601)"
}
```

## Complete Example Response

```json
{
  "candidate": {
    "id": "4a6526cf-19bc-4d4d-ba1c-320968336267",
    "first_name": "Sarah",
    "last_name": "Johnson",
    "full_name": "Sarah Johnson",
    "email": "sarah.johnson@example.com",
    "phone": "+32 475 12 34 56",
    "status": "in_process",
    "source": "invited",
    "preferred_language": "en",
    "cv_url": "https://storage.meribas.app/cvs/sarah-johnson-cv.pdf",
    "applications_count": 2,
    "latest_application_id": "app-123-456",
    "created_at": "2023-10-15T14:30:00Z",
    "updated_at": "2023-11-20T09:15:00Z",
    "notes": "Strong technical background. Shows great potential for leadership roles.",
    
    "expectation_match": 75,
    "values_match": 82,
    "potential_match": 68,
    "skills_match": 91,
    
    "invitation_status": "accepted",
    "invited_by": {
      "id": "recruiter-uuid-123",
      "name": "Kim Van Rompay"
    },
    "invited_for_job": {
      "id": "job-uuid-456",
      "title": "Senior Software Engineer"
    },
    "invitation_sent_at": "2023-10-10T10:00:00Z",
    "invitation_accepted_at": "2023-10-12T15:30:00Z",
    "invitation_expired": false,
    
    "applications": [
      {
        "id": "app-123-456",
        "position_applied": "Senior Software Engineer",
        "status": "reviewing",
        "mbti_result": "INTJ",
        "submitted_at": "2023-10-15T14:30:00Z",
        "skill_tests_count": 3,
        "all_tests_passed": true
      },
      {
        "id": "app-789-012",
        "position_applied": "Tech Lead",
        "status": "submitted",
        "mbti_result": null,
        "submitted_at": "2023-11-18T10:00:00Z",
        "skill_tests_count": 2,
        "all_tests_passed": false
      }
    ],
    
    "events": [
      {
        "id": 1,
        "event_type": "candidate_invited",
        "triggered_by": {
          "id": "recruiter-uuid-123",
          "name": "Kim Van Rompay"
        },
        "metadata": {
          "job_id": "job-uuid-456",
          "job_title": "Senior Software Engineer"
        },
        "occurred_at": "2023-10-10T10:00:00Z"
      },
      {
        "id": 2,
        "event_type": "invitation_accepted",
        "triggered_by": null,
        "metadata": {},
        "occurred_at": "2023-10-12T15:30:00Z"
      },
      {
        "id": 3,
        "event_type": "application_submitted",
        "triggered_by": null,
        "metadata": {
          "application_id": "app-123-456",
          "position": "Senior Software Engineer"
        },
        "occurred_at": "2023-10-15T14:30:00Z"
      },
      {
        "id": 4,
        "event_type": "status_changed",
        "triggered_by": {
          "id": "recruiter-uuid-123",
          "name": "Kim Van Rompay"
        },
        "metadata": {
          "from": "new",
          "to": "in_process"
        },
        "occurred_at": "2023-10-16T09:00:00Z"
      },
      {
        "id": 5,
        "event_type": "note_added",
        "triggered_by": {
          "id": "recruiter-uuid-123",
          "name": "Kim Van Rompay"
        },
        "metadata": {
          "note_preview": "Strong technical background..."
        },
        "occurred_at": "2023-11-20T09:15:00Z"
      }
    ]
  }
}
```

## Minimal Valid Response

If a candidate has no applications or events yet, this is the minimal valid response:

```json
{
  "candidate": {
    "id": "candidate-uuid-123",
    "first_name": "Jane",
    "last_name": "Smith",
    "full_name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": null,
    "status": "new",
    "source": "manual",
    "preferred_language": "en",
    "cv_url": null,
    "applications_count": 0,
    "latest_application_id": null,
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z",
    "notes": null,
    
    "expectation_match": null,
    "values_match": null,
    "potential_match": null,
    "skills_match": null,
    
    "applications": [],
    "events": []
  }
}
```

## Error Handling

If the candidate is not found or there's an error, return:

**404 Not Found:**
```json
{
  "error": "Candidate not found",
  "message": "No candidate exists with id: candidate-uuid-123"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred while fetching candidate details"
}
```

## Important Notes

1. **All string fields must be strings** - Even if empty, use `""` not `null` (except where explicitly marked as nullable)
2. **Dates must be ISO 8601 format** - Include timezone (preferably UTC with `Z` suffix)
3. **Arrays must exist** - `applications` and `events` should be `[]` not `null` if empty
4. **Match scores are optional** - Can be `null` if assessments haven't been completed
5. **Invitation fields are optional** - Only include when `source === "invited"`
6. **Event metadata** - Can be any valid JSON object or `null`

## Testing Checklist

- [ ] Endpoint returns 200 for valid candidate ID
- [ ] All required fields are present
- [ ] Dates are in ISO 8601 format
- [ ] Arrays are never null (use `[]` for empty)
- [ ] Invitation fields present when source is "invited"
- [ ] Match scores are numbers between 0-100 or null
- [ ] Events ordered chronologically (oldest first recommended)
- [ ] Returns 404 for non-existent candidate
- [ ] Returns proper error structure on server errors
