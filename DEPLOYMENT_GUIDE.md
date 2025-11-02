# 🚀 Deployment Guide - Render

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
Ensure these are set in Render Dashboard:

**Required:**
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `AUTH_SECRET` - Random secret key (min 32 chars) for JWT
- `NODE_ENV` - Set to `production`

**Example:**
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
AUTH_SECRET=your-secret-key-minimum-32-characters-long-change-this
NODE_ENV=production
```

### 2. Build Commands (Already Configured)
```bash
# Build command (Render will run this)
npm install && npx prisma generate && npm run build

# Start command (Render will run this)
npm run start
```

### 3. Database Setup

#### Option A: Use Neon PostgreSQL (Recommended)
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add as `DATABASE_URL` in Render

#### Option B: Use Render PostgreSQL
1. Create a PostgreSQL database in Render
2. Render will auto-inject `DATABASE_URL`

### 4. Prisma Migrations

**After deployment, run migrations:**
```bash
# SSH into your Render instance or use Render Shell
npx prisma migrate deploy
```

Or add to build command:
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

### 5. Seed Database (Optional)
```bash
npm run prisma:seed
```

---

## 📋 Render Deployment Steps

### Method 1: Using render.yaml (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **In Render Dashboard:**
   - Go to https://dashboard.render.com
   - Click "New" → "Blueprint"
   - Connect your GitHub repo
   - Select `render.yaml` from the repo
   - Render will auto-detect configuration

### Method 2: Manual Setup

1. **Create Web Service:**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect GitHub repo
   - Configure:
     - **Build Command:** `npm install && npx prisma generate && npm run build`
     - **Start Command:** `npm run start`
     - **Environment:** Node
     - **Node Version:** 18.x or 20.x

2. **Add Environment Variables:**
   - `DATABASE_URL` (from Neon or Render DB)
   - `AUTH_SECRET` (generate random 32+ char string)
   - `NODE_ENV=production`

3. **Create PostgreSQL Database (if not using Neon):**
   - Click "New" → "PostgreSQL"
   - Note the connection string
   - Add as `DATABASE_URL` in Web Service

4. **Run Migrations:**
   - After first deploy, use Render Shell:
     ```bash
     npx prisma migrate deploy
     ```

---

## 🔧 Post-Deployment

### 1. Verify Database Connection
Check logs for: `✅ Connected to Neon PostgreSQL`

### 2. Test Key Features
- ✅ Login (Admin/Student/Teacher)
- ✅ Add Student (verify DB writes)
- ✅ View Dashboard
- ✅ Check `/admin/db-view` page

### 3. Monitor Logs
```bash
# In Render Dashboard → Logs
# Watch for any errors or connection issues
```

---

## 🐛 Troubleshooting

### Build Fails
- **Error:** `Prisma Client not generated`
  - **Fix:** Ensure `npx prisma generate` is in build command

- **Error:** `Cannot find module`
  - **Fix:** Check `package.json` dependencies are correct

### Database Connection Issues
- **Error:** `Can't reach database server`
  - **Fix:** Verify `DATABASE_URL` is correct
  - **Fix:** Check Neon/Render DB is running
  - **Fix:** Ensure connection string includes `?sslmode=require` for Neon

### Runtime Errors
- **Error:** `PrismaClient is unable to run in browser`
  - **Fix:** Already fixed - EventList now uses API

### Migrations Fail
- **Error:** `Migration failed`
  - **Fix:** Run `npx prisma migrate deploy` manually
  - **Fix:** Check database schema matches `prisma/schema.prisma`

---

## 📊 Performance Tips

1. **Enable Auto-Deploy:** Only on `main` branch
2. **Use Starter Plan:** Minimum for Next.js apps
3. **Monitor Usage:** Check Render dashboard for resource usage
4. **Database:** Use Neon (free tier available) or Render PostgreSQL

---

## ✅ Final Checklist

Before deploying, ensure:

- [ ] `DATABASE_URL` is set correctly
- [ ] `AUTH_SECRET` is generated (32+ chars)
- [ ] Build command includes `npx prisma generate`
- [ ] `.env` file is NOT committed (should be in `.gitignore`)
- [ ] `render.yaml` exists (for blueprint deployment)
- [ ] Database migrations are ready
- [ ] All TypeScript errors are fixed
- [ ] `npm run build` succeeds locally

---

## 🎉 Deployment URL

After successful deployment:
- Your app will be at: `https://namma-svit-erp.onrender.com`
- Or custom domain if configured

---

**Status: ✅ READY FOR RENDER DEPLOYMENT**

All code is production-ready, database connections tested, and deployment config included!

