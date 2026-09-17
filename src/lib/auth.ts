import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { firebaseAuth, firebaseEnabled, SESSION_COOKIE_NAME } from "@/lib/firebase-admin";

/**
 * Server-only helper: resolve the current student ID from the session
 * cookie (or fall back to demo mode).
 *
 * - If Firebase Auth is configured AND a valid session cookie exists,
 *   we ensure a Student row exists for that UID and return it.
 * - Otherwise we return the demo student ID, so the app stays usable
 *   in the sandbox / preview environment.
 */
export async function getCurrentStudentId(): Promise<string> {
  // Demo fallback
  if (!firebaseEnabled) {
    return "student-demo";
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return "student-demo";
  }

  try {
    const auth = await firebaseAuth.ensure();
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    const uid = decoded.uid;

    // Ensure Student row exists (upsert)
    await db.student.upsert({
      where: { id: uid },
      update: {
        displayName: decoded.name ?? "Student",
        email: decoded.email ?? null,
        photoUrl: decoded.picture ?? null,
      },
      create: {
        id: uid,
        displayName: decoded.name ?? "Student",
        email: decoded.email ?? null,
        photoUrl: decoded.picture ?? null,
      },
    });

    return uid;
  } catch {
    // Invalid or expired cookie → fall back to demo
    return "student-demo";
  }
}

/** True when Firebase Auth is configured AND the request has a valid
 * session cookie (i.e. the user is genuinely signed in). */
export async function isSignedIn(): Promise<boolean> {
  if (!firebaseEnabled) return false;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return false;
  try {
    const auth = await firebaseAuth.ensure();
    await auth.verifySessionCookie(sessionCookie, true);
    return true;
  } catch {
    return false;
  }
}
