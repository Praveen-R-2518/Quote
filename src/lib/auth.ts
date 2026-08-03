import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SESSION_VALUE = "authenticated";

export function getAdminPin(): string {
  return process.env.ADMIN_PIN ?? "1234";
}

export async function verifyPin(pin: string): Promise<boolean> {
  const expected = getAdminPin();
  if (pin === expected) return true;
  const hash = process.env.ADMIN_PIN_HASH;
  if (hash) return bcrypt.compare(pin, hash);
  return false;
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}
