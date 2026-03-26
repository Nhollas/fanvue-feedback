# Design Decisions: Fanvue Feedback Rebuild

Tracking each design decision as we work through the rebuild plan.

---

## Q1: Who is the target audience?

**Decision: Creators and fans.**

Both user types can submit and vote on feature requests. Internal Fanvue employees are not a separate class — they participate as either a creator or a fan. The UX needs to work for two different mental models (creators thinking about tools/monetization vs. fans thinking about discovery/experience).

---

## Q2: Should feedback be segmented by user type?

**Decision: Option C — single feed with category tags.**

All feedback lives in one stream, tagged as "Creator" or "Fan" so users can filter to what matters to them. Avoids fragmenting the community across separate boards, and keeps the build simpler from an implementation perspective.

---

## Project Context

This is a standalone project — it does not integrate with Fanvue's internal systems. Key constraints:

- No access to Fanvue's internal systems (APIs, auth, databases)
- Cannot integrate with Fanvue SSO or internal services
- Architecture, design thinking, and code quality matter more than feature completeness

---

## Q3: How should authentication work?

**Decision: No auth for now.**

Ideally this would use Fanvue SSO so users log in with existing accounts and we get role tagging (creator/fan) for free. However, since this is a standalone project with no access to Fanvue's internal systems, auth is not feasible to implement meaningfully. No auth avoids unnecessary complexity for a project that won't face real abuse. The architecture should be designed so auth could be layered in later.

---

## Q4: Backend & data persistence — where does feedback data live?

**Decision: Neon Postgres + Drizzle ORM.**

Deploying to Vercel. Neon Postgres provides a generous free tier (0.5 GB storage, 190 compute hours/month) and pairs well with Next.js. Drizzle ORM for type-safe queries — user has prior experience with it. PlanetScale was considered but they removed their free tier in 2024 (cheapest is now $5/month). Supabase was ruled out due to past platform issues.

---

## Q5: What's the MVP feature scope?

**Decision: Core feedback loop + AI duplicate detection + changelog.**

Informed by UX research showing traditional upvote boards suffer from herd bias, vocal minority distortion, and survey fatigue.

### Iteration 1 Features

| Feature | Rationale |
|---|---|
| **Browse feedback list** | Core loop — with randomized/recent-first ordering, not pure vote-count sorting, to combat herd bias |
| **Upvote + emoji reactions** | Multi-modal input reduces friction; ACM research shows emoji reactions produce equivalent signal to text |
| **Submit suggestions with AI duplicate detection** | AI-powered intent matching surfaces similar existing requests before submission. Aligns with Fanvue's AI-forward positioning |
| **Status lifecycle labels** | Requested → Under Review → Planned → In Progress → Completed → Rejected |
| **Category tags (Creator/Fan)** | Single feed, filterable by user type (from Q2) |
| **Search & filter** | By status, category, and text |
| **Comments** | Two-way conversation on each feedback item |
| **Changelog / announcements** | Close the feedback loop — data shows 2.5x retention multiplier when users see their feedback become features |

### Deferred to Iteration 2

- Public roadmap board view
- Gamification / contributor badges
- Opportunity scoring (importance x satisfaction)
- Rich changelog with media (screenshots, GIFs)

---

## Q6: How should AI duplicate detection work?

**Decision: Hybrid approach (keyword as-you-type + semantic on submit) with pre-computed embeddings for perceived-instant submit checks.**

Speed is the priority — the submit check must feel instant, not processing for seconds.

### How it works

1. **As user types the title** — debounced (300-500ms) keyword matching against existing feedback titles. Cheap, instant, catches obvious duplicates early.
2. **When user moves to description field** — pre-compute the vector embedding for the title in the background. By the time they finish writing, the embedding is ready.
3. **On submit** — combine the pre-computed title embedding with the description, run a single fast pgvector similarity query, and show matches. The heavy lifting (embedding generation) already happened during natural typing pauses, so this feels near-instant.

### Tech approach

- **Vector embeddings** stored in Neon Postgres via pgvector extension
- Embedding generation via OpenAI embedding API (or similar) — fast and cheap
- No LLM calls needed — embeddings are sufficient for semantic similarity at this scale
- Pre-computation hides latency behind user behavior

---

## Q7: Sorting & ranking — how should the feedback list be ordered?

**Decision: Multiple sort options with "Trending" as the default.**

Users can switch between Trending, Newest, and Most Voted. Trending is the default landing experience.

### Trending algorithm

Uses a hot/trending score that balances vote velocity against time decay:

```
trending_score = votes_in_recent_window / hours_since_posted^decay_factor
```

- A new post with 5 quick votes beats an old post sitting on 100 stale votes
- Posts naturally sink as activity dies down unless engagement continues
- Avoids herd bias (Most Voted) and firehose effect (Newest)
- Rewards *current interest* — new ideas get a fair shot while genuinely popular items stay visible

---

## Q8: What should the URL structure and page layout look like?

**Decision: Separate pages with proper routes, leveraging Next.js 16 Cache Components for performance.**

No need for drawer/modal hacks to avoid slow transitions. Next.js 16 replaced experimental PPR with Cache Components (`cacheComponents: true` + `"use cache"` directive). Each page gets a static shell with dynamic holes filled at request time — pages are fast by default.

### Route structure

| Route | View | Caching strategy |
|---|---|---|
| `/` | Feedback feed (trending default) | Cached shell, dynamic sort/filter |
| `/feedback/:id` | Feedback detail + comments | Static generation, revalidate on new comments/votes |
| `/changelog` | Announcements / "what changed" | Mostly static, revalidate on new entries |
| `/submit` | New suggestion form | Dynamic (AI duplicate detection) |

---

## Q9: What should the submission form look like?

**Decision: Simple form — title, description, category tag (Creator/Fan), submit button.**

No guided multi-step flow — that's over-engineering three fields. AI duplicate detection (from Q6) runs in the background as the user types the title, surfacing matches before they submit. That's the only AI in the submission flow.

AI auto-detection of category tags was considered but rejected — a user clicking "Creator" or "Fan" from a dropdown takes half a second. The effort and latency of AI inference for that is not worth the negligible UX gain. **Rule: only use AI where the problem can't be solved with a simple UI control.**

---

## Q10: How should voting work?

**Decision: Upvote only.**

Single upvote button with a clear count. No emoji reactions (ambiguous signal — does "fire" mean urgent or cool?), no downvotes (discourages submissions), no importance ratings (adds friction). One action, one meaning: "I want this." Research showed emoji reactions produce equivalent data, not better — so go with the simpler UX.

---

## Q11: How should the changelog / "what changed" feature work?

**Decision: Both — a central changelog page + inline status updates on individual feedback items.**

- **`/changelog`** — reverse-chronological feed of shipped updates, each linking back to the original feedback item(s). Curated and browsable, not a searchable database. Kept simple since users can track specific items directly.
- **Inline on `/feedback/:id`** — status updates and team comments visible on the item itself. Users who've bookmarked or voted on a specific item see the update in context without having to find it in the changelog.

The two views serve different needs: the changelog is for browsing ("what has Fanvue shipped recently?"), the inline update is for tracking ("what happened to the thing I care about?"). Together they fully close the feedback loop.

---

## Q12: How should search and filtering work?

**Decision: Tab-based status filtering + search bar + category dropdown.**

- **Status as horizontal tabs** — All / Requested / Under Review / Planned / In Progress / Completed. Most common filter is zero-click visible, one-click to apply.
- **Search bar** — text search across feedback titles and descriptions.
- **Category dropdown** — Creator / Fan filtering.

Sidebar filters rejected (overkill for two filter dimensions). Filter syntax rejected (power-user pattern, adds cognitive load). Keeps it familiar and simple.

---

## Q13: Comments — flat or threaded?

**Decision: Flat list (chronological) for MVP.**

Feedback items aren't discussion forums — comments are typically short. Flat is simpler to build and easier to follow. Threaded/nested (option B) is the preferred long-term direction but too much investment for iteration 1. Option C (flat with @mentions) was rejected — it's a poor substitute for proper threading.

---

## Q14: How should the feedback detail page (`/feedback/:id`) be laid out?

**Decision: Feedback card + separated status history + comment list.**

Status changes and comments are kept separate to avoid status updates getting buried in long comment threads.

### Page structure (top to bottom)

1. **Feedback card** — title, description, category tag, vote count + button
2. **Status bar** — current status badge + collapsible timeline of all status changes (e.g. "Requested → Under Review → Planned"). Always visible, never buried regardless of comment volume.
3. **Comment list** — flat, chronological. Pure discussion — no status events mixed in.

---

## Q15: Should we seed the site with realistic data?

**Decision: Yes — seed with realistic Fanvue-themed data.**

Pre-populate with plausible feature requests that a creator/fan platform would receive (e.g. "Bulk schedule content", "Better creator discovery", "Dark mode for messaging"). Include varied statuses, vote counts, comments, and both Creator and Fan category tags. Demonstrates product empathy and brings the site to life for anyone landing on it.

---

## Q16: Visual design direction

**Decision: Dark-mode-first design matching Fanvue's brand language, built with Tailwind for layout + @fanvue/ui for themed elements.**

### What @fanvue/ui provides
Purely atomic UI elements — Buttons, Cards, Inputs, Badges, Tabs, Pagination, Dialog, Avatar, Search, Icons (150+). All themed with Fanvue's design tokens. No layout/structural components.

### What we build ourselves (using Tailwind)
- AppLayout / page shell
- Header / Navbar with branding and navigation
- Container (centered max-width content wrapper)
- Footer (if needed)
- Section components with consistent spacing

### Visual direction (derived from fanvue.com)

| Element | Approach |
|---|---|
| **Mode** | Dark-mode-first — near-black backgrounds as default |
| **Accent** | `#49F264` neon green — used sparingly for CTAs, active states, badges |
| **Typography** | Inter, bold large headings, comfortable body text |
| **Layout** | Full-width sections, centered max-width content, generous vertical spacing |
| **Cards** | Minimal borders, no heavy shadows — use background contrast and spacing |
| **Corners** | Large rounded corners throughout |
| **Hierarchy** | Opacity-based for secondary/inactive content |
| **Spacing** | Airy and generous — premium feel, nothing cramped |
| **Animations** | Subtle transitions on interactions, nothing flashy |
