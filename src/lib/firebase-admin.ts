import type { App as FirebaseApp } from "firebase-admin/app";
import type { Auth as FirebaseAuth } from "firebase-admin/auth";

/**
 * Server-side Firebase Admin SDK — loaded lazily.
 *
 * Why dynamic import?
 * - When `FIREBASE_*` env vars are unset (sandbox / demo mode), we
 *   never import `firebase-admin/*` at all. This means the packages
 *   don't need to be installed for the app to run in demo mode.
 * - When env vars ARE set, we dynamic-import on first use.
 */
const hasCreds =
  !!process.env.FIREBASE_PROJECT_ID &&
  !!process.env.FIREBASE_CLIENT_EMAIL &&
  !!process.env.FIREBASE_PRIVATE_KEY;

export const firebaseEnabled = hasCreds;

let _app: FirebaseApp | null = null;
let _auth: FirebaseAuth | null = null;
let _initPromise: Promise<void> | null = null;

function ensureInit(): Promise<void> {
  if (!hasCreds) {
    return Promise.reject(
      new Error("Firebase Admin SDK is not enabled — set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY")
    );
  }
  if (_app && _auth) return Promise.resolve();
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const { initializeApp, getApps, cert } = await import("firebase-admin/app");
    const { getAuth } = await import("firebase-admin/auth");

    if (getApps().length === 0) {
      _app = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
        }),
      });
    } else {
      _app = getApps()[0];
    }
    _auth = getAuth(_app);
  })();

  return _initPromise;
}

/** Synchronous accessors — return null if not yet initialised. */
export const firebaseApp = {
  get(): FirebaseApp | null {
    return _app;
  },
};

export const firebaseAuth = {
  get(): FirebaseAuth | null {
    return _auth;
  },
  /** Ensures the Admin SDK is initialised and returns the Auth instance. */
  async ensure(): Promise<FirebaseAuth> {
    await ensureInit();
    return _auth!;
  },
};

/** Session cookie lifetime in milliseconds (5 days). */
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 5 * 1000;
export const SESSION_COOKIE_NAME = "ledgerlearn_session";

// Re-export types
export type { FirebaseApp, FirebaseAuth };
