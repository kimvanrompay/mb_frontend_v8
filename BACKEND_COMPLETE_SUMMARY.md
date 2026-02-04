# Backend Issues & Requirements - Complete Summary

**Date:** 2026-02-04  
**Priority:** 🔴 HIGH - Production blocking issue

---

## 🔴 CRITICAL: Candidate Detail Endpoint Failure

### Current Status
- **Endpoint:** `GET /api/v1/candidates/fa6526cf-19bc-4d4d-ba1c-32096333267`
- **Error:** 500 Internal Server Error
- **Impact:** Candidate detail page is completely broken
- **User Experience:** Infinite loading screen

### Required Action
Backend team must investigate server logs and fix the 500 error.

### Most Common Causes & Solutions

#### 1. Arrays returning `null` instead of `[]`
```ruby
# ❌ WRONG - causes 500 error
def applications
  object.applications  # Returns nil if no associations
end

# ✅ CORRECT
def applications
  object.applications.to_a  # Always returns array
end
```

#### 2. Missing required database fields
```sql
-- Check if all required columns exist
SELECT 
  id, first_name, last_name, email, 
  status, source, preferred_language,
  created_at, updated_at
FROM candidates 
WHERE id = 'fa6526cf-19bc-4d4d-ba1c-32096333267';
```

#### 3. Failed JOIN queries
```ruby
# Make sure these queries don't fail
candidate.applications  # Should return [] not raise error
candidate.candidate_events  # Should return [] not raise error
```

#### 4. Serializer errors
```ruby
# Check your serializer/presenter/view
class CandidateDetailSerializer
  attributes :id, :first_name, :last_name, :full_name, :email,
             :phone, :status, :source, :preferred_language,
             :cv_url, :applications_count, :latest_application_id,
             :created_at, :updated_at, :notes,
             :expectation_match, :values_match, :potential_match, :skills_match
  
  has_many :applications, serializer: ApplicationSummarySerializer
  has_many :events, serializer: CandidateEventSerializer
  
  # Ensure arrays are never nil
  def applications
    object.applications.to_a
  end
  
  def events
    object.candidate_events.to_a
  end
end
```

---

## ✅ WORKING: Trial Period & Subscription

Good news! These endpoints are working correctly:

### GET /api/v1/tenant
```json
{
  "tenant": {
    "subscription": {
      "status": "trialing",
      "trial_ends_at": "2024-02-07T23:59:59Z",
      "trial_days_remaining": 3,
      "on_trial": true,
      "has_access": true,
      "plan": {
        "tier": "trial",
        "max_seats": 1,
        "max_jobs": 1,
        "max_invitations": 1
      }
    }
  }
}
```

### GET /api/v1/auth/me
```json
{
  "user": {
    "trial_ends_at": "2024-02-07T23:59:59Z"
  }
}
```

**Status:** ✅ Working as expected

---

## 📋 Complete Candidate Detail API Spec

### Endpoint
```
GET /api/v1/candidates/:id
Authorization: Bearer <JWT>
```

### Required Response (200 OK)
```json
{
  "candidate": {
    "id": "uuid-string",
    "first_name": "string",
    "last_name": "string",
    "full_name": "string",
    "email": "string",
    "phone": "string | null",
    "status": "new | in_process | hired | rejected",
    "source": "manual | invited | applied",
    "preferred_language": "en | nl | fr | de | es",
    "cv_url": "string | null",
    "applications_count": 0,
    "latest_application_id": "string | null",
    "created_at": "ISO 8601 datetime",
    "updated_at": "ISO 8601 datetime",
    "notes": "string | null",
    "expectation_match": "number 0-100 | null",
    "values_match": "number 0-100 | null",
    "potential_match": "number 0-100 | null",
    "skills_match": "number 0-100 | null",
    
    "applications": [],
    "events": [],
    
    "invitation_status": "pending | accepted | expired | null",
    "invited_by": { "id": "string", "name": "string" } | null,
    "invited_for_job": { "id": "string", "title": "string" } | null,
    "invitation_sent_at": "ISO 8601 | null",
    "invitation_accepted_at": "ISO 8601 | null",
    "invitation_expired": "boolean | null"
  }
}
```

### CRITICAL Rules
1. ✅ `applications` MUST be an array `[]`, NEVER `null`
2. ✅ `events` MUST be an array `[]`, NEVER `null`
3. ✅ All dates MUST be ISO 8601 format with timezone
4. ✅ Return 404 (not 500) if candidate doesn't exist

### Minimal Valid Example
```json
{
  "candidate": {
    "id": "fa6526cf-19bc-4d4d-ba1c-32096333267",
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
    "applications": [],
    "events": []
  }
}
```

---

## 🔧 Debugging Steps

### 1. Check Backend Logs
```bash
# Rails
tail -f log/production.log | grep -A 50 "candidates/fa6526cf"

# Node.js
# Check your console/pm2 logs

# General
journalctl -u your-api-service -f
```

### 2. Test in Backend Console
```ruby
# Rails
candidate = Candidate.find("fa6526cf-19bc-4d4d-ba1c-32096333267")
puts candidate.inspect
puts candidate.applications.inspect
puts candidate.events.inspect
puts candidate.to_json
```

### 3. Check Database
```sql
-- Does candidate exist?
SELECT * FROM candidates 
WHERE id = 'fa6526cf-19bc-4d4d-ba1c-32096333267';

-- Can we join applications?
SELECT c.*, a.* 
FROM candidates c
LEFT JOIN applications a ON a.candidate_id = c.id
WHERE c.id = 'fa6526cf-19bc-4d4d-ba1c-32096333267';

-- Can we join events?
SELECT c.*, e.* 
FROM candidates c
LEFT JOIN candidate_events e ON e.candidate_id = c.id  
WHERE c.id = 'fa6526cf-19bc-4d4d-ba1c-32096333267';
```

### 4. Test API Directly
```bash
# Get JWT token from browser localStorage['auth_token']
curl -v -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://api.meribas.app/api/v1/candidates/fa6526cf-19bc-4d4d-ba1c-32096333267
```

---

## 📁 Documentation Files Created

All in project root:

1. **HOW_TO_FIX.md** - Step-by-step fix guide
2. **URGENT_CANDIDATE_FIX.md** - Detailed candidate API spec
3. **BACKEND_STATUS.md** - Overall backend status
4. **TRIAL_PERIOD_API_SPEC.md** - Trial configuration (working!)
5. **TRIAL_LIMITS_QUICK_REF.md** - Quick reference
6. **THIS FILE** - Complete summary

---

## ✅ Frontend Updates Completed

- [x] Updated tenant models (trial tier, new fields)
- [x] Updated tenant service endpoint
- [x] Improved error handling (shows specific error messages)
- [x] All trial period integration ready
- [x] Candidate detail page waiting for backend fix

---

## 🎯 Action Items

### Backend Team (URGENT)
1. [ ] Check server logs for exact error on `/api/v1/candidates/:id`
2. [ ] Fix serializer to ensure `applications` and `events` are arrays
3. [ ] Test endpoint returns 200 OK with valid JSON
4. [ ] Deploy fix to production
5. [ ] Notify when resolved

### Frontend Team (Kim)
1. [x] Error handling improved ✅
2. [x] Documentation created ✅
3. [ ] Test after backend fix deployed

---

## 🧪 Expected After Fix

**Before (current):**
```
GET /api/v1/candidates/fa6526cf-19bc-4d4d-ba1c-32096333267
→ 500 Internal Server Error
```

**After (expected):**
```
GET /api/v1/candidates/fa6526cf-19bc-4d4d-ba1c-32096333267
→ 200 OK
→ { "candidate": { ... } }
```

User should see candidate details page load successfully! 🎉

---

## 📞 Need Help?

If the backend team needs clarification:
- All specs are in the documentation files above
- Frontend code is ready and waiting
- Just need the backend to return valid JSON with arrays (not null)

**The fix is likely a one-line change in your serializer!**
