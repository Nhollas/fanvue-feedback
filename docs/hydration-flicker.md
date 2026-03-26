# Hydration Flicker: Client-Only State in Server-Rendered UI

## Problem

Three UI elements flash incorrect state on initial page load before correcting themselves after hydration. The server cannot know the correct state because it depends on client-only data (localStorage, URL search params read by client components).

## Affected Elements

### 1. Vote Button (`src/components/vote-button.tsx`)

**What flickers:** Voted buttons render as un-voted (white/outline), then flip to voted (green/brand) after hydration.

**Why:** The server has no access to localStorage, so it renders every VoteButton with `hasVoted: false`. After hydration, a `useEffect` reads `fanvue_voted_ids` from localStorage and updates the state. This causes the button's `variant` (white -> brand), `aria-pressed` (false -> true), and class names to change in a visible repaint.

**Severity:** Noticeable on pages where the user has voted on multiple items. Every voted button flashes white then green.

### 2. Sort Select (`src/components/sort-select.tsx`)

**What flickers:** The sort dropdown renders blank (no selected value visible), then populates with the correct option after hydration.

**Why:** The Select component is a client component that reads its value from nuqs (`useQueryState`). During SSR the component renders without its options hydrated, so the select appears empty. After hydration, nuqs syncs with the URL and the select displays the correct value.

**Severity:** Visible on every page load. The dropdown is blank for a frame before showing "Trending" (or whichever sort is active).

### 3. Active Status Tab Highlight (`src/components/status-tabs.tsx`)

**What flickers:** No tab has an active highlight on initial render, then the correct tab's highlight appears after hydration.

**Why:** The Tabs component is a client component that reads its `value` from nuqs (`useQueryState`). During SSR the active indicator isn't rendered because the client-side state hasn't been established yet. After hydration, nuqs syncs with the URL and the active tab highlight appears.

**Severity:** Visible on every page load. The tab bar renders without any active indicator for a frame before the correct tab becomes highlighted.

## Root Cause

All three cases share the same fundamental problem: **the server cannot access client-only state** (localStorage for votes, URL search params read by client components for filters/sort). React's hydration model requires the server render and the client's first render to match. Any state that only exists on the client must start at a default value during SSR, then update after hydration, causing a visible flash.

The `__no-transitions` hack (injecting a stylesheet to disable CSS transitions during hydration) was attempted but didn't reliably prevent the flicker — React's repaint happens before the transition-disabling stylesheet can take effect, and the timing is non-deterministic across browsers and network conditions.

## Approaches Considered

| Approach | Trade-off |
|----------|-----------|
| Inline `<script>` setting `data-voted-ids` attribute on `<html>` + reading it in `useState` initializer | Causes React hydration mismatch warnings because server HTML has `aria-pressed="false"` but client initial render has `aria-pressed="true"` |
| `__no-transitions` stylesheet injected before hydration, removed after via `HydrationReady` component | Non-deterministic timing — works ~20% of the time, fails when React's commit happens before the stylesheet blocks transitions |
| `useSyncExternalStore` with server snapshot `false` | Same flicker — the server snapshot is `false`, client snapshot updates to `true` after hydration, which is the same as the useEffect approach |
| Making VoteButton a server component with vote state from DB | Would require authenticated sessions to know who voted; current design uses anonymous localStorage tokens |
| Passing URL search params as server component props to filter/sort UI | nuqs client hooks need to own the state for two-way binding; passing server props creates a split-brain between server-rendered value and client state |

## Current State

Accepted as-is. The flicker is a cosmetic issue that doesn't affect functionality. The vote button, sort select, and status tabs all settle to the correct state within one frame after hydration.

If this becomes a priority, the most promising direction would be to explore whether nuqs supports server-side rendering of the initial URL state through its adapter, or to restructure the filter UI as server components that receive parsed search params as props (at the cost of losing nuqs's client-side state management for those controls).
