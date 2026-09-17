# LedgerLearn — Vercel + Neon PostgreSQL Deployment Guide

Deploy LedgerLearn to **Vercel** with **Neon PostgreSQL** and **Firebase Authentication** (Google sign-in). This is the fastest deployment path — Vercel is built by the Next.js team, so it auto-detects and optimizes the framework natively.

**Estimated time:** 20–30 minutes
**Cost:** $0/month (within free tiers)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Vercel (Next.js native)                            │
│  SSR + API routes · sin1 region (Singapore)         │
└────────────┬────────────────────────┬───────────────┘
             │                        │
             ▼                        ▼
   ┌──────────────────┐    ┌──────────────────────┐
   │  Neon Postgres   │    │  Firebase Auth       │
   │  (free tier)     │    │  (Google sign-in)    │
   │  — Prisma ORM    │    │  — session cookies   │
   └──────────────────┘    └──────────────────────┘
```

**Why Vercel over Firebase App Hosting:**
- ⚡ Zero-config Next.js deployment (auto-detects App Router, API routes, RSC)
- 🔄 Auto-deploy from GitHub on every push (CD pipeline built-in)
- 🌐 Edge network with 18+ global regions (we use `sin1` for Malaysia)
- 🆓 Generous free tier: 100 GB bandwidth, 1000 build minutes/month
- 🛠️ No `apphosting.yaml` or service account JSON to manage — env vars in dashboard

**Why Firebase Auth still works on Vercel:**
The auth flow is framework-agnostic — Firebase JS SDK runs in the browser, the Admin SDK verifies session cookies via HTTP, and Prisma stores the user data. None of this depends on Firebase Hosting.

---

## Prerequisites

- A Google account
- A GitHub account (Vercel deploys from Git)
- [Node.js 20+](https://nodejs.org/) and [Bun](https://bun.sh) installed
- The LedgerLearn project pushed to a GitHub repo

---

## Step 1 — Create a Neon PostgreSQL database (5 min)

1. Go to **[neon.tech](https://neon.tech)** and sign up with GitHub.
2. Click **New Project** → fill in:
   - **Name:** `ledgerlearn`
   - **Region:** `Asia Pacific (Singapore) — ap-southeast-1`
   - **Postgres version:** 16 (default)
   - **Compute size:** Shared (free)
3. Click **Create project**.
4. Copy the **connection string** — looks like:
   ```
   postgresql://neondb_owner:npg_XxXxXxXx@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
   Save this — you'll use it as `DATABASE_URL`.

---

## Step 2 — Create a Firebase project (5 min)

1. Go to **[console.firebase.google.com](https://console.firebase.google.com)** → **Add project**.
2. Name it `ledgerlearn` (or whatever you prefer).
3. Disable Google Analytics (not needed for this app).
4. Once created, you should be on the project overview page.

> 💡 **You don't need Firebase Hosting** for this deployment path — only Firebase **Authentication**. The "Hosting" product in Firebase console will stay unused.

---

## Step 3 — Enable Firebase Authentication (5 min)

1. In the Firebase console, click **Authentication** → **Get started**.
2. Go to the **Sign-in method** tab.
3. Click **Google** → **Enable** → toggle on.
4. Select a **support email** (yours).
5. Click **Save**.
6. **Important:** Click **Settings** → **Authorized domains** → **Add domain** and add:
   - `localhost` (for local dev — usually already there)
   - Your future Vercel domain: `ledgerlearn.vercel.app` (replace with your project name)
   - Any preview domains Vercel generates (e.g. `ledgerlearn-*-yourname.vercel.app`)
   - If you set a custom domain later, add that too

---

## Step 4 — Get Firebase SDK config (3 min)

1. In Firebase console, click the **gear icon** next to "Project Overview" → **Project settings**.
2. Scroll down to **Your apps** → click the **`</>` (Web)** icon to register a web app.
3. App nickname: `ledgerlearn-web` → **Register app** (skip Firebase Hosting setup — we use Vercel).
4. Copy the `firebaseConfig` object — you need these 6 values:
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

## Step 7 — Push to GitHub (2 min)

Vercel deploys from a Git repo. If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit — LedgerLearn with Firebase Auth"
git branch -M main
git remote add origin https://github.com/<your-username>/ledgerlearn.git
git push -u origin main
```

> 💡 Make sure `.gitignore` includes `.env`, `db/`, `node_modules/`, `.next/`, `firebase-service-account.json` — it already does.

---

## Step 8 — Install Vercel CLI (1 min)

```bash
npm install -g vercel
vercel login
```

Sign in with GitHub, email, or GitLab — GitHub is recommended since your repo is there.

---

## Step 9 — Set environment variables on Vercel (5 min)

You have two options — CLI (fast) or dashboard (visual).

### Option A: CLI (recommended)

```bash
# Server secrets — Production + Preview environments
vercel env add DATABASE_URL
# Paste Neon connection string
# Select: Production, Preview

vercel env add FIREBASE_PROJECT_ID
# Paste "ledgerlearn"
# Select: Production, Preview

vercel env add FIREBASE_CLIENT_EMAIL
# Paste the client_email
# Select: Production, Preview

vercel env add FIREBASE_PRIVATE_KEY
# Paste the private_key (with \n escapes)
# Select: Production, Preview

# Public (browser) env vars — also add to Development so local `vercel dev` works
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
# For each: select Production, Preview, Development
```

### Option B: Dashboard

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)** → **Add New… → Project** → import your `ledgerlearn` repo
2. Don't deploy yet — click **Settings** → **Environment Variables**
3. Add each variable from `.env.example` with the appropriate environment scope:
   - `DATABASE_URL`, `FIREBASE_*` → **Production + Preview** (server secrets, not browser)
   - `NEXT_PUBLIC_FIREBASE_*` → **Production + Preview + Development** (needed at build time)

---

## Step 10 — Deploy (3 min)

### Option A: CLI deploy

```bash
vercel              # Preview deployment
vercel --prod       # Production deployment
```

The first deploy takes 2–4 minutes. Vercel will:
1. Install Bun dependencies
2. Run `bun run build`
3. Build the Next.js app with SSR + API routes
4. Deploy to `sin1` region (Singapore)
5. Provision an HTTPS endpoint

You'll get a URL like:
```
https://ledgerlearn.vercel.app
```

### Option B: Auto-deploy from GitHub

If you imported the repo via dashboard (Option B in Step 9), every `git push` to `main` triggers a production deploy, and every PR triggers a preview deploy. This is the recommended workflow for ongoing development.

---

## Step 11 — Add Vercel domain to Firebase Auth (1 min)

1. Go to Firebase console → **Authentication** → **Settings** → **Authorized domains**.
2. Click **Add domain** and add your Vercel production URL: `ledgerlearn.vercel.app`
3. If you have preview URLs (e.g. `ledgerlearn-git-staging-yourname.vercel.app`), add those too.
4. Test Google sign-in on the live URL.

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
| Push to GitHub → auto-deploy | New version live in ~2 min |

---

## Cost projection

For a typical university class (~100 students using the app during a semester):

| Service | Free tier | Your usage | Cost |
|---|---|---|---|
| **Neon Postgres** | 0.5 GB storage, 100 compute hours | ~50 MB storage, ~10 hours/month | **$0** |
| **Vercel Hobby** | 100 GB bandwidth, 1000 build min, 100 GB-h serverless fn | ~5 GB bandwidth, ~50 builds, ~10 GB-h | **$0** |
| **Firebase Auth** | Unlimited auth | 100 users | **$0** |
| **Total** | | | **$0/month** ✅ |

If you outgrow free tiers:
- Vercel Pro: $20/month per team member (needed for commercial use)
- Neon Launch: $19/month (1 GB storage, 192 compute hours)

---

## Troubleshooting

### "Sign in" button doesn't appear (still says "Demo Guest")
- Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is set in Vercel env vars with **Production** scope.
- Public env vars must be set at build time — Vercel bakes them into the client bundle.
- Re-deploy after adding the env var (`vercel --prod`).

### Google popup blocked / "auth/unauthorized-domain"
- Add your Vercel domain to Firebase Console → Authentication → Settings → **Authorized domains**.
- Don't forget preview URLs if you want sign-in to work on preview deployments.

### Build fails with "Prisma can't reach database"
- The build step runs `prisma generate` which needs `DATABASE_URL` available at build time.
- Make sure `DATABASE_URL` is set with **both** Production and Preview environments in Vercel.
- If using a connection pooler (Neon's pooled connection string), make sure it ends with `?sslmode=require`.

### "ECONNREFUSED" or database timeout on cold starts
- Neon's free tier can suspend idle computes (~5 min idle). The first request after suspension takes ~3-5 seconds to wake.
- For always-on: upgrade to Neon Launch ($19/mo) or use Neon's `pgbouncer` connection pooler.
- Vercel Serverless Functions have a 10-second timeout on Hobby plan — usually fine.

### Session expires after 5 days
- This is by design (see `SESSION_COOKIE_MAX_AGE` in `src/lib/firebase-admin.ts`).
- The next API call returns demo-mode data; the AuthProvider automatically re-prompts for sign-in.

### `FIREBASE_PRIVATE_KEY` parsing error
- The value must contain literal `\n` escapes, not actual newlines.
- When pasting into Vercel dashboard: paste the raw string from the JSON file, Vercel handles escaping.
- When using `vercel env add` CLI: paste the value with `\n` already escaped.

### Build fails because Prisma schema still says `sqlite`
- Edit `prisma/schema.prisma` → `provider = "postgresql"` → commit → push.
- Vercel rebuilds automatically.

### "405 Method Not Allowed" on API routes
- Make sure `vercel.json` doesn't override the Next.js framework detection.
- The current `vercel.json` is minimal — Vercel auto-detects Next.js and handles API routes natively.

---

## Vercel vs Firebase App Hosting — quick comparison

| Aspect | Vercel | Firebase App Hosting |
|---|---|---|
| **Setup time** | ~20 min | ~30 min |
| **Config files** | `vercel.json` (1 file, 5 lines) | `apphosting.yaml` + `firebase.json` + service account JSON |
| **Auto-deploy from Git** | Built-in, push to deploy | Built-in via GitHub integration |
| **Cold starts** | ~0 ms (always warm on Hobby) | ~1-3 sec on cold start (Cloud Run) |
| **Free tier bandwidth** | 100 GB/month | 1 GB/day (~30 GB/month) |
| **Region options** | 18+ global regions | Limited to Cloud Run regions |
| **Next.js feature support** | Native (Vercel = Next.js company) | Good but follows Cloud Run's release cycle |
| **Auth integration** | Firebase Auth works via env vars | Firebase Auth works natively (same Google account) |
| **Best for** | Indie devs, startups, Next.js purists | Google Cloud shops, enterprise Firebase users |

**Pick Vercel if:** You want the simplest, most "Next.js-native" deployment.
**Pick Firebase App Hosting if:** You're already deep in Google Cloud, want a single bill, or scaling to enterprise.

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

When you deploy to Vercel with the env vars set, demo mode is automatically disabled.

---

## What's in this repo

```
.
├── vercel.json                # Vercel config (minimal — auto-detects Next.js)
├── apphosting.yaml             # Firebase App Hosting config (alternative deploy)
├── firebase.json               # Firebase CLI config (alternative deploy)
├── firestore.rules             # Firestore rules (locked down — we use Postgres)
├── .env.example                # Copy to .env and fill in
├── prisma/
│   └── schema.prisma          # Provider is "sqlite" by default — swap to "postgresql" for prod
├── scripts/
│   ├── seed.ts                # Seeds 22 accounts, 6 lessons, 18 quiz questions
│   └── firebase-deploy.sh     # Alternative: Firebase one-shot deploy
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
    ├── DEPLOYMENT-GUIDE.md    # Firebase App Hosting path (alternative)
    └── VERCEL-DEPLOYMENT-GUIDE.md  # This file (recommended)
```

---

## Next steps

After deployment, consider adding:
- **Custom domain** (e.g. `ledgerlearn.youruni.edu.my`) via Vercel dashboard → Settings → Domains
- **Email/password auth** alongside Google (Firebase Console → Authentication → Sign-in method)
- **Vercel Analytics** for real-user monitoring (free on Hobby tier)
- **Instructor dashboard** with class-wide analytics (would need a separate `instructors` table + role check)
- **Quiz export** to LMS (Moodle/Canvas) via LTI integration

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

# Deploy to Vercel (preview)
vercel

# Deploy to Vercel (production)
vercel --prod

# View logs
vercel logs

# Open Vercel dashboard
vercel open

# Pull env vars from Vercel to local .env
vercel env pull .env.local
```

---

**Built for accounting students in Malaysian universities.**
**Selamat belajar! Happy learning!**
