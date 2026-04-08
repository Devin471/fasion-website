# 🔒 Google OAuth Redirect URI Mismatch - Complete Fix Guide

## 🔴 Problem
**Error: "Error 400: redirect_uri_mismatch"** when clicking "Continue with Google"

This happens because your Google OAuth configuration is set for localhost but your app is now deployed on Vercel.

---

## ✅ Complete Solution

### **STEP 1: Find Your Deployment URLs**

**Frontend (Vercel):**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Look at the Domains section
4. Your URL looks like: `https://your-project-name.vercel.app`
5. Note this down ✍️

**Backend (Render):**
1. Go to https://dashboard.render.com
2. Select your backend service
3. Copy the URL (looks like: `https://your-backend-xyz.onrender.com`)
4. Note this down ✍️

---

### **STEP 2: Update Google Cloud Console**

**2A. Go to Google Cloud Console**
1. Visit: https://console.cloud.google.com
2. Make sure you're in the correct project (select project dropdown at top)
3. Go to: **APIs & Services** → **Credentials**

**2B. Find Your OAuth 2.0 Client**
1. Look under "OAuth 2.0 Client IDs"
2. Look for type: **Web application**
3. Click on it to edit

**2C. Add Authorized JavaScript Origins**
1. In the "Authorized JavaScript origins" section
2. Click **+ Add URI**
3. Enter: `https://your-vercel-url.vercel.app` (from Step 1)
4. Click **Add**

**Example:**
```
https://fashion-store.vercel.app
```

**2D. Add Authorized Redirect URIs** (Optional but recommended)
1. In the "Authorized redirect URIs" section
2. Click **+ Add URI**  
3. Enter: `https://your-vercel-url.vercel.app`
4. Click **Add**

**2E. Save Changes**
1. Click **SAVE** button at bottom
2. Wait for confirmation

---

### **STEP 3: Enable Required APIs**

Make sure these APIs are enabled in Google Cloud:
1. Go to **APIs & Services** → **Library**
2. Search for: **Google+ API**
3. Click on it and make sure it says "API is enabled" (blue checkmark)
4. If not enabled, click **Enable**

Repeat for:
- **OAuth 2.0 Scopes API** (if available)

---

### **STEP 4: Update Frontend Environment Variables**

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Add/Update:
   - **Name:** `REACT_APP_GOOGLE_CLIENT_ID`
   - **Value:** `YOUR_GOOGLE_CLIENT_ID` (from Google Cloud)
   - Click **Add**

4. Add/Update:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend-xyz.onrender.com`
   - Click **Add**

5. **Important:** Trigger a redeploy on Vercel:
   - Go to Deployments
   - Click the three dots on latest deployment
   - Select **Redeploy**

**Option B: Using .env File in Code**

Create `.env.local` in frontend root:
```env
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
REACT_APP_API_URL=https://your-backend-xyz.onrender.com
```

Then commit and push to trigger Vercel redeploy.

---

### **STEP 5: Update Backend Environment Variables**

**On Render Dashboard:**
1. Go to https://dashboard.render.com
2. Select your backend service
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   - **Key:** `CLIENT_URL`
   - **Value:** `https://your-vercel-url.vercel.app`
   - Click **Save**
5. Service will automatically redeploy

Or add to your `.env` file if deploying locally:
```env
CLIENT_URL=https://your-vercel-url.vercel.app
NODE_ENV=production
PORT=5000
```

---

### **STEP 6: Clear Browser Cache & Try Again**

1. Open your Vercel URL in a **new private/incognito window**
2. Clear browser cookies/cache (or use private window)
3. Try clicking "Continue with Google" again

---

## 🧪 Testing Checklist

- [ ] ✅ Updated Google Cloud Console with Vercel URL
- [ ] ✅ Authorized JavaScript origins added
- [ ] ✅ REACT_APP_GOOGLE_CLIENT_ID in Vercel env vars
- [ ] ✅ REACT_APP_API_URL pointing to Render backend
- [ ] ✅ Vercel deployment redeployed after env changes
- [ ] ✅ Backend CORS allows Vercel URL
- [ ] ✅ Tested in private/incognito window
- [ ] ✅ Google+ API enabled in Google Cloud
- [ ] ✅ No console errors in browser DevTools

---

## 🐛 If Still Getting Error

**1. Check Browser Console:**
- Open DevTools (F12)
- Check **Console** tab for error messages
- Screenshot the error and share it

**2. Verify Your Client ID:**
```javascript
// In browser console:
console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID)
```
Should show your actual Client ID (not undefined)

**3. Check Request to Google:**
- Open **Network** tab in DevTools
- Click "Continue with Google"
- Look for request to `accounts.google.com`
- Check the response for actual error details

**4. Common Issues:**
- ❌ Client ID is undefined → Check Vercel env vars
- ❌ Wrong URL format → Must start with `https://`
- ❌ Cache issues → Clear browser cache and cookies
- ❌ Old redirect_uri → Make sure you removed old localhost URIs from Google Console

---

## 📝 Quick Reference

Replace these in all commands/configs:
- `your-vercel-url.vercel.app` → Your actual Vercel URL
- `your-backend-xyz.onrender.com` → Your actual Render URL
- `YOUR_GOOGLE_CLIENT_ID` → From Google Cloud Console

---

## 🔐 Google Cloud Console Path

```
Google Cloud Console
  ↓
APIs & Services
  ↓
Credentials
  ↓
OAuth 2.0 Client ID (Web application)
  ↓
Edit → Add URLs → Save
```

---

## 📞 Need Help?

If you still get the error after these steps:
1. Share your actual Vercel URL and Render URL
2. Share exact error message from browser console
3. Verify the Client ID matches between Vercel and Google Cloud

✨ **Your Google OAuth should now work on Vercel!** ✨
