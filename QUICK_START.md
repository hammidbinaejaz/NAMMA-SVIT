# Quick Start Guide - Custom Authentication Setup

## 🚀 Fast Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env.local`:
```env
AUTH_SECRET=generate-a-random-32-character-secret-key-here
DATABASE_URL=your-postgresql-connection-string
```

**Generate AUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run Database Migration
```bash
npx prisma generate
npx prisma migrate dev --name add_password_fields
```

### 4. Create Your First Admin User

Create a script `create-admin.ts`:
```typescript
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
  
  console.log('✅ Admin user created!');
  console.log('Username: admin');
  console.log('Password: admin123');
  console.log('⚠️  Change password after first login!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run it:
```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' create-admin.ts
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Login
- Go to http://localhost:3000
- Username: `admin`
- Password: `admin123`

## ✅ Done!

You now have:
- ✅ Custom authentication system
- ✅ Username-based login
- ✅ Role-based access control
- ✅ Session management

## 📝 Next Steps

1. **Create more users** - Students, Teachers, Parents
2. **Update passwords** - Change default admin password
3. **Configure production** - Set proper AUTH_SECRET in production

See `AUTH_MIGRATION_GUIDE.md` for detailed documentation.



