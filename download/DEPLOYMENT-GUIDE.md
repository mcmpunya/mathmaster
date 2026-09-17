# LedgerLearn — Firebase + Neon PostgreSQL Deployment Guide

This guide walks you through deploying LedgerLearn to **Firebase App Hosting** with **Neon PostgreSQL** as the database and **Firebase Authentication** (Google sign-in) for per-student progress tracking.

**Estimated time:** 30–45 minutes
**Cost:** $0/month (within free tiers)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Firebase App Hosting (Cloud Run)                   │
│  Next.js 16 SSR · asia-southeast1 region            │
└────────────┬────────────────────────┬───────────────┘
             │                        │
             ▼                        ▼
   ┌──────────────────┐    ┌──────────────────────┐
   │  Neon Postgres   │    │  Firebase Auth       │
   │  (free tier)     │    │  (Google sign-in)    │
   │  — Prisma ORM    │    │  — session cookies   │
   └──────────────────┘    └──────────────────────┘
```

**Why this stack:**
- Neon's free tier never pauses (unlike Supabase)
- Firebase Auth gives you Google sign-in without writing auth UI
- Prisma ORM stays unchanged — only `provider` and `DATABASE_URL` change
- Firebase App Hosting auto-scales to zero when no traffic (free)

---

## Prerequisites

- A Google account
- [Node.js 20+](https://nodejs.org/) and [Bun](https://bun.sh) installed
- The LedgerLearn project files (this repo)
- A code editor

---

## Step 1 — Create a Neon PostgreSQL database (5 min)

1. Go to **[neon.tech](https://neon.tech)** and sign up with GitHub.
2. Click **New Project** → fill in:
   - **Name:** `ledgerlearn`
   - **Region:** `Asia Pacific (Singapore) — ap-southeast-1`
   - **Postgres version:** 16 (default)
   - **Compute size:** Shared (free)
3. Click **Create project**.
4. On the dashboard, copy the **connection string** — it looks like:
   ```
   postgresql://neondb_owner:npg_XxXxXxXx@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
   Save this somewhere safe — you'll use it as `DATABASE_URL`.

---

## Step 2 — Create a Firebase project (5 min)

1. Go to **[console.firebase.google.com](https://console.firebase.google.com)** → **Add project**.
2. Name it `ledgerlearn` (or whatever you prefer).
3. Disable Google Analytics (not needed for this app).
4. Once created, you should be on the project overview page.

---

## Step 3 — Enable Firebase Authentication (5 min)

1. In the Firebase console, click **Authentication** → **Get started**.
2. Go to the **Sign-in method** tab.
3. Click **Google** → **Enable** → toggle the switch on.
4. Select a **support email** (yours).
5. Click **Save**.
6. **Important:** Click **Settings** → **Authorized domains** → **Add domain** and add:
   - `localhost` (for local dev — usually already there)
   - Your future Firebase App Hosting domain: `ledgerlearn.web.app`
   - (We'll come back and add the App Hosting custom domain once deployed)

---

## Step 4 — Get Firebase SDK config (3 min)

1. In Firebase console, click the **gear icon** next to "Project Overview" → **Project settings**.
2. Scroll down to **Your apps** → click the **`</>` (Web)** icon to register a web app.
3. App nickname: `ledgerlearn-web` → check **Also set up Firebase Hosting** → **Register app**.
4. Copy the `firebaseConfig` object — you'll need these 6 values:
   ```
   apiKey:           "AIzaSyXXXX..."
   authDomain:        "ledgerlearn.firebaseapp.com"
   projectId:         "ledgerlearn"
   storageBucket:     "ledgerlearn.appspot.com"
   messagingSenderId: "1234567890"
   appId:             "1:1234567890:web:abcdef123"
   ```

---

## Step 5 — Get Firebase Admin SDK service account (3 min)

The server needs elevated credentials to verify session cookies.

1. In Firebase console → **Project settings** → **Service accounts** tab.
2. Click **Generate new private key** → confirm.
3. A JSON file downloads. Open it — you need three fields:
   - `project_id`     → `FIREBASE_PROJECT_ID`
   - `client_email`   → `FIREBASE_CLIENT_EMAIL`
   - `private_key`    → `FIREBASE_PRIVATE_KEY` (the entire `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` string)

> ⚠️ **Never commit this JSON file to git.** It's already in `.gitignore` as `firebase-service-account.json`.

---

## Step 6 — Set up local environment (5 min)

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and fill in all values:
   ```bash
   # Neon PostgreSQL
   DATABASE_URL="postgresql://neondb_owner:npg_XxXxXxXx@ep-...neon.tech/neondb?sslmode=require"

   # Firebase Admin (server-side)
   FIREBASE_PROJECT_ID="ledgerlearn"
   FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxx@ledgerlearn.iam.gserviceaccount.com"
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

   # Firebase Client (browser)
   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyXXXX..."
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="ledgerlearn.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="ledgerlearn"
   NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef123"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="ledgerlearn.appspot.com"
   ```

3. Switch Prisma to PostgreSQL — edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"   // ← change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

4. Push the schema and seed:
   ```bash
   bun run db:push
   bunx tsx scripts/seed.ts
   ```
   You should see: `✅ Seeded 22 accounts, 6 lessons, 18 questions.`

5. Test locally:
   ```bash
   bun run dev
   ```
   Open `http://localhost:3000` — you should see the "Sign in" button in the header (not the "Demo Guest" badge). Click it → Google popup → you're signed in.

---

## Step 7 — Install Firebase CLI (2 min)

```bash
npm install -g firebase-tools
firebase login
firebase experiments:enable webframeworks
```

---

## Step 8 — Configure the project for Firebase (5 min)

The repo already contains `firebase.json`, `apphosting.yaml`, `firestore.rules`, and `.env.example`. You just need to:

1. **Edit `apphosting.yaml`** — replace the placeholder public env vars with your real values from Step 4:
   ```yaml
   publicEnvironmentVariables:
     - variable: NEXT_PUBLIC_FIREBASE_API_KEY
       value: "AIzaSyXXXX..."   # ← your real key
     - variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
       value: "ledgerlearn.firebaseapp.com"
     - variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
       value: "ledgerlearn"
     # ... etc.
   ```

2. **Set the secrets** (server-only env vars):
   ```bash
   firebase apphosting:secrets:set DATABASE_URL
   # Paste your Neon connection string

   firebase apphosting:secrets:set FIREBASE_PROJECT_ID
   # Paste "ledgerlearn"

   firebase apphosting:secrets:set FIREBASE_CLIENT_EMAIL
   # Paste the client_email from the service account JSON

   firebase apphosting:secrets:set FIREBASE_PRIVATE_KEY
   # Paste the entire private_key string (with \n escapes)
   ```

3. **Set the Firebase project** as your default:
   ```bash
   firebase use --add ledgerlearn
   ```

---

## Step 9 — Deploy (5 min)

```bash
bun run build
firebase deploy
```

The first deploy takes 5–10 minutes. Firebase App Hosting will:
1. Build the Next.js app
2. Deploy it to Cloud Run in `asia-southeast1`
3. Provision an HTTPS endpoint
4. Wire it up to Firebase Hosting CDN

When done, you'll get a URL like:
```
https://ledgerlearn.web.app
```

Open it → click **Sign in** → Google login → your name + photo appears in the header → your progress is now saved under your UID.

---

## Step 10 — Add the deployed domain to Firebase Auth (1 min)

1. Go to Firebase console → **Authentication** → **Settings** → **Authorized domains**.
2. You should see `ledgerlearn.web.app` already added by Firebase Hosting. If not, add it manually.
3. Test sign-in on the live URL.

---

## Verifying it works

| Test | Expected result |
|---|---|
| Visit deployed URL | Dashboard loads with "Sign in" button (not "Demo Guest") |
| Click "Sign in" → Google | Google popup appears |
| After sign-in | Avatar + name in header; can sign out from dropdown |
| Take a quiz | Progress saved to your UID |
| Sign out, sign in as different Google account | Fresh progress (per-user isolation works) |
| Open in incognito as another user | Different progress for that user |

---

## Cost projection

For a typical university class (~100 students using the app during a semester):

| Service | Free tier | Your usage | Cost |
|---|---|---|---|
| **Neon Postgres** | 0.5 GB storage, 100 compute hours | ~50 MB storage, ~10 hours/month | **$0** |
| **Firebase App Hosting** | 360 MB-hours/day, 1 GB egress/day | ~50 MB-hours/day, ~100 MB egress | **$0** |
| **Firebase Auth** | Unlimited auth | 100 users | **$0** |
| **Firebase Hosting CDN** | 10 GB transfer/month | ~1 GB | **$0** |
| **Total** | | | **$0/month** ✅ |

If you outgrow free tiers:
- Neon Launch plan: $19/month (1 GB storage, 192 compute hours)
- Firebase pay-as-you-go: typically $5-15/month for small apps

---

## Troubleshooting

### "Sign in" button doesn't appear (still says "Demo Guest")
- Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is set in your `.env` (local) or `apphosting.yaml` (production).
- Restart the dev server after editing `.env`.
- For production: redeploy after editing `apphosting.yaml` (`firebase deploy`).

### Google popup is blocked
- Some browsers block popups. The Firebase SDK falls back to redirect mode automatically.
- Add your domain to **Authentication → Authorized domains** in Firebase console.

### `ECONNREFUSED` to database on first deploy
- Check that your Neon project is in **active** state (free tier can suspend idle projects).
- Verify `DATABASE_URL` includes `?sslmode=require`.
- For Neon: ensure IP allow-list is open (it is by default).

### "Permission denied" on Firestore
- You're not using Firestore — those rules are locked down by default. The error suggests an API route is being called that needs the auth cookie. Make sure you're signed in.

### Session expires after 5 days
- This is by design (see `SESSION_COOKIE_MAX_AGE` in `src/lib/firebase-admin.ts`).
- The next API call returns demo-mode data; the client should re-prompt for sign-in. The AuthProvider already handles this gracefully.

### Build fails with "private key parsing error"
- The `FIREBASE_PRIVATE_KEY` secret must contain literal `\n` escapes, not actual newlines.
- If you copied from the JSON file directly, replace newlines with `\n`:
  ```bash
  firebase apphosting:secrets:set FIREBASE_PRIVATE_KEY
  # Paste: -----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n
  ```

---

## Local development vs production

The app supports two modes:

| Mode | Trigger | Behaviour |
|---|---|---|
| **Demo mode** | `NEXT_PUBLIC_FIREBASE_API_KEY` not set | "Demo Guest" badge in header; all data saved to `student-demo` UID |
| **Auth mode** | Public + admin Firebase env vars all set | "Sign in" button; per-user data isolation |

Demo mode is great for:
- Local sandbox testing (no Firebase project needed)
- Demos to stakeholders (no login friction)
- Quick iteration on UI/features

When you deploy, demo mode is automatically disabled because the Firebase env vars are set in `apphosting.yaml`.

---

## What's in this repo

```
.
├── apphosting.yaml            # Firebase App Hosting config
├── firebase.json              # Firebase CLI config
├── firestore.rules            # Firestore rules (locked down — we use Postgres)
├── firestore.indexes.json     # Empty — no Firestore indexes needed
├── .env.example               # Copy to .env and fill in
├── prisma/
│   └── schema.prisma          # Provider is "sqlite" by default — swap to "postgresql" for prod
├── scripts/
│   └── seed.ts                # Seeds 22 accounts, 6 lessons, 18 quiz questions
├── src/
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── firebase-admin.ts  # Server-side Firebase Admin SDK
│   │   ├── firebase-client.ts # Browser Firebase SDK
│   │   └── auth.ts            # getCurrentStudentId() helper
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── session/   # POST: exchange ID token for session cookie
│   │   │   │   ├── sign-out/  # POST: clear session cookie
│   │   │   │   └── me/        # GET: current user info
│   │   │   ├── dashboard/     # Aggregated stats per student
│   │   │   ├── lessons/       # Lesson + section content
│   │   │   ├── quiz/          # Questions + attempt grading
│   │   │   ├── progress/      # Lesson progress tracking
│   │   │   ├── practice/      # Save journal entry attempts
│   │   │   └── accounts/      # Chart of accounts reference
│   │   └── page.tsx           # Single-page app with 5 tabs
│   └── components/app/
│       ├── auth-provider.tsx  # React context for auth state
│       ├── header.tsx         # Sign-in UI / user avatar
│       └── ...                # Dashboard, Lessons, Practice, Quiz, Progress
└── download/
    └── DEPLOYMENT-GUIDE.md    # This file
```

---

## Next steps

After deployment, consider adding:
- **Custom domain** (e.g. `ledgerlearn.youruni.edu.my`) via Firebase Hosting → Add custom domain
- **Email/password auth** alongside Google (Firebase Console → Authentication → Sign-in method)
- **Instructor dashboard** with class-wide analytics (would need a separate `instructors` table + role check)
- **Quiz export** to LMS (Moodle/Canvas) via LTI integration
- **Realtime leaderboard** using Firestore (would need to relax `firestore.rules`)

---

## Quick reference — common commands

```bash
# Local dev
bun run dev

# Push schema changes to database
bun run db:push

# Re-seed database
bunx tsx scripts/seed.ts

# Lint
bun run lint

# Deploy to Firebase
bun run build && firebase deploy

# View logs
firebase apphosting:logs

# Open Firebase console
firebase open console
```

---

**Built for accounting students in Malaysian universities.**
**Selamat belajar! Happy learning!**
