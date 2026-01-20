# Enneagram Onboarding Implementation Plan

## ✅ Completed

### 1. Models & Interfaces (`src/app/models/enneagram.model.ts`)
- ✅ Full TypeScript interfaces for all data structures
- ✅ Complete Enneagram type definitions with descriptions, motivations, traits
- ✅ 9 personality types with emojis and colors

### 2. Onboarding Service (`src/app/services/onboarding.service.ts`)
- ✅ API integration for `/onboarding/status` and `/onboarding/complete`
- ✅ Client-side validation logic
- ✅ Helper methods for rank management

## 🚧 Next Steps

### 3. Create Welcome Component
**File**: `src/app/pages/onboarding/welcome/welcome.component.ts`
- Welcome screen with explanation
- "Start Assessment" button
- Clean, engaging design

### 4. Create Assessment Component  
**File**: `src/app/pages/onboarding/assessment/assessment.component.ts`
**Features**:
- Interactive card-based ranking interface
- Drag-and-drop OR click-to-select ranking
- Real-time validation feedback
- Progress indicator (X/9 ranked)
- Type detail modal/expandable cards

### 5. Create Success Component
**File**: `src/app/pages/onboarding/success/success.component.ts`
- Display 9-letter profile code
- Show top 3 types
- Celebration UI
- "Continue to Dashboard" button

### 6. Create Route Guard
**File**: `src/app/guards/onboarding-required.guard.ts`
- Check `user.needs_onboarding`
- Redirect to `/onboarding` if needed
- Apply to protected routes (dashboard, etc.)

### 7. Update Routing
**File**: `src/app/app.routes.ts`
```typescript
{
  path: 'onboarding',
  children: [
    { path: '', component: WelcomeComponent },
    { path: 'assessment', component: AssessmentComponent },
    { path: 'success', component: SuccessComponent }
  ]
},
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [OnboardingRequiredGuard]
}
```

### 8. Update AuthService
- Add `needs_onboarding` to User interface
- Check onboarding status after login/register

## UI Design Specifications

### Recommended: Interactive Card Grid
```
Step-by-step ranking:
1. "Select your #1 type" - shows all 9 cards
2. User clicks a card - it gets assigned rank #1
3. "Select your #2 type" - shows remaining 8 cards
4. Continue until all 9 ranked
5. Review screen showing all rankings
6. Submit button activates
```

### Card Design
- Large emoji icon
- Type name
- Short 1-line description
- "Learn More" expands full details
- Visual indicator when ranked
- Smooth animations

### Color Scheme
- Use dark green gradient background (already created)
- White glassmorphism cards
- Black text for readability
- Colorful type-specific accents

## API Integration

### Backend URL
```
https://mb-backend-v8-8194836b1a8a.herokuapp.com/api/v1
```

### Endpoints
1. `GET /onboarding/status` - Check if needed
2. `POST /onboarding/complete` - Submit assessment
3. `GET /auth/me` - Get user with onboarding status

### Request Format
```json
{
  "priority_order": {
    "1": 5,  // Reformer is priority #5
    "2": 2,  // Helper is priority #2
    "3": 1,  // Achiever is priority #1
    "4": 9,
    "5": 8,
    "6": 3,
    "7": 7,
    "8": 6,
    "9": 4
  }
}
```

### Response
```json
{
  "message": "Enneagram assessment completed successfully!",
  "user": {
    "id": 123,
    "onboarding_completed": true,
    "enneagram_priority_order": {...},
    "enneagram_priority_code": "AHLPRCEI"
  }
}
```

## Implementation Priority

**Phase 1: Core Flow** ⚡
1. Welcome component
2. Basic assessment component (click to select)
3. Success component
4. Routing

**Phase 2: Enhanced UX** 🎨
1. Drag-and-drop ranking
2. Type detail modals
3. Smooth animations
4. Progress tracking

**Phase 3: Polish** ✨
1. Mobile optimization
2. Accessibility features
3. Error handling UI
4. Loading states

## File Structure
```
src/app/
├── models/
│   └── enneagram.model.ts ✅
├── services/
│   └── onboarding.service.ts ✅
├── guards/
│   └── onboarding-required.guard.ts ⏳
├── pages/
│   └── onboarding/
│       ├── welcome/
│       │   ├── welcome.component.ts ⏳
│       │   ├── welcome.component.html ⏳
│       │   └── welcome.component.css ⏳
│       ├── assessment/
│       │   ├── assessment.component.ts ⏳
│       │   ├── assessment.component.html ⏳
│       │   └── assessment.component.css ⏳
│       └── success/
│           ├── success.component.ts ⏳
│           ├── success.component.html ⏳
│           └── success.component.css ⏳
```

## Testing Checklist

- [ ] Can complete assessment from start to finish
- [ ] Cannot select duplicate ranks
- [ ] Cannot submit until all 9 types ranked
- [ ] API errors display helpful messages
- [ ] Success screen shows correct profile code
- [ ] Redirects work correctly
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Screen reader friendly

## Next Action

Ready to build the components! Should I:
1. Create all three components (welcome, assessment, success)?
2. Focus on the core assessment component first?
3. Set up routing and guards first?

Let me know your preference and I'll continue building! 🚀
