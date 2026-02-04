# URGENT: Candidate Detail Endpoint Fix

## Problem

Frontend is getting **500 Internal Server Error** when fetching candidate details:
```
GET https://api.meribas.app/api/v1/candidates/4a6526cf-19bc-4d4d-ba1c-320968336267
```

## What the Backend Must Return

### Endpoint
`GET /api/v1/candidates/:id`

### Required Response Structure

```json
{
  "candidate": {
    // Identity (REQUIRED - all strings)
    "id": "4a6526cf-19bc-4d4d-ba1c-320968336267",
    "first_name": "Sarah",
    "last_name": "Johnson",
    "full_name": "Sarah Johnson",
    "email": "sarah.johnson@example.com",
    
    // Contact (nullable)
    "phone": "+32 475 12 34 56",
    
    // Status (REQUIRED - specific values)
    "status": "in_process",
    "source": "invited",
    "preferred_language": "en",
    
    // Files (nullable)
    "cv_url": "https://storage.meribas.app/cvs/sarah-cv.pdf",
    
    // Counts (REQUIRED - numbers)
    "applications_count": 2,
    "latest_application_id": "app-123-456",
    
    // Timestamps (REQUIRED - ISO 8601)
    "created_at": "2023-10-15T14:30:00Z",
    "updated_at": "2023-11-20T09:15:00Z",
    
    // Detail (nullable)
    "notes": "Strong technical background. Great potential.",
    
    // KPI scores (nullable numbers 0-100)
    "expectation_match": 75,
    "values_match": 82,
    "potential_match": 68,
    "skills_match": 91,
    
    // CRITICAL: These MUST be arrays, NEVER null
    "applications": [],
    "events": [],
    
    // Invitation fields (optional, only when source === 'invited')
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
    "invitation_expired": false
  }
}
```

## Common Causes of 500 Error

1. **Missing required fields** - All fields above marked REQUIRED must exist
2. **Null arrays** - `applications` or `events` being `null` instead of `[]`
3. **Wrong data types** - Strings instead of numbers, etc.
4. **Database query error** - Trying to load related data that doesn't exist
5. **Missing relationships** - JOIN errors on applications or events tables

## Minimal Valid Response

If the candidate has NO applications or events yet:

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

## Applications Array Format

If candidate HAS applications:

```json
"applications": [
  {
    "id": "app-123-456",
    "position_applied": "Senior Software Engineer",
    "status": "reviewing",
    "mbti_result": "INTJ",
    "submitted_at": "2023-10-15T14:30:00Z",
    "skill_tests_count": 3,
    "all_tests_passed": true
  }
]
```

## Events Array Format

If candidate HAS events:

```json
"events": [
  {
    "id": 1,
    "event_type": "candidate_created",
    "triggered_by": {
      "id": "recruiter-uuid-123",
      "name": "Kim Van Rompay"
    },
    "metadata": {
      "source": "manual_entry"
    },
    "occurred_at": "2023-10-15T14:30:00Z"
  },
  {
    "id": 2,
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
  }
]
```

## Backend Checklist

Fix these in order:

1. [ ] **Check backend logs** for the exact error message
2. [ ] **Verify candidate exists** in database with id `4a6526cf-19bc-4d4d-ba1c-320968336267`
3. [ ] **Ensure applications query** returns `[]` not `null` if empty
4. [ ] **Ensure events query** returns `[]` not `null` if empty
5. [ ] **Add all required fields** (id, first_name, last_name, full_name, email, etc.)
6. [ ] **Format dates as ISO 8601** with timezone (e.g., `2023-10-15T14:30:00Z`)
7. [ ] **Test the endpoint** in Postman/Insomnia before deploying

## Quick Test

Try this in your backend console/rails console:

```ruby
# Ruby/Rails example
candidate = Candidate.find("4a6526cf-19bc-4d4d-ba1c-320968336267")

# Check if these queries work without error:
candidate.applications
candidate.events
candidate.as_json
```

## Error Response (When Candidate Not Found)

```json
{
  "error": "Candidate not found",
  "message": "No candidate exists with id: 4a6526cf-19bc-4d4d-ba1c-320968336267"
}
```

Return this with **404 Not Found**, not 500.

---

**Once this is fixed, the candidate detail page will load correctly!**
