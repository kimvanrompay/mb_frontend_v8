# Comprehensive Error Notification System

This document describes the comprehensive error notification system implemented for authentication in the Meribas application.

## Overview

The application now features a robust error handling system that provides clear, user-friendly notifications for all authentication scenarios. The system uses **toast notifications** that appear in the top-right corner of the screen.

## Components

### 1. NotificationService
Located at: `src/app/services/notification.ts`

Manages all toast notifications with four types:
- **Success** (Green) - Successful operations
- **Error** (Red) - Critical errors
- **Warning** (Yellow) - Validation issues and non-critical errors
- **Info** (Blue) - Informational messages

### 2. NotificationToastComponent
Located at: `src/app/components/notification-toast/`

Displays toast notifications with:
- Color-coded backgrounds and borders
- Icons for each notification type
- Dismissible alerts
- Slide-in animations
- Auto-dismiss after configurable duration

### 3. Enhanced AuthService
Located at: `src/app/services/auth.ts`

Contains comprehensive error handling method `handleAuthError()` that categorizes and provides user-friendly messages for all error scenarios.

## Error Scenarios Covered

### Network Errors (Status 0)
**Scenario**: No internet connection, network timeout, server unreachable

**User Message**: 
- Title: "Connection Error"
- Message: "Unable to connect to the server. Please check your internet connection and try again."

**Notification Type**: Error (Red)

---

### 400 - Bad Request
**Scenario**: Invalid request format or parameters

**User Message**: 
- Title: "Invalid Request"
- Message: Server error message OR "The information you provided is invalid. Please check and try again."

**Notification Type**: Warning (Yellow)

---

### 401 - Unauthorized
**Scenario**: Invalid credentials (login) or authentication failure (register)

**User Message (Login)**: 
- Title: "Login Failed"
- Message: "Invalid email or password. Please try again."

**User Message (Register)**: 
- Title: "Authentication Failed"
- Message: "Unable to authenticate. Please try again."

**Notification Type**: Warning (Yellow)

---

### 403 - Forbidden
**Scenario**: User doesn't have permission

**User Message**: 
- Title: "Access Denied"
- Message: "You do not have permission to access this resource."

**Notification Type**: Warning (Yellow)

---

### 404 - Not Found
**Scenario**: Authentication endpoint not found

**User Message**: 
- Title: "Not Found"
- Message: "The authentication service could not be found. Please contact support."

**Notification Type**: Error (Red)

---

### 409 - Conflict
**Scenario**: Email already registered

**User Message**: 
- Title: "Account Already Exists"
- Message: Server error message OR "An account with this email already exists. Please login instead."

**Notification Type**: Warning (Yellow)

---

### 422 - Unprocessable Entity
**Scenario**: Validation errors from server

**User Message**: 
- Title: "Validation Error"
- Message: Extracted validation errors from server response

**Notification Type**: Warning (Yellow)

**Special Handling**: The system intelligently extracts and formats validation errors from the API response.

---

### 429 - Too Many Requests
**Scenario**: Rate limiting - too many login attempts

**User Message**: 
- Title: "Too Many Attempts"
- Message: "Too many login attempts. Please wait a few minutes before trying again."

**Notification Type**: Error (Red)

---

### 500 - Internal Server Error
**Scenario**: Server-side error

**User Message**: 
- Title: "Server Error"
- Message: "An internal server error occurred. Please try again later or contact support."

**Notification Type**: Error (Red)

---

### 502/503 - Bad Gateway / Service Unavailable
**Scenario**: Server temporarily down or under maintenance

**User Message**: 
- Title: "Service Unavailable"
- Message: "The server is temporarily unavailable. Please try again in a few moments."

**Notification Type**: Error (Red)

---

### 504 - Gateway Timeout
**Scenario**: Request timeout

**User Message**: 
- Title: "Request Timeout"
- Message: "The request took too long to complete. Please check your connection and try again."

**Notification Type**: Warning (Yellow)

---

### Client-Side Validation Errors
**Scenario**: Form validation failures before submission

**Examples**:
- Empty required fields
- Invalid email format
- Password too short
- Passwords don't match

**User Messages**:
1. **General validation error**:
   - Title: "Form Validation Error"
   - Message: "Please fill in all required fields correctly."

2. **Password mismatch** (Register):
   - Title: "Password Mismatch"
   - Message: "The passwords you entered do not match. Please make sure both password fields are identical."

**Notification Type**: Error (Red)

**Special Feature**: All form fields are marked as touched to show inline validation messages.

---

### Success Messages

**Login Success**:
- Title: "Login Successful"
- Message: "You have successfully logged in. Redirecting to dashboard..."
- Duration: 5 seconds
- Notification Type: Success (Green)

**Registration Success**:
- Title: "Registration Successful"
- Message: "Your account has been created successfully! Welcome to Meribas. Redirecting to dashboard..."
- Duration: 5 seconds (with 1-second delay before redirect)
- Notification Type: Success (Green)

---

### Unknown/Unexpected Errors
**Scenario**: Any error not covered by specific handlers

**User Message**: 
- Title: "Unexpected Error"
- Message: Error message if available OR "An unexpected error occurred. Please try again."

**Notification Type**: Error (Red)

## User Experience Features

### 1. Toast Notifications
- Appear in top-right corner
- Automatically dismiss after set duration
- Can be manually dismissed by clicking X
- Slide-in animation for smooth appearance
- Color-coded for quick recognition
- Stack multiple notifications vertically

### 2. Form Validation
- Real-time validation as user types
- Visual feedback (red borders on invalid fields)
- Inline error messages below each field
- Form-level validation before submission
- All fields marked as touched when submission fails

### 3. Loading States
- Button shows "Signing in..." or "Creating account..." during API calls
- Button disabled during loading
- Prevents duplicate submissions

### 4. Smart Error Recovery
- Errors don't clear user's form data
- User can correct and resubmit immediately
- Previous notifications cleared on new submission

### 5. Developer-Friendly
- Console logging of errors for debugging
- Clear error categorization (network, server, validation, auth, unknown)
- Error codes included for troubleshooting
- Structured error objects for easy handling

## API Integration

The system expects the backend API (`https://api.meribas.app/api/v1`) to return errors in the following format:

```json
{
  "message": "User-friendly error message",
  "errors": {
    "email": ["Email is already taken"],
    "password": ["Password is too weak"]
  }
}
```

The system will:
1. Use the `message` field if available
2. Extract and format errors from the `errors` object
3. Fall back to default messages if neither is available

## Testing Error Scenarios

To test different error scenarios:

1. **Network Error**: Disconnect internet and try to login
2. **Invalid Credentials**: Use wrong email/password
3. **Validation Error**: Try submitting empty form
4. **Password Mismatch**: Enter different passwords in register form
5. **Server Error**: Configure backend to return 500 status

## Customization

### Changing Notification Duration
In the component, modify the duration parameter:
```typescript
this.notificationService.success(message, title, 3000); // 3 seconds
```

### Changing Colors
Edit `src/app/components/notification-toast/notification-toast.ts` in the `getColors()` method.

### Adding New Error Types
Add new cases in `AuthService.handleAuthError()` method.

## Browser Compatibility

The notification system works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Future Enhancements

Potential improvements:
- Sound notifications for errors
- Persistent error log
- Error recovery suggestions
- Retry mechanism for network errors
- Offline mode detection
- Session expiry handling
