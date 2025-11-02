# NAMMA SVIT ERP - Deployment Guide

## 🎯 Overview

This document provides comprehensive deployment instructions for the NAMMA SVIT ERP Portal to production environments.

**Brand Identity:**
- **Title:** NAMMA SVIT | ERP Portal
- **Tagline:** Empowering Students & Faculty through Digital Innovation
- **Primary Color:** #0B3C7D (Deep Blue)
- **Accent Color:** #E5A823 (Golden Yellow)

---

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (local or cloud)
- Clerk account for authentication
- Cloudinary account (optional, for image uploads)
- Vercel account (for frontend deployment)
- Render/Railway account (for database hosting)

---

## 🔧 Environment Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Cloudinary (for file uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Next.js
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally, then:
createdb namma_svit_erp
```

#### Option B: Cloud Database (Render/Railway)
1. **Render:**
   - Go to [render.com](https://render.com)
   - Create a new PostgreSQL database
   - Copy the connection string to `DATABASE_URL`

2. **Railway:**
   - Go to [railway.app](https://railway.app)
   - Create a new PostgreSQL service
   - Copy the connection string to `DATABASE_URL`

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run prisma:seed
```

---

## 🚀 Deployment Steps

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: NAMMA SVIT ERP"
   git remote add origin https://github.com/your-username/namma-svit-erp.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables (from `.env.local`)
   - Click "Deploy"

3. **Vercel Environment Variables**
   Add these in Vercel Dashboard → Settings → Environment Variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (optional)
   - `CLOUDINARY_API_KEY` (optional)
   - `CLOUDINARY_API_SECRET` (optional)

4. **Run Migrations in Production**
   ```bash
   # In Vercel, add a build command:
   npx prisma generate && npx prisma migrate deploy
   ```

### Database Deployment (Render/Railway)

#### Using Render:

1. **Create PostgreSQL Database**
   - Go to Render Dashboard
   - Click "New" → "PostgreSQL"
   - Fill in details:
     - Name: `namma-svit-db`
     - Database: `namma_svit_erp`
     - User: `svit_admin`
     - Region: Choose closest to your users
   - Copy the Internal Database URL

2. **Update Connection String**
   - Use the connection string in your `.env.local` and Vercel environment variables

#### Using Railway:

1. **Create PostgreSQL Service**
   - Go to Railway Dashboard
   - Click "New Project"
   - Add "PostgreSQL" service
   - Copy the connection string from Variables tab

---

## 🔐 Clerk Authentication Setup

1. **Create Clerk Account**
   - Go to [clerk.com](https://clerk.com)
   - Sign up and create a new application
   - Choose "Email" or "Username" authentication

2. **Configure Username Login**
   - In Clerk Dashboard → User & Authentication
   - Enable "Username" as identifier
   - Configure user metadata for roles:
     - Go to Metadata → Public Metadata
     - Add field: `role` (type: string)

3. **Get API Keys**
   - Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from API Keys section
   - Copy `CLERK_SECRET_KEY` from API Keys section

4. **Configure Webhooks (Optional)**
   - Set webhook endpoint for user sync
   - Use: `https://your-app.vercel.app/api/webhooks/clerk`

---

## 📊 Database Schema Updates

After deploying, run these Prisma commands:

```bash
# Generate Prisma Client
npx prisma generate

# Deploy migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### New Models Added:
- `Fee` - Student fee management
- `Certificate` - Certificate generation
- `Placement` - Placement opportunities
- `PlacementApplication` - Student applications
- `Feedback` - Feedback and suggestions system

---

## 🧪 Testing Deployment

1. **Test Authentication**
   - Visit: `https://your-app.vercel.app`
   - Try logging in with a test user

2. **Test Database Connection**
   - Check if data loads on dashboard
   - Verify CRUD operations work

3. **Test New Modules**
   - Placement Cell: `/list/placements`
   - Feedback: `/list/feedback`

---

## 🔄 CI/CD Setup

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx prisma generate
      - run: npm run build
```

---

## 📝 Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Clerk authentication working
- [ ] All routes accessible
- [ ] Role-based access control tested
- [ ] File uploads working (if using Cloudinary)
- [ ] Email notifications configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Custom domain configured (optional)
- [ ] Analytics tracking setup (optional)

---

## 🛠️ Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible
   - Ensure IP whitelisting (if required)

2. **Clerk Authentication Issues**
   - Verify API keys are correct
   - Check Clerk dashboard for errors
   - Ensure metadata fields are configured

3. **Prisma Client Errors**
   - Run `npx prisma generate` again
   - Check if migrations are up to date

4. **Build Errors**
   - Check Node.js version (should be 18+)
   - Verify all environment variables are set
   - Review build logs in Vercel

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **Railway Dashboard:** https://railway.app/dashboard
- **Clerk Dashboard:** https://dashboard.clerk.com
- **Prisma Docs:** https://www.prisma.io/docs

---

## 📧 Support

For deployment issues, contact:
- **SVIT IT Department**
- **Project Repository:** [GitHub Link]

---

## 📄 License

Copyright © 2024 Sai Vidya Institute of Technology. All rights reserved.



