# Error Notification Quick Reference

## 🎯 Error Types & Colors

| Type | Color | Use Case |
|------|-------|----------|
| ✅ Success | Green | Login/Register successful |
| ❌ Error | Red | Critical errors, network issues, server errors |
| ⚠️ Warning | Yellow | Validation errors, invalid credentials, conflicts |
| ℹ️ Info | Blue | General information messages |

## 📋 Common Error Scenarios

### Login Errors

| Error | Title | Message | Type |
|-------|-------|---------|------|
| No internet | Connection Error | Unable to connect to the server... | Error |
| Wrong password | Login Failed | Invalid email or password... | Warning |
| Too many attempts | Too Many Attempts | Too many login attempts... | Error |
| Empty form | Form Validation Error | Please fill in all required fields... | Error |
| Server down | Service Unavailable | The server is temporarily unavailable... | Error |

### Register Errors

| Error | Title | Message | Type |
|-------|-------|---------|------|
| Email exists | Account Already Exists | An account with this email already exists... | Warning |
| Password mismatch | Password Mismatch | The passwords you entered do not match... | Error |
| Weak password | Validation Error | Password must be at least 6 characters | Warning |
| Empty fields | Form Validation Error | Please fill in all required fields... | Error |
| Network issue | Connection Error | Unable to connect to the server... | Error |

### HTTP Status Code Mapping

| Status Code | Error Type | Notification Color |
|-------------|------------|-------------------|
| 0 | Network | Red (Error) |
| 400 | Validation | Yellow (Warning) |
| 401 | Auth | Yellow (Warning) |
| 403 | Auth | Yellow (Warning) |
| 404 | Server | Red (Error) |
| 409 | Validation | Yellow (Warning) |
| 422 | Validation | Yellow (Warning) |
| 429 | Server | Red (Error) |
| 500 | Server | Red (Error) |
| 502/503 | Server | Red (Error) |
| 504 | Network | Yellow (Warning) |

## 🎨 Toast Notification Features

- **Position**: Top-right corner
- **Duration**: 5-7 seconds (auto-dismiss)
- **Animation**: Slide-in from right
- **Dismissible**: Manual close button (X)
- **Stacking**: Multiple notifications stack vertically
- **Icons**: ✓, ✕, ⚠, ℹ

## 💡 Key Features

1. **Smart Error Extraction**: Automatically parses API error responses
2. **Form Validation**: Marks all fields as touched to show errors
3. **Loading States**: Disabled buttons during API calls
4. **Success Feedback**: Confirmation before redirecting
5. **Developer Logging**: Console errors for debugging
6. **Clear Old Notifications**: Auto-clears on new submission

## 🔧 For Developers

### Show a notification:
```typescript
this.notificationService.success('Message', 'Title', 5000);
this.notificationService.error('Message', 'Title', 7000);
this.notificationService.warning('Message', 'Title', 6000);
this.notificationService.info('Message', 'Title', 5000);
```

### Handle auth errors:
```typescript
const authError = this.authService.handleAuthError(error, 'login');
this.notificationService.error(authError.message, authError.title);
```

### Clear all notifications:
```typescript
this.notificationService.clear();
```

## 📱 User Experience

### Before Submission
- Form fields validate on blur
- Real-time error messages below fields
- Submit button disabled if form invalid

### During Submission
- Button shows loading state ("Signing in...")
- Button disabled to prevent double-submit
- Previous notifications cleared

### After Error
- Toast notification appears (top-right)
- Form data preserved
- User can correct and retry
- Error logged to console

### After Success
- Green success toast appears
- Brief delay shows success message
- Auto-redirect to dashboard
- JWT token saved to localStorage
