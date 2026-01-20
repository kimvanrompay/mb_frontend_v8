# Trial Banner Feature

## Overview
Added a persistent trial banner that displays at the top of the dashboard, showing users how many days remain in their trial and prompting them to upgrade.

## Features

### 1. **Days Remaining Calculation**
- Automatically calculates days left based on `user.trial_ends_at` date
- Shows friendly messages:
  - "X days remaining in your free trial"
  - "1 day remaining" (singular)
  - "Trial expires today" (red text for urgency)

### 2. **Visual Design**
- Purple-to-pink gradient background
- Decorative gradient blobs (like Tailwind UI)
- Clean, minimal design
- Border at bottom for separation

### 3. **User Actions**
- **Upgrade Now** button → Triggers upgrade flow
- **Dismiss (X)** button → Hides banner for current session
  - Stored in `sessionStorage`
  - Returns on page refresh if trial still active
  - Permanent visibility until trial ends

### 4. **Smart Display Logic**
- Only shows when:
  - User is in trial period (`daysRemaining >= 0`)
  - Banner hasn't been dismissed in current session
- Automatically calculates from backend data

## Implementation

### Files Created:
```
src/app/components/trial-banner/
  ├── trial-banner.component.ts
  ├── trial-banner.component.html
  └── trial-banner.component.css
```

### Integration:
- ✅ Added to dashboard layout (below navbar)
- ✅ Imports TrialBannerComponent
- ✅ Uses AuthService for user data
- ✅ Added `trial_ends_at` field to User interface

### User Interface Updates:
```typescript
export interface User {
  // ... existing fields
  trial_ends_at?: string;  // ISO 8601 date string
}
```

## Usage Example

**Backend should return:**
```json
{
  "user": {
    "email": "user@example.com",
    "trial_ends_at": "2026-01-24T00:00:00Z"
  }
}
```

**Banner will display:**
- "3 days remaining in your free trial" + Upgrade Now button

## Dismissal Behavior

1. User clicks X → Banner disappears
2. `sessionStorage.setItem('trial_banner_dismissed', 'true')`
3. Banner stays hidden during current session
4. On page refresh → Banner reappears (new session)
5. On upgrade → Banner no longer shows (trial ended)

## Customization Points

### Change gradient colors:
```html
bg-gradient-to-r from-purple-50 to-pink-50
```

### Change message:
```typescript
{{ daysRemaining }} days remaining...
```

### Change upgrade action:
```typescript
upgradePlan(): void {
  this.router.navigate(['/upgrade']);  // Add routing
}
```

## Future Enhancements

- [ ] Add upgrade modal instead of navigation
- [ ] Show different messages at different thresholds
  - 7+ days: Informational
  - 3-6 days: Warning
  - 0-2 days: Urgent
- [ ] Add confetti animation on upgrade
- [ ] Track dismissal count in analytics
- [ ] Persist dismissal across sessions (localStorage)
- [ ] Add "Don't show again" option

## Testing

1. ✅ Banner visible when trial active
2. ✅ Days calculation accurate
3. ✅ Dismiss functionality works
4. ✅ Session storage prevents re-display
5. ✅ Upgrade button clickable
6. ✅ Responsive on mobile

---

**Status: Deployed ✅**
