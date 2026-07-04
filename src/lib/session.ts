import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "erp_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

// Very lightweight session: store userId in a signed-ish cookie value
// For production you'd use a JWT or a DB session table.
// Here we base64-encode a JSON payload — acceptable for a POC behind a corporate firewall.

export async function createSession(userId: number) {
  const payload = Buffer.from(JSON.stringify({ userId, exp: Date.now() + SESSION_MAX_AGE * 1000 })).toString("base64");
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, payload, {
    httpOnly: true,
    secure: false,            // set to true in production with HTTPS
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<{ userId: number } | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    if (parsed.exp < Date.now()) return null;
    return { userId: parsed.userId };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
