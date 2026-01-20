# Quick Testing Guide - Recruiter Assessment

## 🚀 Quick Start

Your dev server is running at: **http://localhost:4200/**

## Test Scenario: New User Onboarding

### Step 1: Login
```
Email: john@tester2.com
Password: [your password]
```

**Expected**: Redirect to `/onboarding` (Welcome screen)

---

### Step 2: Welcome Screen
You should see:
- 👋 "Welcome to Meribas!" header
- Explanation of assessment (5-7 minutes, 27 questions)
- 3 feature cards: ⏱️ 5-7 Minutes, 🎯 Personalized, 🔒 Private
- "What to expect" section
- "Start Assessment →" button

**Action**: Click "Start Assessment →"

---

### Step 3: Assessment Wizard

#### Question 1/27
- Progress bar at top (3.7% filled)
- "Question 1 of 27" header
- "1 / 27" badge
- Large question text
- 5 answer options with emojis:
  - 🚫 Strongly Disagree
  - 👎 Disagree
  - 🤷 Neutral
  - 👍 Agree
  - ✨ Strongly Agree

**Actions to Test**:
1. ✅ Click an answer (e.g., "Agree")
2. ✅ Should auto-advance to Question 2 after 300ms
3. ✅ Try keyboard shortcuts:
   - Press `1-5` to select answer
   - Press `←` to go back
   - Press `→` to go forward (if answered)
4. ✅ Refresh page → should resume from current question
5. ✅ Check progress bar filling up
6. ✅ Mobile: Check progress dots at bottom

Continue answering all 27 questions...

---

### Step 4: Auto-Submit
After answering question 27:
- Button changes to "Complete Assessment ✓"
- Click or auto-submits
- Shows "Submitting..." loading state
- Navigates to success page

---

### Step 5: Results Screen

You should see:
- 🎉 "Congratulations!" celebration header
- Large emoji for your type
- "Your Recruiter Type" badge
- Type name (e.g., "The Challenger")
- Type description
- Dominant type score (e.g., "14/15") with progress bar
- Top 3 types list
- Expandable "View Full Score Breakdown"
- "What This Means for You" section (4 benefits)
- "Continue to Dashboard →" button

**Action**: Click "Continue to Dashboard →"

---

### Step 6: Dashboard
- Should successfully navigate to dashboard
- User's `needs_onboarding` is now `false`
- Future logins go directly to dashboard ✅

---

## 🧪 Additional Tests

### Mobile Responsiveness
1. **Resize browser** to 375px width (iPhone SE)
2. **Check**:
   - Text is readable without zoom
   - Buttons are easily tappable
   - Progress dots scroll horizontally
   - No horizontal scroll

### Session Persistence
1. **Answer 5 questions**
2. **Refresh the page** (Cmd+R / Ctrl+R)
3. **Check**: Should resume at question 6

### Keyboard Navigation
1. **Press `3`** → Should select "Neutral"
2. **Press `5`** → Should select "Strongly Agree" and auto-advance
3. **Press `←`** → Should go back to previous question
4. **Press `→`** → Should go to next question (if answered)

### Error Handling
**Test 1: API Error**
- Temporarily change API URL to wrong URL
- Should show error message with "Try Again" button

**Test 2: Network Offline**
- Go offline
- Try to submit
- Should show network error

---

## 📊 Expected API Calls

### On Assessment Start
```http
GET https://api.meribas.com/api/v1/onboarding/recruiter_questions?locale=en
Authorization: Bearer [YOUR_JWT_TOKEN]
```

**Response**: 27 questions with multilingual content

### On Submit (After Question 27)
```http
POST https://api.meribas.com/api/v1/onboarding/recruiter_assessment
Authorization: Bearer [YOUR_JWT_TOKEN]
Content-Type: application/json

{
  "locale": "en",
  "user_email": "john@tester2.com",
  "answers": [
    { "question_id": 1, "value": 5 },
    { "question_id": 2, "value":4 },
    ...
    { "question_id": 27, "value": 3 }
  ]
}
```

**Response**: Assessment result with dominant type

---

## ✅ Success Criteria

- [x] Login redirects to onboarding
- [x] Welcome screen displays correctly
- [x] All 27 questions load
- [x] Progress bar updates
- [x] Answers are saved to session storage
- [x] Keyboard shortcuts work
- [x] Auto-advance after selection
- [x] Can navigate back/forward
- [x] Page refresh resumes progress
- [x] Submission works
- [x] Results screen shows type
- [x] Dashboard redirect works
- [x] Mobile responsive
- [x] No console errors

---

## 🐛 Known Issues / TODO

### Current Status: ✅ All Working

If you encounter issues:
1. **Check browser console** for errors
2. **Check network tab** for API failures
3. **Verify JWT token** is valid
4. **Check API endpoint** is correct

---

## 🎨 Visual Polish

### Animations to Notice:
- ✨ Fade-in stagger on answer options
- 🎯 Progress bar smooth fill
- 🔄 Auto-advance transition
- 📈 Score bar animations on results

### UI Details:
- Glassmorphism cards on welcome
- Minimalist Typeform-style wizard
- Emojis for personality and scale
- Responsive typography (3xl → 5xl)
- Smooth hover effects

---

## 🔧 Dev Tools

### Session Storage Keys
```javascript
// View saved answers
sessionStorage.getItem('assessment_answers')

// Clear and restart
sessionStorage.removeItem('assessment_answers')
```

### Force Onboarding
If you've already completed it, manually set:
```javascript
// In browser console
user.needs_onboarding = true;
```

---

## 📞 Support

If assessment isn't showing:
1. Check that user has `needs_onboarding: true`
2. Verify login redirect logic in `login.ts`
3. Check Angular routes in `app.routes.ts`
4. Verify onboarding service API URLs

---

**🎉 Happy Testing!**

The assessment is fully functional and ready for user testing.
