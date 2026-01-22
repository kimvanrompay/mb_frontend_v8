# Assessment Loading Issue - Diagnostic Guide

## What Was Changed

I've added detailed error handling and console logging to the assessment component to help diagnose why it keeps loading.

## What to Check Now

### 1. Open Browser Console
Once Render deploys the new code (~2-5 minutes), try accessing the assessment page again:
1. Open browser console (F12 or Cmd+Option+I on Mac)
2. Go to `/onboarding/assessment`
3. Look for these console messages:

```
🔄 Loading assessment questions...
👤 Current user: {email: "...", ...}
🌐 Using locale: en
```

### 2. Check for Errors

**If you see:**
```
❌ No user found - redirecting to login
```
**Problem**: User is not logged in
**Solution**: You'll be redirected to login automatically

**If you see:**
```
❌ Failed to load questions: {...}
Error status: 401
```
**Problem**: Token expired or invalid
**Solution**: The app will show "Your session has expired" and redirect to login

**If you see:**
```
❌ Failed to load questions: {...}
Error status: 404
```
**Problem**: Backend endpoint doesn't exist or not deployed
**Solution**: Check if backend has `/api/v1/onboarding/recruiter_questions` endpoint

**If you see:**
```
❌ Failed to load questions: {...}
Error status: 0
```
**Problem**: Network error (CORS, connection failed, etc.)
**Solution**: Check backend CORS configuration

### 3. Verify Backend Endpoint

Test if the backend endpoint works:

```bash
# Get a valid token first (replace with real token from localStorage)
TOKEN="your_token_here"

# Test the endpoint
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.meribas.app/api/v1/onboarding/recruiter_questions?locale=en"
```

**Expected Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "category": "...",
      "content": {
        "en": "Question text...",
        "nl": "Dutch text..."
      }
    },
    ...
  ]
}
```

## Most Likely Causes

### 1. User Session Expired (Most Common)
**Symptom**: Infinite loading
**Why**: After email verification, user gets new token, but frontend might not have stored it properly
**Fix**: 
- Check localStorage for `auth_token`
- Try logging out and logging back in
- Check if verify-email component properly stores the token from backend

### 2. Backend Endpoint Not Deployed
**Symptom**: 404 error in console
**Why**: Backend doesn't have the recruiter questions endpoint
**Fix**: Deploy backend with the endpoint

### 3. CORS Issue
**Symptom**: Status 0 error
**Why**: Backend not allowing requests from frontend domain
**Fix**: Add v1.meribas.app to CORS allowed origins in backend

### 4. Token Not Being Sent
**Symptom**: 401 error despite being logged in
**Why**: Auth interceptor not working or token not in localStorage
**Fix**: 
- Check if token is in localStorage: `localStorage.getItem('auth_token')`
- Verify auth interceptor is configured in app.config.ts
- Check Network tab to see if Authorization header is present

## Quick Fixes to Try

### Fix 1: Clear Storage and Re-Login
```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
location.href = '/login';
```

### Fix 2: Check Token
```javascript
// In browser console:
const token = localStorage.getItem('auth_token');
console.log('Token:', token);
console.log('Token length:', token?.length);

// Decode JWT to see if it's valid
if (token) {
  const parts = token.split('.');
  const payload = JSON.parse(atob(parts[1]));
  console.log('Token payload:', payload);
  console.log('Token exp:', new Date(payload.exp * 1000));
  console.log('Is expired?', Date.now() > payload.exp * 1000);
}
```

### Fix 3: Manual API Test
```javascript
// In browser console (when logged in):
const token = localStorage.getItem('auth_token');
fetch('https://api.meribas.app/api/v1/onboarding/recruiter_questions?locale=en', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));
```

## What the Fix Does

### Before (Silent Failure):
```typescript
error: (err: any) => {
  this.error = 'Failed to load questions. Please try again.';
  this.isLoading = false;
}
```
- Generic error message
- No console logging
- Hard to debug

### After (Detailed Feedback):
```typescript
error: (err: any) => {
  console.error('❌ Failed to load questions:', err);
  console.error('Error status:', err.status);
  console.error('Error message:', err.message);
  
  // Specific error messages based on status
  if (err.status === 401) {
    this.error = 'Your session has expired. Please log in again.';
    setTimeout(() => this.router.navigate(['/login']), 2000);
  } else if (err.status === 404) {
    this.error = 'Assessment questions not found. Please contact support.';
  } else if (err.status === 0) {
    this.error = 'Cannot connect to server. Please check your internet connection.';
  } else {
    this.error = `Failed to load questions: ${err.error?.message || err.message || 'Unknown error'}`;
  }
  
  this.isLoading = false;
}
```
- Detailed console logs
- Specific error messages
- Auto-redirect on auth failure
- Easy to diagnose the issue

## After Deployment

Once Render deploys (check dashboard), you should:
1. ✅ See specific error message (not just loading)
2. ✅ See console logs explaining what failed
3. ✅ Be auto-redirected to login if session expired

The infinite loading should be gone - you'll either see the assessment OR a clear error message!
