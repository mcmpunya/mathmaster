import { NextResponse } from "next/server";
import {
  firebaseAuth,
  firebaseEnabled,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
} from "@/lib/firebase-admin";

/**
 * POST /api/auth/session
 * Body: { idToken: string }
 * Exchanges a Firebase ID token (from the client SDK) for a session
 * cookie stored as an HTTP-only cookie. The client SDK then signs out
 * (we don't keep the ID token in memory); all subsequent requests
 * rely on the session cookie alone.
 */
export async function POST(req: Request) {
  if (!firebaseEnabled) {
    return NextResponse.json(
      { error: "Firebase Auth not configured. Running in demo mode." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { idToken } = body as { idToken?: string };
  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  try {
    const auth = await firebaseAuth.ensure();
    // Verify the ID token first (5-day expiration enforced by Firebase)
    await auth.verifyIdToken(idToken);
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_MAX_AGE,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.floor(SESSION_COOKIE_MAX_AGE / 1000),
    });
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create session", detail: String(err) },
      { status: 401 }
    );
  }
}
