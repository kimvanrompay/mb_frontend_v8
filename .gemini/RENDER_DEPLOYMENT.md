# Render Deployment Guide

## What Was Fixed

The email verification `/verify-email` route was returning 404 because:
1. **Render wasn't configured for SPA routing** - Angular is a Single Page Application that handles routing client-side
2. Without proper configuration, Render tries to find `/verify-email/index.html` on the server (doesn't exist) instead of serving the Angular app

## Files Added

### 1. `render.yaml` (Render Configuration)
```yaml
services:
  - type: web
    name: meribas-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist/mb-frontend/browser
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

This tells Render:
- It's a static site
- Build command to run
- Where the built files are
- **All routes should serve `index.html`** (let Angular router handle it)

### 2. `public/_redirects` (Fallback Method)
```
/*    /index.html   200
```

This is a simpler fallback that also tells Render to serve `index.html` for all routes with a 200 status code (not 404).

## Next Steps

### Check Render Dashboard

1. Go to your Render dashboard at https://dashboard.render.com
2. Find your frontend service (meribas-frontend or similar)
3. You should see a new deployment triggered by the recent commits
4. Wait for the deployment to complete (usually 2-5 minutes)

### Verify the Fix

Once deployed, the email verification link should work:
```
https://v1.meribas.app/verify-email?token=xxx
```

Instead of 404, you should see:
- The verify-email component loading
- "Verifying Your Email" spinner
- Then success or error message

## How It Works Now

### Before (404 Error):
```
User clicks email link
  ↓
Browser requests: v1.meribas.app/verify-email
  ↓
Render server looks for: /verify-email/index.html
  ↓
File doesn't exist → 404 Error
```

### After (Works!):
```
User clicks email link
  ↓
Browser requests: v1.meribas.app/verify-email
  ↓
Render sees rewrite rule: /* → /index.html
  ↓
Render serves: index.html (Angular app)
  ↓
Angular app loads
  ↓
Angular router sees /verify-email in URL
  ↓
Angular loads VerifyEmailComponent ✅
```

## Troubleshooting

### Still Getting 404?

**Option 1: Check Render Configuration**
- Open Render dashboard
- Go to your service settings
- Under "Redirects/Rewrites", ensure the `render.yaml` is being used
- Or manually add the rewrite rule:
  - Source: `/*`
  - Destination: `/index.html`
  - Action: `Rewrite`

**Option 2: Check Build Output**
Run locally to verify `_redirects` is in the build:
```bash
npm run build
ls -la dist/mb-frontend/browser/_redirects
```

The file should exist in the build output.

**Option 3: Force Rebuild**
In Render dashboard:
1. Go to your service
2. Click "Manual Deploy" → "Clear build cache & deploy"

### Deployment Not Triggering?

Check if Render is connected to your GitHub repo:
1. Render Dashboard → Service Settings
2. Should show: `kimvanrompay/mb_frontend_v8` (main branch)
3. Auto-Deploy should be enabled

### Still Need Help?

Check if your Render service is configured as:
- **Type**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist/mb-frontend/browser`
- **Auto-Deploy**: Yes (for main branch)

## Manual Deploy (If Needed)

If auto-deploy isn't working, you can manually deploy:

1. **Via Render Dashboard**:
   - Click "Manual Deploy" → "Deploy latest commit"

2. **Via Render CLI** (if installed):
   ```bash
   render deploy
   ```

## Testing After Deployment

1. **Test the route directly**:
   ```
   https://v1.meribas.app/verify-email
   ```
   Should show the "Check Your Email" screen (not 404)

2. **Test with a token** (get from a real verification email):
   ```
   https://v1.meribas.app/verify-email?token=YOUR_TOKEN
   ```
   Should show verification spinner, then success/error

3. **Test full flow**:
   - Register a new account
   - Check email for verification link
   - Click link
   - Should redirect to onboarding after success

## Current Status

✅ Email verification component implemented  
✅ Backend API working  
✅ Routes configured in Angular  
✅ Render configuration files added  
✅ Code committed and pushed to GitHub  
⏳ **Waiting for Render to redeploy** (check dashboard)

Once Render finishes deploying, the `/verify-email` route will work! 🚀
