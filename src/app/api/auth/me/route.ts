import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  firebaseAuth,
  firebaseEnabled,
  SESSION_COOKIE_NAME,
} from "@/lib/firebase-admin";

/** GET /api/auth/me — returns the current user profile or null. */
export async function GET() {
  if (!firebaseEnabled) {
    return NextResponse.json({
      user: null,
      demo: true,
      displayName: "Demo Student",
    });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return NextResponse.json({ user: null, demo: false });
  }

  try {
    const auth = await firebaseAuth.ensure();
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({
      user: {
        uid: decoded.uid,
        email: decoded.email ?? null,
        displayName: decoded.name ?? "Student",
        photoURL: decoded.picture ?? null,
      },
      demo: false,
    });
  } catch {
    return NextResponse.json({ user: null, demo: false });
  }
}
