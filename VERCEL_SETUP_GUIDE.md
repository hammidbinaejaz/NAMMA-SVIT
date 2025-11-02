# 🚀 Vercel Deployment Setup Guide

## ❌ Error You're Seeing:
```
Environment Variable "DATABASE_URL" references Secret "database_url", which does not exist.
```

## ✅ Solution: Set DATABASE_URL in Vercel

### Step 1: Get Your DATABASE_URL

Your `DATABASE_URL` should be your **Neon PostgreSQL connection string** (or any PostgreSQL database).

**Format:**
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

### Step 2: Add DATABASE_URL in Vercel Dashboard

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Select your project (`namma-svit-erp`)

2. **Navigate to Settings:**
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in the left sidebar

3. **Add DATABASE_URL:**
   - Click **"Add New"** button
   - **Key:** `DATABASE_URL`
   - **Value:** Your full PostgreSQL connection string
   - **Environment:** Select **Production, Preview, and Development** (or just Production)
   - Click **"Save"**

### Step 3: Update vercel.json (Optional)

The `vercel.json` file might be trying to reference a secret that doesn't exist. You have two options:

#### Option A: Remove the secret reference (Recommended)
Update your `vercel.json` to not reference secrets:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

#### Option B: Create the Secret in Vercel
1. Go to **Settings** → **Environment Variables**
2. Click **"Create Secret"** or use the **"Add New"** button
3. Name: `database_url`
4. Value: Your DATABASE_URL
5. Reference it in `vercel.json` if needed

### Step 4: Add Other Required Environment Variables

Make sure you also add:

1. **AUTH_SECRET**
   - Key: `AUTH_SECRET`
   - Value: `x2irdjZljbax+jh4qbzaNgxxAv5szMBqaAXyR+6Nmec=` (your current secret)
   - Environments: All

2. **NODE_ENV** (Optional, usually auto-set)
   - Key: `NODE_ENV`
   - Value: `production`
   - Environments: Production only

### Step 5: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. OR push a new commit to trigger automatic deployment

---

## 🔍 Quick Checklist

- [ ] DATABASE_URL added in Vercel Environment Variables
- [ ] AUTH_SECRET added in Vercel Environment Variables  
- [ ] Updated vercel.json (removed secret reference if needed)
- [ ] Redeployed the application

---

## 📝 Environment Variables Summary

**Required in Vercel:**
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
AUTH_SECRET=x2irdjZljbax+jh4qbzaNgxxAv5szMBqaAXyR+6Nmec=
NODE_ENV=production
```

---

## 🐛 Troubleshooting

### If DATABASE_URL still doesn't work:
1. **Check the format** - Must be valid PostgreSQL connection string
2. **Check SSL mode** - Neon requires `?sslmode=require` at the end
3. **Verify database is accessible** - Test connection string locally
4. **Check Vercel logs** - Look for connection errors during build/deploy

### If build fails:
- Check Vercel build logs for Prisma errors
- Ensure `npx prisma generate` runs in build (already in package.json scripts)
- Verify DATABASE_URL is accessible from Vercel's network

---

## 🎯 Next Steps After Setup

1. **Run Prisma Migrations:**
   ```bash
   # In Vercel build logs or via Vercel CLI
   npx prisma migrate deploy
   ```

2. **Verify Deployment:**
   - Visit your Vercel URL
   - Test login functionality
   - Check database connections

3. **Monitor Logs:**
   - Check Vercel Function Logs for any runtime errors
   - Monitor database connection status

---

**Need Help?** Check Vercel docs: https://vercel.com/docs/concepts/projects/environment-variables


