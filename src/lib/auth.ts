import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

const secretKey = process.env.AUTH_SECRET || "your-secret-key-change-in-production-min-32-chars";
const key = new TextEncoder().encode(secretKey);

export type UserRole = "admin" | "teacher" | "student" | "parent";

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  name?: string;
}

export async function encrypt(payload: AuthUser) {
  const jwtPayload: Record<string, string> = {
    id: payload.id,
    username: payload.username,
    role: payload.role,
    ...(payload.name && { name: payload.name }),
  };
  return await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(input: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload as unknown as AuthUser;
}

export async function login(username: string, password: string): Promise<{ user: AuthUser; success: boolean; error?: string }> {
  try {
    // Try to find user in each model
    let user: any = null;
    let role: UserRole = "student";

    // Check Admin
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (admin) {
      // For now, we'll need to check password after adding it to schema
      // In production, hash passwords when creating users
      user = admin;
      role = "admin";
    } else {
      // Check Teacher
      const teacher = await prisma.teacher.findUnique({ where: { username } });
      if (teacher) {
        user = teacher;
        role = "teacher";
      } else {
        // Check Student
        const student = await prisma.student.findUnique({ where: { username } });
        if (student) {
          user = student;
          role = "student";
        } else {
          // Check Parent
          const parent = await prisma.parent.findUnique({ where: { username } });
          if (parent) {
            user = parent;
            role = "parent";
          }
        }
      }
    }

    if (!user || !user.password) {
      return { user: {} as AuthUser, success: false, error: "Invalid username or password" };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { user: {} as AuthUser, success: false, error: "Invalid username or password" };
    }

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      role,
      name: user.name || user.username,
    };

    return { user: authUser, success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { user: {} as AuthUser, success: false, error: "An error occurred during login" };
  }
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Helper to get current user in server components
export async function getCurrentUser(): Promise<AuthUser | null> {
  return await getSession();
}

