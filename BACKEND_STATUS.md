# Backend Requirements Summary

## Current Issues

### 🔴 URGENT: Candidate Detail 500 Error
**File:** `URGENT_CANDIDATE_FIX.md`

The candidate detail endpoint is returning 500 errors. Most likely causes:
- `applications` or `events` arrays are `null` instead of `[]`
- Missing required fields in the response
- Database query errors on related data

**Quick Fix:** Ensure these return empty arrays when there's no data:
```json
{
  "candidate": {
    "applications": [],  // NEVER null
    "events": []        // NEVER null
  }
}
```

---

## API Specifications

### 1. Candidate Detail Endpoint ✅
**File:** `BACKEND_API_SPEC.md`

```
GET /api/v1/candidates/:id
```

Complete specification with all required fields, types, and examples.

### 2. Trial Period & Subscription ✅ IMPLEMENTED
**File:** `TRIAL_PERIOD_API_SPEC.md`

**Your backend already returns this correctly!**

```
GET /api/v1/tenant
GET /api/v1/auth/me
```

Current trial settings:
- Duration: 3 days
- Limits: 1 seat, 1 job, 1 invitation

### 3. Quick Reference
**File:** `TRIAL_LIMITS_QUICK_REF.md`

One-page summary of trial configuration and limits.

---

## What's Working ✅

- [x] Trial period API (`/api/v1/tenant`)
- [x] User authentication (`/api/v1/auth/me`)
- [x] 3-day trial setup on registration
- [x] Trial countdown calculation
- [x] Subscription data with plan limits

## What Needs Fixing 🔴

- [ ] **Candidate detail endpoint** - Fix 500 error
  - Ensure `applications` array exists (even if empty)
  - Ensure `events` array exists (even if empty)
  - Include all required fields

## Next Steps

1. **Fix candidate endpoint** (see `URGENT_CANDIDATE_FIX.md`)
   - Check backend logs for exact error
   - Ensure arrays are never null
   - Test with candidate ID: `4a6526cf-19bc-4d4d-ba1c-320968336267`

2. **Implement trial limits enforcement** (optional, can do later)
   - Block creating 2nd job during trial (403 error)
   - Block sending 2nd invitation during trial (403 error)
   - Block adding 2nd user during trial (403 error)

3. **Test the endpoints**
   - Candidate detail: `GET /api/v1/candidates/:id`
   - Tenant data: `GET /api/v1/tenant`
   - User data: `GET /api/v1/auth/me`

---

## Frontend Updates Made

- [x] Updated tenant model to include trial tier and new fields
- [x] Updated tenant service to use `/api/v1/tenant` endpoint
- [x] Prepared sidebar component for dynamic trial countdown
- [x] Candidate detail page ready (waiting for backend fix)

---

## Quick Test Commands

```bash
# Test candidate endpoint
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://api.meribas.app/api/v1/candidates/4a6526cf-19bc-4d4d-ba1c-320968336267

# Test tenant endpoint
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://api.meribas.app/api/v1/tenant

# Expected: Both should return 200 OK with JSON data
```

---

## Priority Order

1. 🔴 **HIGH**: Fix candidate detail 500 error
2. 🟡 **MEDIUM**: Test all endpoints thoroughly
3. 🟢 **LOW**: Implement trial limit enforcement (can be done gradually)

Share `URGENT_CANDIDATE_FIX.md` with your backend team to resolve the candidate issue!
