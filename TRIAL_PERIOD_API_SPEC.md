# Backend API Specification - Trial Period & Subscription Data

This document describes the data structure needed by the frontend to display the trial period countdown in the sidebar and throughout the application.

## Trial Period Configuration

**Trial Duration:** 3 days
**Trial Limits:**
- 1 seat (user)
- 1 position (job posting)
- 1 candidate invitation

## Overview

The frontend displays trial information in **two places**:
1. **Sidebar** - Trial countdown box (currently hardcoded "3 days left")
2. **Trial Banner** - Top banner component that shows trial expiration warnings

## Data Sources

The trial period data comes from **TWO different API endpoints**:

### 1. User Endpoint (Simple Trial Data)
### 2. Tenant Endpoint (Full Subscription Data)

---

## 1. User Endpoint - `/api/v1/auth/me`

### Response Structure

```json
{
  "user": {
    "id": "user-uuid-123",
    "email": "recruiter@example.com",
    "email_verified": true,
    "email_verified_at": "2023-10-15T14:30:00Z",
    "first_name": "Jane",
    "last_name": "Smith",
    "full_name": "Jane Smith",
    "role": "owner",
    "active": true,
    "onboarding_completed": true,
    "needs_onboarding": false,
    "enneagram_priority_order": null,
    "enneagram_priority_code": null,
    
    "trial_ends_at": "2024-01-15T23:59:59Z",
    
    "tenant": {
      "id": "tenant-uuid-456",
      "name": "Acme Corp",
      "subdomain": "acme",
      "company_onboarding_completed": true,
      "needs_company_onboarding": false,
      "company_culture_type": "CC"
    }
  }
}
```

### Key Field: `trial_ends_at`

**Type:** `string | undefined` (ISO 8601 datetime)

**Purpose:** Used by the Trial Banner component to calculate days remaining

**Calculation Logic (Frontend):**
```typescript
if (user?.trial_ends_at) {
    const trialEnd = new Date(user.trial_ends_at);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
```

**Examples:**
- During trial: `"2024-02-15T23:59:59Z"` (trial expires on Feb 15, 2024 at midnight)
- After subscription: `undefined` or omit field entirely
- Trial expired: Past date like `"2024-01-01T23:59:59Z"`

---

## 2. Tenant Endpoint - `/api/v1/tenant` (or `/api/v1/tenants/:id`)

This endpoint provides comprehensive subscription information for the sidebar and billing page.

### Response Structure

```json
{
  "tenant": {
    "id": 1,
    "name": "Acme Corp",
    "subdomain": "acme",
    "logo": "https://storage.meribas.app/logos/acme.png",
    "logo_or_avatar": "https://storage.meribas.app/logos/acme.png",
    
    "subscription": {
      "id": 42,
      "status": "trialing",
      "trial_ends_at": "2024-02-15T23:59:59Z",
      "trial_days_remaining": 3,
      "on_trial": true,
      
      "plan": {
        "id": 0,
        "name": "Trial",
        "tier": "trial",
        "max_seats": 1,
        "max_jobs": 1,
        "max_invitations": 1,
        "max_responses": null
      }
    },
    
    "stats": {
      "total_users": 3,
      "total_jobs": 5,
      "total_candidates": 47,
      "total_employees": 3
    }
  }
}
```

### Subscription Object Fields

#### `status`
**Type:** `"trialing" | "active" | "canceled" | "past_due"`

**Examples:**
- `"trialing"` - User is in trial period
- `"active"` - Paid subscription is active
- `"canceled"` - Subscription was canceled
- `"past_due"` - Payment failed

#### `trial_ends_at`
**Type:** `string | null` (ISO 8601 datetime)

**Examples:**
- During trial: `"2024-02-15T23:59:59Z"`
- No trial / subscription active: `null`

#### `trial_days_remaining`
**Type:** `number | null`

**Purpose:** Backend-calculated days remaining (recommended approach)

**Examples:**
- 3 days left: `3`
- 1 day left: `1`
- Trial expired: `0` or `-2` (2 days overdue)
- No trial: `null`

**Calculation (Backend should handle this):**
```python
# Python example
from datetime import datetime, timezone

if trial_ends_at and status == 'trialing':
    now = datetime.now(timezone.utc)
    trial_end = datetime.fromisoformat(trial_ends_at)
    delta = trial_end - now
    trial_days_remaining = max(0, delta.days)
else:
    trial_days_remaining = None
```

#### `on_trial`
**Type:** `boolean`

**Purpose:** Quick flag to check if account is currently on trial

**Logic:**
- `true` if `status === "trialing"` AND `trial_ends_at` is in the future
- `false` otherwise

### Plan Object Fields

#### `tier`
**Type:** `"trial" | "starter" | "professional" | "enterprise"`

**Purpose:** Determines feature access and limits

**Trial Tier Limits:**
- `max_seats`: `1` - Only 1 user allowed during trial
- `max_jobs`: `1` - Only 1 position can be created
- `max_invitations`: `1` - Only 1 candidate can be invited

#### `max_seats`
**Type:** `number | null`

**Examples:**
- Trial: `1`
- Starter: `5`
- Professional: `25`
- Enterprise: `null` (unlimited)

#### `max_jobs`
**Type:** `number | null`

**Purpose:** Maximum number of positions/jobs that can be created

**Examples:**
- Trial: `1`
- Starter: `5`
- Professional: `50`
- Enterprise: `null` (unlimited)

#### `max_invitations`
**Type:** `number | null`

**Purpose:** Maximum number of candidate invitations that can be sent

**Examples:**
- Trial: `1`
- Starter: `10`
- Professional: `100`
- Enterprise: `null` (unlimited)

#### `max_responses`
**Type:** `number | null`

**Purpose:** Maximum assessment responses per month

**Examples:**
- Trial: `null` (not applicable during trial)
- Starter: `100`
- Professional: `1000`
- Enterprise: `null` (unlimited)

---

## Frontend Usage Examples

### Sidebar Component (Target Implementation)

Currently the sidebar shows hardcoded "14 days left" at line 129:

```html
<span class="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
  14 days left
</span>
```

**Should be updated to:**

```typescript
// In component TypeScript
tenant: Tenant | null = null;

ngOnInit() {
  this.tenantService.getTenant().subscribe(tenant => {
    this.tenant = tenant;
  });
}

get trialDaysRemaining(): number {
  return this.tenant?.subscription?.trial_days_remaining ?? 0;
}

get isOnTrial(): boolean {
  return this.tenant?.subscription?.on_trial ?? false;
}
```

```html
<!-- In template -->
<div *ngIf="isOnTrial" class="px-3 py-2 bg-red-50 border border-red-200 rounded-md">
  <div class="flex items-center justify-between mb-1">
    <span class="text-[10px] font-medium text-red-700 uppercase tracking-wide">Trial Period</span>
    <span class="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
      {{ trialDaysRemaining }} {{ trialDaysRemaining === 1 ? 'day' : 'days' }} left
    </span>
  </div>
  <p class="text-[11px] text-red-600 leading-tight">Upgrade to unlock all features</p>
</div>
```

### Trial Banner Component (Already Implemented)

Located at: `/src/app/components/trial-banner/trial-banner.component.ts`

**Current implementation uses:** `user.trial_ends_at` from `/api/v1/auth/me`

```typescript
if (this.user?.trial_ends_at) {
    const trialEnd = new Date(this.user.trial_ends_at);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    this.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
```

---

## Complete Example Responses

### During Trial (3 days remaining)

**GET /api/v1/auth/me:**
```json
{
  "user": {
    "id": "user-123",
    "email": "jane@acme.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "full_name": "Jane Smith",
    "role": "owner",
    "trial_ends_at": "2024-02-07T23:59:59Z",
    "tenant": {
      "id": "tenant-456",
      "name": "Acme Corp",
      "subdomain": "acme"
    }
  }
}
```

**GET /api/v1/tenant:**
```json
{
  "tenant": {
    "id": 1,
    "name": "Acme Corp",
    "subscription": {
      "id": 42,
      "status": "trialing",
      "trial_ends_at": "2024-02-07T23:59:59Z",
      "trial_days_remaining": 3,
      "on_trial": true,
      "plan": {
        "id": 0,
        "name": "Trial",
        "tier": "trial",
        "max_seats": 1,
        "max_jobs": 1,
        "max_invitations": 1,
        "max_responses": null
      }
    },
    "stats": {
      "total_users": 1,
      "total_jobs": 1,
      "total_candidates": 1,
      "total_employees": 1
    }
  }
}
```

### After Subscribing (Paid Account)

**GET /api/v1/auth/me:**
```json
{
  "user": {
    "id": "user-123",
    "email": "jane@acme.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "full_name": "Jane Smith",
    "role": "owner",
    "tenant": {
      "id": "tenant-456",
      "name": "Acme Corp",
      "subdomain": "acme"
    }
  }
}
```
Note: `trial_ends_at` field is omitted or `undefined`

**GET /api/v1/tenant:**
```json
{
  "tenant": {
    "id": 1,
    "name": "Acme Corp",
    "subscription": {
      "id": 42,
      "status": "active",
      "trial_ends_at": null,
      "trial_days_remaining": null,
      "on_trial": false,
      "plan": {
        "id": 2,
        "name": "Professional",
        "tier": "professional",
        "max_seats": 25,
        "max_responses": 1000
      }
    }
  }
}
```

### Trial Expired (No Subscription)

**GET /api/v1/tenant:**
```json
{
  "tenant": {
    "id": 1,
    "name": "Acme Corp",
    "subscription": {
      "id": 42,
      "status": "trialing",
      "trial_ends_at": "2024-01-15T23:59:59Z",
      "trial_days_remaining": 0,
      "on_trial": false,
      "plan": {
        "id": 1,
        "name": "Starter",
        "tier": "starter",
        "max_seats": 5,
        "max_responses": 100
      }
    }
  }
}
```

---

## Recommended Implementation

### Backend Should:

1. **Always calculate `trial_days_remaining`** on the backend (don't rely on frontend calculation)
2. **Set `on_trial = true`** only when:
   - `status === "trialing"` 
   - AND `trial_ends_at` is in the future
3. **Default trial period:** 3 days from registration
4. **Trial limits:** Enforce max_seats=1, max_jobs=1, max_invitations=1
5. **Store `trial_ends_at`** in UTC timezone
6. **Return ISO 8601 format** for all datetime fields

### Frontend Will:

1. **Use `tenant.subscription.trial_days_remaining`** for sidebar display
2. **Use `tenant.subscription.on_trial`** to show/hide trial UI
3. **Use `user.trial_ends_at`** for secondary validation (trial banner)
4. **Hide trial UI** when `on_trial === false`

---

## Testing Checklist

Backend should test these scenarios:

- [ ] New user registration sets `trial_ends_at` to 3 days from now
- [ ] Trial plan has max_seats=1, max_jobs=1, max_invitations=1
- [ ] Backend enforces trial limits (prevent creating 2nd job, 2nd invitation, 2nd user)
- [ ] /me endpoint returns `trial_ends_at` for trial users
- [ ] /tenant endpoint returns complete subscription object
- [ ] `trial_days_remaining` is correctly calculated (backend-side)
- [ ] `on_trial` flag is `true` during trial period
- [ ] `on_trial` flag is `false` after trial expires
- [ ] `on_trial` flag is `false` for paid subscribers
- [ ] All dates are in ISO 8601 UTC format
- [ ] Subscription object returns correct plan tier
- [ ] Stats object returns current counts

---

## Summary

**For Sidebar Trial Countdown, backend must provide:**

```json
{
  "tenant": {
    "subscription": {
      "status": "trialing",
      "trial_ends_at": "2024-02-15T23:59:59Z",
      "trial_days_remaining": 3,
      "on_trial": true
    }
  }
}
```

**The critical fields are:**
- `trial_days_remaining` → displays "3 days left" (or "1 day left", etc.)
- `on_trial` → shows/hides trial box
- `trial_ends_at` → backup for client-side calculation

---

## Trial Limits Enforcement

The backend must enforce strict limits during the trial period to prevent abuse. When a trial user attempts to exceed these limits, return appropriate error responses.

### Trial Limits Summary

| Resource | Trial Limit | Paid Plan Examples |
|----------|-------------|-------------------|
| **Users/Seats** | 1 | Starter: 5, Pro: 25, Enterprise: ∞ |
| **Jobs/Positions** | 1 | Starter: 5, Pro: 50, Enterprise: ∞ |
| **Candidate Invitations** | 1 | Starter: 10, Pro: 100, Enterprise: ∞ |

### Error Responses for Limit Exceeded

#### 1. Attempting to Create 2nd Job

**POST /api/v1/jobs**

```json
// Request body (for 2nd job)
{
  "job": {
    "title": "Senior Developer",
    "location": "Remote"
  }
}
```

**Response: 403 Forbidden**
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

#### 2. Attempting to Send 2nd Invitation

**POST /api/v1/candidates/invite**

```json
// Request body (for 2nd invitation)
{
  "job_id": "job-uuid-123",
  "email": "candidate2@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response: 403 Forbidden**
```json
{
  "error": "Trial limit reached",
  "message": "Trial accounts are limited to 1 candidate invitation. Please upgrade to invite more candidates.",
  "limit_type": "max_invitations",
  "current_count": 1,
  "max_allowed": 1,
  "upgrade_url": "/billing/upgrade"
}
```

#### 3. Attempting to Add 2nd User/Seat

**POST /api/v1/team/members** (or similar endpoint)

```json
// Request body (for 2nd team member)
{
  "email": "teammate@example.com",
  "role": "user"
}
```

**Response: 403 Forbidden**
```json
{
  "error": "Trial limit reached",
  "message": "Trial accounts are limited to 1 user. Please upgrade to add team members.",
  "limit_type": "max_seats",
  "current_count": 1,
  "max_allowed": 1,
  "upgrade_url": "/billing/upgrade"
}
```

### Frontend Handling

The frontend should:

1. **Proactively check limits** using `tenant.subscription.plan` fields
2. **Disable UI elements** when limit reached (gray out "Create Job" button, etc.)
3. **Show upgrade prompts** when user tries to exceed limits
4. **Handle 403 errors gracefully** with user-friendly messages

#### Example Frontend Logic

```typescript
// Check if user can create another job
canCreateJob(): boolean {
  if (!this.tenant?.subscription?.on_trial) {
    return true; // Paid accounts can create jobs
  }
  
  const maxJobs = this.tenant.subscription.plan.max_jobs;
  const currentJobs = this.tenant.stats.total_jobs;
  
  return maxJobs === null || currentJobs < maxJobs;
}

// Check if user can invite another candidate
canInviteCandidate(): boolean {
  if (!this.tenant?.subscription?.on_trial) {
    return true; // Paid accounts can invite candidates
  }
  
  const maxInvitations = this.tenant.subscription.plan.max_invitations;
  const currentInvitations = this.invitedCandidatesCount; // Track this separately
  
  return maxInvitations === null || currentInvitations < maxInvitations;
}

// Check if user can add team members
canAddTeamMember(): boolean {
  if (!this.tenant?.subscription?.on_trial) {
    return true; // Paid accounts can add members
  }
  
  const maxSeats = this.tenant.subscription.plan.max_seats;
  const currentUsers = this.tenant.stats.total_users;
  
  return maxSeats === null || currentUsers < maxSeats;
}
```

### Upgrade Flow

When a trial user hits a limit, the UI should:

1. Show a modal/banner explaining the limit
2. Highlight the benefits of upgrading
3. Provide a clear CTA to upgrade (e.g., "Upgrade to Professional")
4. Link to `/billing/upgrade` or similar

**Example Upgrade Modal Message:**

```
🚀 Upgrade to Create More Positions

You've reached the trial limit of 1 position. 

Upgrade to Professional to:
✓ Create up to 50 positions
✓ Invite up to 100 candidates
✓ Add up to 25 team members
✓ Access advanced analytics

[Upgrade Now] [Learn More]
```

---

## Complete Trial Flow Summary

### Day 0 (Registration)
- User creates account
- Backend sets `trial_ends_at` = now + 3 days
- Subscription status = `"trialing"`
- Plan tier = `"trial"` with limits (1/1/1)

### Day 1-2 (During Trial)
- User can create 1 job
- User can invite 1 candidate
- Backend blocks attempts to exceed limits with 403 errors
- Frontend shows trial countdown in sidebar

### Day 3 (Trial Expires)
- `trial_days_remaining` = 0
- `on_trial` = false
- User must upgrade to continue using platform
- All features locked or read-only until subscription

### After Upgrade
- `status` changes to `"active"`
- `on_trial` = false
- `trial_ends_at` = null
- Plan tier changes to selected tier (e.g., `"professional"`)
- Limits increase based on new plan
