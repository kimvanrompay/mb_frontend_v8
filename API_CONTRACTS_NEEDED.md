# API Contracts Needed for Dashboard

This document outlines all the API endpoints still needed to fully power the dashboard with real data.

## Current API Status

### ✅ Already Integrated
- `/api/tenant` - Provides tenant stats and subscription info
  - Returns: `total_jobs`, `total_candidates`, `total_users`, `total_employees`
  - Currently used for: `activePositions` (from `total_jobs`)
  
- `/api/assessments/stats` - Provides assessment statistics
  - Returns: `completion_rate`, `average_completion_time`, `total_sent`, `completed`, `pending`, `expired`
  - Currently used for: `completionRate`, `avgDuration` (converted from seconds to minutes)

- `/api/jobs` - Provides list of all jobs
  - Fully integrated in Jobs page

---

## ⚠️ API Contracts Still Needed

### 1. **Candidates Statistics**
**Endpoint Suggestion:** `GET /api/candidates/stats`

**Purpose:** Display total candidates and candidates currently in assessment

**Expected Response:**
```json
{
  "total_candidates": 248,
  "in_assessment": 34,
  "active": 120,
  "inactive": 94,
  "by_status": {
    "pending": 15,
    "in_progress": 34,
    "completed": 199
  }
}
```

**Currently Showing:** N/A for `totalCandidates` and `inAssessment`

---

### 2. **Assessment Reviews**
**Endpoint Suggestion:** `GET /api/assessments/reviews/pending`

**Purpose:** Show how many assessments need manual review

**Expected Response:**
```json
{
  "pending_review_count": 5,
  "urgent_count": 2,
  "pending_items": [...]
}
```

**Currently Showing:** N/A for `reviewsPending`

---

### 3. **Proctoring & Integrity Metrics**
**Endpoint Suggestion:** `GET /api/proctoring/stats`

**Purpose:** Display average integrity score and security alerts

**Expected Response:**
```json
{
  "avg_integrity_score": 94,
  "total_flagged": 2,
  "incidents_today": 1,
  "by_severity": {
    "high": 1,
    "medium": 3,
    "low": 8
  }
}
```

**Currently Showing:** 
- N/A for `avgIntegrity` 
- "N/A candidates flagged for suspicious activity" in Security Alert card

---

### 4. **Real-Time Assessment Activity**
**Endpoint Suggestion:** `GET /api/assessments/activity/today`

**Purpose:** Show today's test activity (started, completed, live now)

**Expected Response:**
```json
{
  "tests_started_today": 156,
  "tests_completed_today": 142,
  "live_now": 3,
  "avg_duration_minutes": 42
}
```

**Currently Showing:** N/A for `testsStarted`, `testsCompleted`, `liveNow`

**Notes:** 
- `avgDuration` could also come from the existing `/api/assessments/stats` endpoint's `average_completion_time` field (already partially integrated)

---

### 5. **Recent Candidates**
**Endpoint Suggestion:** `GET /api/candidates/recent?limit=3`

**Purpose:** Display the 3 most recent candidates with their scores and status

**Expected Response:**
```json
{
  "candidates": [
    {
      "id": 123,
      "name": "Alice Freeman",
      "role": "Senior Python Engineer",
      "score": 92,
      "status": "Active",
      "applied_at": "2026-02-03T10:30:00Z"
    },
    {
      "id": 124,
      "name": "Bob Smith",
      "role": "Product Manager",
      "score": 88,
      "status": "Review",
      "applied_at": "2026-02-03T09:15:00Z"
    },
    {
      "id": 125,
      "name": "Charlie Davis",
      "role": "UX Designer",
      "score": 95,
      "status": "Verified",
      "applied_at": "2026-02-02T16:45:00Z"
    }
  ]
}
```

**Currently Showing:** Single entry with "N/A" values

---

### 6. **Application Sources Analytics**
**Endpoint Suggestion:** `GET /api/analytics/sources` or `GET /api/applications/sources`

**Purpose:** Show breakdown of where applications are coming from

**Expected Response:**
```json
{
  "sources": {
    "linkedin": {
      "count": 112,
      "percentage": 45
    },
    "direct": {
      "count": 75,
      "percentage": 30
    },
    "referral": {
      "count": 61,
      "percentage": 25
    }
  },
  "total": 248
}
```

**Currently Showing:** N/A percentages with 0% progress bars

---

## Implementation Priority

Based on dashboard visibility and user value, suggested implementation order:

1. **High Priority** (Main KPIs at top of dashboard)
   - Candidates Statistics (`/candidates/stats`)
   - Assessment Activity Today (`/assessments/activity/today`)
   - Assessment Reviews (`/assessments/reviews/pending`)

2. **Medium Priority** (Important metrics)
   - Proctoring & Integrity (`/proctoring/stats`)
   - Recent Candidates (`/candidates/recent`)

3. **Lower Priority** (Nice-to-have analytics)
   - Application Sources (`/analytics/sources`)

---

## Data Mapping Reference

Once APIs are implemented, update `/src/app/pages/dashboard/dashboard.ts`:

```typescript
// In loadDashboardData() method, add:

if (this.candidateStats) {
  this.stats.totalCandidates = this.candidateStats.total_candidates;
  this.stats.inAssessment = this.candidateStats.in_assessment;
}

if (this.assessmentReviews) {
  this.stats.reviewsPending = this.assessmentReviews.pending_review_count;
}

if (this.proctoringStats) {
  this.stats.avgIntegrity = this.proctoringStats.avg_integrity_score;
}

if (this.todayActivity) {
  this.stats.testsStarted = this.todayActivity.tests_started_today;
  this.stats.testsCompleted = this.todayActivity.tests_completed_today;
  this.stats.liveNow = this.todayActivity.live_now;
}

if (this.recentCandidatesResponse) {
  this.recentCandidates = this.recentCandidatesResponse.candidates;
}

if (this.applicationSources) {
  this.applicationSources = this.applicationSources.sources;
}
```

---

**Last Updated:** 2026-02-03
**Status:** All N/A placeholders added to dashboard ✅
