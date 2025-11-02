# NAMMA SVIT ERP - Deployment Checklist

## Pre-Deployment ✅

### Environment Setup
- [x] `DATABASE_URL` configured (Neon PostgreSQL)
- [x] `AUTH_SECRET` generated (32+ characters)
- [x] `NODE_ENV=production` set

### Code Verification
- [x] `npm run build` succeeds
- [x] All TypeScript errors resolved
- [x] No console errors in browser
- [x] All API endpoints return JSON

### Functional Tests
- [x] Student creation form works
- [x] Login works for all user types
- [x] CRUD operations verified
- [x] Database connections stable

---

## Deployment Steps (Vercel)

### 1. Environment Variables
Set in Vercel Dashboard → Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://[your-neon-connection-string]
AUTH_SECRET=[your-32-character-secret]
NODE_ENV=production
```

### 2. Build Command
```bash
npm run build
```

### 3. Start Command (if using custom server)
```bash
npm run start
```

### 4. Prisma Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (production)
npx prisma migrate deploy
```

---

## Post-Deployment Verification

### Immediate Checks
- [ ] Visit homepage: `https://your-domain.vercel.app`
- [ ] Test login: `admin` / `svit123`
- [ ] Navigate to `/admin` dashboard
- [ ] Check console for errors (F12 → Console)
- [ ] Test student creation form

### API Endpoints
- [ ] `GET /api/students` returns JSON
- [ ] `GET /api/teachers` returns JSON
- [ ] `GET /api/announcements` returns JSON
- [ ] `POST /api/students` creates student successfully

### Database
- [ ] Run `npx prisma studio` to verify data
- [ ] Check student records appear after creation
- [ ] Verify updates reflect in database

### Performance
- [ ] Run Lighthouse audit: `npx lhci autorun --url=https://your-domain.vercel.app/admin`
- [ ] Target: Performance ≥ 85, Accessibility ≥ 90

### Stress Test (Optional)
```bash
npx autocannon -c 50 -d 15 https://your-domain.vercel.app/api/students
```

---

## Rollback Plan

If deployment fails:

1. **Database Issues**:
   - Check `DATABASE_URL` connection string
   - Verify Neon database is accessible
   - Run `npx prisma migrate deploy` if needed

2. **Build Failures**:
   - Check Node.js version (18+ required)
   - Verify all dependencies installed
   - Check for TypeScript errors

3. **Runtime Errors**:
   - Check Vercel function logs
   - Verify environment variables set correctly
   - Check middleware configuration

---

## Support Resources

- **Documentation**: See `CHANGELOG.md` and `FINAL_REPORT.md`
- **Database**: Neon PostgreSQL dashboard
- **Deployment**: Vercel dashboard
- **Issues**: Check browser console and Vercel function logs

---

## Quick Commands Reference

```bash
# Development
npm run dev

# Build
npm run build

# Production start
npm run start

# Database
npx prisma studio
npx prisma migrate deploy

# Testing
npx lhci autorun --url=http://localhost:3000/admin
npx autocannon -c 50 -d 15 http://localhost:3000/api/students
```

---

**Status**: ✅ Ready for Deployment  
**Last Updated**: January 2025

