# Quick Reference: Trial Period & Limits

## Trial Configuration

**Duration:** 3 days
**Limits:**
- 1 seat (user)
- 1 position (job)
- 1 candidate invitation

## Backend Requirements

### 1. Tenant API Response

`GET /api/v1/tenant`

```json
{
  "tenant": {
    "subscription": {
      "status": "trialing",
      "trial_ends_at": "2024-02-07T23:59:59Z",
      "trial_days_remaining": 3,
      "on_trial": true,
      "plan": {
        "tier": "trial",
        "max_seats": 1,
        "max_jobs": 1,
        "max_invitations": 1
      }
    },
    "stats": {
      "total_users": 1,
      "total_jobs": 1,
      "total_candidates": 1
    }
  }
}
```

### 2. User API Response

`GET /api/v1/auth/me`

```json
{
  "user": {
    "trial_ends_at": "2024-02-07T23:59:59Z"
  }
}
```

### 3. Limit Enforcement

Return 403 when trial limits exceeded:

```json
{
  "error": "Trial limit reached",
  "message": "Trial accounts are limited to 1 position. Please upgrade to create more positions.",
  "limit_type": "max_jobs",
  "current_count": 1,
  "max_allowed": 1,
  "upgrade_url": "/billing/upgrade"
}
```

## Implementation Checklist

Backend:
- [ ] Set trial_ends_at = registration_time + 3 days
- [ ] Create "trial" plan tier with max_seats=1, max_jobs=1, max_invitations=1
- [ ] Enforce limits on POST /api/v1/jobs (403 if >= 1 job exists)
- [ ] Enforce limits on POST /api/v1/candidates/invite (403 if >= 1 invite sent)
- [ ] Enforce limits on POST /api/v1/team/members (403 if >= 1 user exists)
- [ ] Calculate trial_days_remaining on backend
- [ ] Set on_trial = true only during active trial period

Frontend:
- [ ] Update sidebar to show dynamic trial countdown
- [ ] Disable "Create Position" button when at limit
- [ ] Disable "Invite Candidate" button when at limit
- [ ] Show upgrade prompts when limits reached
- [ ] Handle 403 errors with user-friendly messages

## See Full Documentation

- **TRIAL_PERIOD_API_SPEC.md** - Complete API specification
- **BACKEND_API_SPEC.md** - Candidate detail endpoint specification
