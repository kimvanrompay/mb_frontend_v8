# URGENT: Fix 404 Error on Render - Step by Step

## Problem
The `/verify-email` route returns 404 because **Render doesn't automatically handle Angular's client-side routing**.

## Solution: Configure Rewrite Rule in Render Dashboard

### **Step 1: Log into Render Dashboard**
1. Go to https://dashboard.render.com
2. Log in with your account
3. Find your static site (should be named something like "meribas-frontend" or "mb-frontend-v8")

### **Step 2: Add Rewrite Rule**
1. Click on your static site to open it
2. On the left sidebar, click **"Redirects/Rewrites"**
3. Click **"Add Rule"** button
4. Configure the rule exactly as follows:

   ```
   Type: Rewrite
   Source: /*
   Destination: /index.html
   Action: Rewrite
   ```

   **Important**: 
   - Source must be: `/*` (with the slash and asterisk)
   - Destination must be: `/index.html` (with the leading slash)
   - Select "Rewrite" NOT "Redirect"

5. Click **"Save Changes"**

### **Step 3: Wait for Deployment**
- Render will automatically redeploy your site (takes 1-2 minutes)
- You'll see a deployment in progress
- Wait for it to complete

### **Step 4: Test**
Once deployment completes, test these URLs:

1. **Direct route test**:
   ```
   https://v1.meribas.app/verify-email
   ```
   Should show the "Check Your Email" screen (not 404)

2. **With token test**:
   ```
   https://v1.meribas.app/verify-email?token=YOUR_TOKEN
   ```
   Should verify the email

## Why This is Needed

Angular is a Single Page Application (SPA):
- The server only has ONE HTML file: `index.html`
- Angular's router handles all the routes (`/verify-email`, `/login`, `/dashboard`, etc.) in the browser
- When you navigate within the app, Angular changes the URL without reloading the page
- But when you directly visit a URL or refresh, the server needs to know to serve `index.html` for ALL routes
- Without the rewrite rule, Render tries to find `/verify-email/index.html` which doesn't exist → 404

## Alternative: If You Can't Access Dashboard

If you don't have dashboard access or it's not working, you can also:

### Option A: Check if render.yaml is being used
1. In Render dashboard, go to your service
2. Check if it says "Using Blueprint" or "render.yaml"
3. If yes, the rule should already be there (from the `render.yaml` we created)
4. If not, you need to enable Blueprint mode

### Option B: Use Hash-based Routing (NOT RECOMMENDED)
This would change all your URLs to use `#`:
- From: `v1.meribas.app/verify-email`
- To: `v1.meribas.app/#/verify-email`

This works without server configuration but looks unprofessional.

## Visual Guide

Here's what the Redirects/Rewrites page should look like:

```
┌─────────────────────────────────────────────────────┐
│ Redirects/Rewrites                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Add Rule]                                         │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ Priority: 0                                   │ │
│  │ Type: Rewrite                                 │ │
│  │ Source: /*                                    │ │
│  │ Destination: /index.html                      │ │
│  │                                    [Delete]   │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│                              [Save Changes]         │
└─────────────────────────────────────────────────────┘
```

## Troubleshooting

### "I added the rule but still getting 404"
- Wait 2-3 minutes for deployment to complete
- Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check that the rule type is "Rewrite" not "Redirect"

### "I don't see Redirects/Rewrites option"
- Make sure you're on a **Static Site** service (not Web Service)
- If it's a Web Service, you'll need to create a new Static Site service instead

### "The deployment is taking too long"
- Check the "Events" tab in Render dashboard
- Look for any error messages
- Deployment usually takes 2-5 minutes max

## Once Fixed

After you add the rewrite rule and deployment completes:
✅ All Angular routes will work
✅ Direct URL access will work
✅ Page refresh will work
✅ Email verification links will work

The 404 error will be completely gone!
