# How to View Logs on Render

## Deployment/Build Logs (Render Dashboard)

### Via Web Dashboard:
1. Go to https://dashboard.render.com
2. Click on your static site (mb-frontend or meribas-frontend)
3. Click on the **"Logs"** tab in the top menu
4. You'll see real-time build and deployment logs

### What You'll See:
```
=== Building application ===
npm install
npm run build
Building...
✓ Build complete
=== Deploying to CDN ===
Upload complete
Deployment successful
```

### Recent Deployments:
- Click **"Events"** tab to see deployment history
- Each deployment shows:
  - When it was deployed
  - Which commit triggered it
  - Success/failure status
  - Build time

## Application Logs (Browser Console)

Since this is a **static Angular app**, runtime logs are in the **browser console**, not on Render's server.

### How to View:
1. Open your site: `https://v1.meribas.app`
2. Press **F12** (Windows) or **Cmd+Option+I** (Mac)
3. Click **"Console"** tab
4. You'll see all the console.log messages from your Angular app

### What You'll See (Assessment Page):
```javascript
🔄 Loading assessment questions...
👤 Current user: {email: "...", id: "...", ...}
🌐 Using locale: en

// If successful:
✅ Questions loaded successfully: {questions: [...]}

// If error:
❌ Failed to load questions: HttpErrorResponse
Error status: 401
Error message: Unauthorized
```

## Network Logs (API Calls)

To see all API requests:
1. Open browser DevTools (F12)
2. Click **"Network"** tab
3. Navigate to the page
4. You'll see all HTTP requests:
   - Request URL
   - Status code (200, 401, 404, etc.)
   - Response data
   - Request headers

### Example - Check Assessment API Call:
1. Go to Network tab
2. Visit `/onboarding/assessment`
3. Look for request to `recruiter_questions`
4. Click on it to see:
   - **Headers**: Check if Authorization header is present
   - **Response**: See what the API returned
   - **Preview**: Formatted response data

## Render CLI Alternative - Direct API Access

Since there's no easy Render CLI, you can use the Render API:

### Get Deployment Status:
```bash
# You'll need your Render API key (get from dashboard → Account Settings → API Keys)
RENDER_API_KEY="your_key_here"
SERVICE_ID="your_service_id_here"

curl -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/services/$SERVICE_ID/deploys" | jq
```

### Get Latest Deploy Logs:
```bash
DEPLOY_ID="latest_deploy_id"

curl -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/services/$SERVICE_ID/deploys/$DEPLOY_ID/logs"
```

## Quick Checks

### Is Latest Code Deployed?
```bash
# Check build hash in deployed site
curl -s https://v1.meribas.app/index.html | grep -o "main-[A-Z0-9]*\.js"

# Compare with local build
ls dist/mb-frontend/browser/main-*.js
```

If the hashes match, you're running the latest code! ✅

### Check Current Deployment Status:
Go to: https://dashboard.render.com
- Green badge = deployed successfully
- Orange/yellow badge = deploying now
- Red badge = deployment failed

## Log Locations Summary

| Log Type | Where to Find |
|----------|---------------|
| Build logs | Render Dashboard → Logs tab |
| Deployment history | Render Dashboard → Events tab |
| Runtime errors | Browser Console (F12) |
| API calls | Browser Network tab (F12) |
| Backend API logs | Backend service logs (separate service) |

## Common Scenarios

### "I want to see why deployment failed"
→ Render Dashboard → Events tab → Click on failed deployment

### "I want to see what error the user is getting"
→ Browser Console (F12) → Look for red errors

### "I want to see API request/response"
→ Browser Network tab (F12) → Click on API call

### "I want to see build output"
→ Render Dashboard → Logs tab → Shows npm install & build output

### "I want real-time logs while developing"
→ Run locally: `npm start` and check terminal + browser console
