# Q&A: Multi-Device Viewing, Deployment & Infrastructure

Questions and answers from the multi-device game viewing implementation session.

---

## 1. Viewing Changes Locally Before Deploying

**Q:** Before merging to main, is there a way to view this locally but with the display size of an iPhone or mobile?

**A:** Yes — use your browser's Developer Tools to simulate a mobile screen:

1. Open `http://localhost:3000/game` with `npm run dev` running
2. Press **F12** to open DevTools
3. Press **Ctrl+Shift+M** to toggle the device toolbar
4. Select a device like "iPhone 12 Pro" (390×844) or "iPhone SE" (375×667)
5. The page renders at that device's screen size, letting you preview mobile layout before deploying

---

## 2. Purpose of Cleaning Up Git Branches

**Q:** What is the purpose of cleaning up other branches?

**A:**
- **Reduces clutter** — over time, old branches make it harder to find active ones
- **Clarity** — `git branch` or GitHub only shows branches that matter
- **No confusion** — avoids accidentally working on an old, merged branch

What it does **NOT** do:
- Does not delete any code or history — all commits are already in `main`
- Does not affect the deployed site

It's purely organizational and entirely optional. Old branches just sit there doing nothing.

---

## 3. What Role Supabase Plays

**Q:** What is Supabase's role in the multi-device viewing feature, and how does it allow viewers to see real-time game progress?

**A:** Supabase acts as a **shared notebook in the cloud** that all devices read from:

1. **Host makes a move** → game engine calculates new state locally
2. **App writes** the new state to Supabase's database (like writing a snapshot into the shared notebook)
3. **Supabase detects** the change and **automatically pushes** it to every viewer through a WebSocket connection
4. **Viewer's phone** receives the update and re-renders the table (~100-300ms delay)

Supabase provides two things:
- **A database (PostgreSQL)** — the central place where shared game state is stored
- **Realtime push** — instead of viewers constantly polling, Supabase maintains an open connection and pushes changes instantly

---

## 4. Re-running SQL After Vercel Deploys

**Q:** Would I need to restart and rerun the SQL commands each time I deploy on Vercel?

**A:** **No.** The SQL creates the `game_rooms` table and security policies in Supabase's database, which is **completely separate from Vercel**:

- **Vercel** = hosts your website code (the frontend)
- **Supabase** = hosts your database (the backend data)

They are two independent services. Deploying new code to Vercel doesn't touch Supabase at all. The SQL is a **one-time setup**.

---

## 5. Shutting Down Supabase After Playing

**Q:** Do I have to shut down Supabase each time I finish playing? Can it stay running without consuming free tier usage?

**A:** **No shutdown needed.** Leave it running permanently:

- Supabase's free tier is **always on** — no start/stop button
- Free tier: 500 MB database, 5 GB bandwidth/month, 500 concurrent connections
- A game room is ~2-3 KB — even thousands of rooms barely use storage
- When nobody is playing, **nothing is consumed** — the database sits idle at zero cost

**One thing to note:** Supabase pauses projects after **7 days of complete inactivity** (zero API requests). If that happens, go to the dashboard and click "Restore" (~1 minute). Not an issue if you play at least once a week.

---

## 6. Security of Public Supabase Keys

**Q:** I've shared my Supabase public URL and anon key. Could an attacker use these to spam my application and consume free tier usage?

**A:** Technically possible, but practically very low risk:

- The `NEXT_PUBLIC_` keys are **designed to be public** — they're embedded in the frontend JavaScript bundle
- With these keys, someone could create fake rooms or make API calls
- However, each room is ~2-3 KB, so it would take ~200,000 fake rooms to fill 500 MB
- Supabase has built-in rate limiting
- Attackers target popular services, not personal poker apps

**The secret key** (which was NOT shared) is the one that must never be exposed — it bypasses all security policies.

**If protection is ever needed later:**
- Add Row Level Security policies with rate limits
- Add Supabase Edge Functions to validate requests
- Set up additional rate limiting

For a personal app with ~10 users, the current setup is fine.

---

## 7. Vercel Running 24/7 and Usage Concerns

**Q:** Does Vercel run 24/7? Would having the app deployed all the time cause problems or consume usage limits?

**A:** **Vercel is NOT a server running 24/7.** It works like a library shelf:

- Built website files (HTML, JS, CSS, images) sit on Vercel's CDN
- Files do **nothing** until someone visits the URL
- When someone visits, Vercel **serves the files** — like handing a book off the shelf
- When nobody visits, **zero resources consumed**

**Vercel Free Tier Limits:**

| Resource | Free Limit | Typical Usage |
|----------|-----------|---------------|
| Bandwidth | 100 GB/month | A visit uses ~200-500 KB (~200,000 visits to hit limit) |
| Builds | 100/day | Only when pushing to `main` (few times a week) |
| Serverless Functions | 100 GB-hours/month | This app has zero — it's fully static |

The Supabase API calls happen from the **user's browser**, not from Vercel. Both Vercel and Supabase can be left running permanently with no cost concerns on the free tier.
