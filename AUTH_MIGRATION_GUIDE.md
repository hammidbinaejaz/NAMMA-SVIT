# Authentication Migration Guide - Clerk to Custom Auth

## ✅ Completed Migration

Clerk authentication has been completely replaced with a custom username-based authentication system using Prisma and bcrypt.

## 📋 Changes Made

### 1. **Database Schema Updates**
- Added `password` field to:
  - `Admin` model
  - `Student` model
  - `Teacher` model
  - `Parent` model

**⚠️ Migration Required:**
```bash
npx prisma migrate dev --name add_password_fields
```

### 2. **New Authentication System**

#### Created Files:
- `src/lib/auth.ts` - Authentication utilities (login, session management)
- `src/app/api/auth/login/route.ts` - Login API endpoint
- `src/app/api/auth/logout/route.ts` - Logout API endpoint
- `src/app/api/auth/me/route.ts` - Get current user endpoint

#### Updated Files:
- `src/middleware.ts` - Custom authentication middleware
- `src/app/layout.tsx` - Removed ClerkProvider
- `src/app/[[...sign-in]]/page.tsx` - Custom login form
- `src/components/Navbar.tsx` - Uses custom auth
- `src/components/Menu.tsx` - Uses custom auth
- `src/components/FormContainer.tsx` - Uses custom auth
- All dashboard pages - Use `getSession()` instead of `auth()`

### 3. **Package Dependencies**

**Removed:**
- `@clerk/nextjs`
- `@clerk/elements`

**Added:**
- `bcryptjs` - Password hashing
- `jose` - JWT token handling

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Environment Variables
Add to `.env.local`:
```env
AUTH_SECRET=your-super-secret-key-min-32-characters-change-in-production
DATABASE_URL=your-database-url
```

**⚠️ Important:** Generate a strong `AUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run Database Migration
```bash
npx prisma generate
npx prisma migrate dev --name add_password_fields
```

### 4. Create Initial Users

You'll need to hash passwords when creating users. Example script:

```typescript
// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.admin.create({
    data: {
      id: 'admin-1',
      username: 'admin',
      password: hashedPassword,
    },
  });
  
  console.log('Admin user created!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## 📝 Usage

### Server Components

Replace:
```typescript
import { auth } from "@clerk/nextjs/server";
const { userId, sessionClaims } = auth();
const role = sessionClaims?.metadata?.role;
```

With:
```typescript
import { getSession } from "@/lib/auth";
const session = await getSession();
const userId = session?.id;
const role = session?.role;
```

### Client Components

Use the API endpoint:
```typescript
const response = await fetch("/api/auth/me");
const { user } = await response.json();
```

## 🔐 Password Management

### Hashing Passwords

Always hash passwords when creating users:
```typescript
import bcrypt from 'bcryptjs';
const hashedPassword = await bcrypt.hash('plain-password', 10);
```

### Verifying Passwords

Done automatically in `login()` function in `src/lib/auth.ts`.

## 🎯 Key Differences

| Clerk | Custom Auth |
|-------|-------------|
| `auth()` hook | `getSession()` function |
| `currentUser()` | `fetch("/api/auth/me")` |
| `sessionClaims.metadata.role` | `session.role` |
| `userId` from auth | `session.id` |
| Clerk dashboard management | Direct database management |

## ⚠️ Important Notes

1. **Password Security**: Always hash passwords using bcrypt before storing
2. **Session Secret**: Must be at least 32 characters in production
3. **HTTPS Required**: In production, ensure cookies are secure (httpOnly, secure flags set)
4. **User Management**: Admin must create users directly in database or via admin panel
5. **Password Reset**: Not implemented yet - users must contact IT department

## 🐛 Troubleshooting

### "Cannot find module 'bcryptjs'"
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### "Cannot find module 'jose'"
```bash
npm install jose
```

### Login not working
1. Check password is hashed in database
2. Verify AUTH_SECRET is set
3. Check browser console for errors
4. Verify cookies are being set

### Session not persisting
- Check cookie settings in `src/lib/auth.ts`
- Verify middleware is running
- Check browser cookie settings

## 🔄 Migration Checklist

- [x] Remove Clerk dependencies
- [x] Add password fields to schema
- [x] Create auth utilities
- [x] Update login page
- [x] Update middleware
- [x] Update all components using Clerk
- [x] Create API routes
- [ ] Run database migration
- [ ] Create initial admin user
- [ ] Test login flow
- [ ] Test all role-based routes
- [ ] Test logout
- [ ] Update user creation forms to hash passwords

## 📚 Next Steps

1. **Password Reset Feature**: Add forgot password functionality
2. **Email Verification**: Optional email verification on signup
3. **2FA**: Add two-factor authentication if needed
4. **Session Management**: Add session timeout and refresh
5. **Audit Logging**: Track login/logout events

---

**Migration Date:** 2024  
**Status:** ✅ Complete - Ready for testing



