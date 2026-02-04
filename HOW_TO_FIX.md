# How to Fix the Candidate Detail 500 Error

## Problem Summary

**What you're seeing:** "Loading candidate details..." screen that never finishes

**Root cause:** Backend API is returning 500 Internal Server Error

**Affected endpoint:** `GET /api/v1/candidates/4a6526cf-19bc-4d4d-ba1c-320968336267`

---

## Solution: Backend Team Must Fix

### Most Likely Cause

The backend serializer is returning `null` for `applications` or `events` arrays instead of empty arrays `[]`.

### Quick Fix (Backend Code)

#### If using Ruby on Rails:

```ruby
# app/serializers/candidate_serializer.rb or similar

class CandidateDetailSerializer
  # ... other fields ...
  
  def applications
    object.applications.to_a  # Ensures array, never null
  end
  
  def events
    object.candidate_events.to_a  # Ensures array, never null
  end
end
```

#### If using Node.js/Express:

```javascript
// Candidate controller or serializer
const candidateDetail = {
  ...candidate,
  applications: candidate.applications || [],  // Never null
  events: candidate.events || []               // Never null
};

res.json({ candidate: candidateDetail });
```

#### If using Python/Django:

```python
# serializers.py
class CandidateDetailSerializer(serializers.ModelSerializer):
    applications = serializers.ListField(default=[])
    events = serializers.ListField(default=[])
    
    class Meta:
        model = Candidate
        fields = '__all__'
```

---

## Backend Debugging Steps

### 1. Check Server Logs

Look for the actual error message in your backend logs:

```bash
# Rails
tail -f log/development.log

# Node.js
# Check your console output

# Python/Django
tail -f /var/log/django/error.log
```

### 2. Test in Backend Console

```ruby
# Rails console
candidate = Candidate.find("4a6526cf-19bc-4d4d-ba1c-320968336267")
candidate.applications  # Does this return nil or []?
candidate.events        # Does this return nil or []?
```

```javascript
// Node.js
const candidate = await Candidate.findById('4a6526cf-19bc-4d4d-ba1c-320968336267');
console.log(candidate.applications);  // null or []?
console.log(candidate.events);        // null or []?
```

### 3. Verify Database

Check if the candidate exists in your database:

```sql
SELECT id, first_name, last_name, email 
FROM candidates 
WHERE id = '4a6526cf-19bc-4d4d-ba1c-320968336267';
```

### 4. Check Related Data

Ensure the applications and events tables exist and are joinable:

```sql
-- Check if application join works
SELECT * FROM applications 
WHERE candidate_id = '4a6526cf-19bc-4d4d-ba1c-320968336267';

-- Check if events join works
SELECT * FROM candidate_events 
WHERE candidate_id = '4a6526cf-19bc-4d4d-ba1c-320968336267';
```

---

## Required Response Format

The backend MUST return this structure:

```json
{
  "candidate": {
    "id": "4a6526cf-19bc-4d4d-ba1c-320968336267",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": null,
    "status": "new",
    "source": "manual",
    "preferred_language": "en",
    "cv_url": null,
    "applications_count": 0,
    "latest_application_id": null,
    "created_at": "2024-02-04T10:00:00Z",
    "updated_at": "2024-02-04T10:00:00Z",
    "notes": null,
    "expectation_match": null,
    "values_match": null,
    "potential_match": null,
    "skills_match": null,
    
    "applications": [],  // ← MUST be array, NEVER null
    "events": []        // ← MUST be array, NEVER null
  }
}
```

### Critical Rules

1. **Arrays must be arrays** - `[]` not `null`
2. **All dates in ISO 8601** - e.g., `"2024-02-04T10:00:00Z"`
3. **Include all required fields** - id, first_name, last_name, full_name, email, status, source, etc.
4. **Return 404 for missing** - Not 500

---

## What I Changed on Frontend

✅ Added better error handling to show:
- 404: "Candidate not found"
- 500: "Server error - backend team notified"  
- Network: "Unable to connect to server"

This gives users a better experience while the backend is being fixed.

---

## Testing After Fix

Once the backend is fixed, test with:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://api.meribas.app/api/v1/candidates/4a6526cf-19bc-4d4d-ba1c-320968336267
```

**Expected:** 200 OK with candidate JSON
**Current:** 500 Internal Server Error

---

## Next Steps

1. **Backend team:** Look at server logs and find the exact error
2. **Backend team:** Fix the serializer to return arrays (not null)
3. **Backend team:** Test the endpoint returns 200 OK
4. **You:** Refresh the page - it should work!

See **`URGENT_CANDIDATE_FIX.md`** for complete API specification.
