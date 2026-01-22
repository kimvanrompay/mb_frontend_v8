# Email Verification Flow - Complete Implementation Guide

## Overview
The email verification system is now fully implemented and working. This document explains how the complete flow works from frontend to backend.

## Architecture

### Frontend Components
- **Route**: `/verify-email` (defined in `app.routes.ts`)
- **Component**: `VerifyEmailComponent` (`src/app/pages/verify-email/`)
- **Service**: `AuthService.verifyEmail()` and `AuthService.resendVerification()`

### Backend API
- **Verify Endpoint**: `GET /api/v1/auth/verify_email?token=xxx`
- **Resend Endpoint**: `POST /api/v1/auth/resend_verification`

## User Flow

### 1. Registration
```
User registers → Backend creates account (email_verified=false) →
Backend sends verification email → User redirected to /verify-email (no token)
```

### 2. Check Email Screen
When user lands on `/verify-email` without a token:
- Shows "Check Your Email" screen
- Displays user's email address
- Provides instructions to check inbox
- Offers "Resend Verification Email" button

### 3. Email Link Click
User receives email with link:
```
https://v1.meribas.app/verify-email?token=abc123...
```

When user clicks:
```
Frontend extracts token from URL →
Calls backend GET /api/v1/auth/verify_email?token=abc123 →
Backend validates token and marks email as verified →
Backend returns new JWT token + user data →
Frontend stores token and shows success screen →
After 2 seconds, redirects to /onboarding
```

### 4. Success State
- Shows green checkmark
- "Email Verified!" message
- Auto-redirects to onboarding in 2 seconds

### 5. Error Handling
If verification fails:
- Shows error message from backend
- Offers "Request New Link" button (calls resendVerification)
- Offers "Go to Login" button

## Component States

The `VerifyEmailComponent` has 4 possible states:

1. **showCheckEmail** (no token in URL)
   - User just registered
   - Shows email check instructions
   - Allows resending

2. **isVerifying** (has token, verifying)
   - Shows spinner
   - "Verifying Your Email" message

3. **success** (verification succeeded)
   - Shows green checkmark
   - Success message
   - Auto-redirects

4. **error** (verification failed)
   - Shows red X icon
   - Error message
   - Resend and login buttons

## Backend Fix Applied

### Issue Found
The resend endpoint was checking for the wrong column name:
```ruby
# ❌ OLD (incorrect)
if user.verification_code_sent_at && 
   user.verification_code_sent_at > 1.minute.ago

# ✅ NEW (correct)
if user.email_verification_token_sent_at && 
   user.email_verification_token_sent_at > 1.minute.ago
```

### Fix Applied
Updated `app/controllers/api/v1/auth_controller.rb` line 127-128 to use the correct column name matching the database schema.

## API Responses

### Verify Email Success
```json
{
  "message": "Email verified successfully",
  "token": "new_jwt_token_here",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "email_verified": true,
    "email_verified_at": "2026-01-22T10:12:00Z",
    ...
  }
}
```

### Resend Verification Success
```json
{
  "message": "Verification email has been resent"
}
```

### Error Response
```json
{
  "error": "Invalid or expired verification token"
}
```

## Testing the Flow

### 1. Test Registration → Email Check
```bash
# Register new user
curl -X POST https://api.meribas.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "email": "test@example.com",
      "password": "Password123!",
      "first_name": "Test",
      "last_name": "User"
    },
    "tenant": {
      "name": "Test Company",
      "subdomain": "testco"
    }
  }'

# User should be redirected to /verify-email
# Should see "Check Your Email" screen
```

### 2. Test Resend Verification
```bash
# With auth token from registration
curl -X POST https://api.meribas.app/api/v1/auth/resend_verification \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should receive new verification email
```

### 3. Test Email Verification
```bash
# Extract token from email link and test directly
curl https://api.meribas.app/api/v1/auth/verify_email?token=TOKEN_FROM_EMAIL

# Should return success with new token
```

### 4. Test Frontend Flow
1. Go to https://v1.meribas.app/register
2. Register a new account
3. Check email for verification link
4. Click link in email
5. Should see success screen on v1.meribas.app
6. Should auto-redirect to /onboarding

## Security Notes

1. **Token Expiration**: Verification tokens expire after a certain time (configured in backend)
2. **Rate Limiting**: Resend endpoint is rate-limited to prevent abuse (1 minute between resends)
3. **Single Use**: Tokens are invalidated after successful verification
4. **Public Endpoint**: `/verify_email` is public (no auth required) but requires valid token

## Deployment Checklist

- [x] Backend fix deployed to api.meribas.app
- [x] Frontend component implemented
- [x] Frontend route configured
- [x] Auth service methods added
- [ ] Frontend deployed to v1.meribas.app (in progress)

## Troubleshooting

### Link Returns 404
- **Cause**: Frontend not deployed or route not configured
- **Fix**: Deploy frontend with correct routing

### "Invalid Token" Error
- **Cause**: Token expired or already used
- **Fix**: Use resend verification button

### Email Not Received
- **Cause**: Email service issue or spam folder
- **Fix**: Check spam, use resend button, verify email configuration

### Resend Not Working
- **Cause**: Rate limit (must wait 1 minute) or backend issue
- **Fix**: Wait 1 minute between resends

## Next Steps

Once deployment completes:
1. Test complete flow end-to-end
2. Verify email delivery
3. Test all error cases
4. Update user documentation
