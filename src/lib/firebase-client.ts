"use client";

import type { FirebaseApp } from "firebase/app";
import type { Auth, GoogleAuthProvider as GoogleAuthProviderType } from "firebase/auth";

/**
 * Client-side Firebase SDK — loaded lazily.
 *
 * Why dynamic import?
 * - When `NEXT_PUBLIC_FIREBASE_API_KEY` is unset (e.g. in the sandbox
 *   or during early local development before env vars are configured),
 *   we never import the `firebase/*` packages at all. This means the
 *   packages don't need to be installed for the app to run in demo
 *   mode, and bundlers (Turbopack/webpack) won't fail on resolution.
 * - When env vars ARE set, we dynamic-import on first use, which
 *   splits Firebase into its own chunk and loads it on demand.
 */
const publicConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export const firebaseClientEnabled = !!publicConfig.apiKey;

// Lazily-resolved singletons (populated on first call to `ensureFirebase`)
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _googleProvider: GoogleAuthProviderType | null = null;
let _initPromise: Promise<void> | null = null;

async function ensureFirebase(): Promise<void> {
  if (!firebaseClientEnabled) {
    throw new Error("Firebase client SDK is not enabled — set NEXT_PUBLIC_FIREBASE_API_KEY");
  }
  if (_app && _auth) return;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getAuth, GoogleAuthProvider } = await import("firebase/auth");

    _app = getApps().length ? getApp() : initializeApp(publicConfig as Required<typeof publicConfig>);
    _auth = getAuth(_app);
    _googleProvider = new GoogleAuthProvider();
    _googleProvider.setCustomParameters({ prompt: "select_account" });
  })();

  return _initPromise;
}

// Public accessors — callers MUST `await ensureFirebase()` first.
// For convenience, we expose getters that throw if called before init.
export const auth = {
  get(): Auth | null {
    return _auth;
  },
  async ensure(): Promise<Auth> {
    await ensureFirebase();
    return _auth!;
  },
};

export const googleProvider = {
  get(): GoogleAuthProviderType | null {
    return _googleProvider;
  },
  async ensure(): Promise<GoogleAuthProviderType> {
    await ensureFirebase();
    return _googleProvider!;
  },
};

// Re-export types for convenience
export type { FirebaseApp, Auth, GoogleAuthProviderType };
