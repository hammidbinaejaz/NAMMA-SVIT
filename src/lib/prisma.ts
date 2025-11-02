import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Test database connection on startup
async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to Neon PostgreSQL')
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    process.exit(1)
  }
}

// Only test in non-production or on first load
if (process.env.NODE_ENV !== 'production' || !globalThis.prismaGlobal) {
  testConnection().catch(console.error)
}

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma