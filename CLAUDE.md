# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

There is **no build step**. Open `index.html` directly in a browser, or serve with any static file server:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

The Social Kit is a separate standalone page: `ENJOY THE GAME - Social Kit.html`.

## Architecture

A zero-bundler single-page app. React 18 + Babel are loaded from CDN. All `.jsx` files use `type="text/babel"` and are transpiled in the browser at runtime. Scripts are loaded in strict dependency order in `index.html`:

```
supabase-config.js  →  sig_demo.js  →  data.js  →  cloud.js
  →  ui.jsx  →  screens_public.jsx  →  screens_register.jsx
  →  screens_live.jsx  →  screens_staff.jsx  →  screens_staff_live.jsx
  →  app.jsx
```

**Global namespace**: Components and utilities are exported onto `window` via `Object.assign(window, {...})` at the bottom of each file, making them available to files loaded after them.

### State Management (`app/data.js`)

`window.ETG.Store` is a synchronous, localStorage-backed pub/sub store. The localStorage key is `etg_state_v4` (version `etg_v5_2026_1`). Components subscribe via the `useStore()` hook in `ui.jsx`, which force-re-renders on any state change.

`window.ETG_SIG` provides demo signature images (base64 PNGs) loaded by `sig_demo.js`.

### Cloud Layer (`app/cloud.js`)

Wraps `Store.createTeam` and `Store.addRegistration` to also push to Supabase. Provides async methods used by components:

- `Store.teamCountAsync()` — public team count
- `Store.findTeamByCodeAsync(code)` — public minimal team lookup
- `Store.joinTeamAsync(code, player)` — public player join
- `Store.loadStaffAsync(pin)` — staff: load all registrations (PIN verified server-side)
- `Store.deleteRegistrationCloud(pin, id)` — staff: delete registration
- `Store.formTeamCloud(pin, teamName, soloIds, roster)` — staff: merge solo registrations into a team

All async methods fall back to local Store logic when Supabase is not configured (demo mode).

### Routing (`app/app.jsx`)

Hash-based routing (`#/home`, `#/reg-team`, `#/reg-solo`, `#/join`, `#/live`, `#/staff`). The `go(route, payload)` function sets the hash and an optional `nav` payload for inter-screen data passing (e.g. pre-filling a join form).

### Supabase Configuration (`app/supabase-config.js`)

Set `window.ETG_SUPABASE = { url, anonKey }`. When both are present and the Supabase JS library is loaded, cloud mode activates. The staff PIN is stored only in the database (`app_config` table, key `staff_pin`), never in source code.

## Tournament Data Model

Matches have `{ phase, slot, aId, bId, scoreA, scoreB, status, day, time, court }`.

**Phases** and their slot usage:
| `phase` | `slot` | Meaning |
|---------|--------|---------|
| `group1` | — | Giornata 1 group matches (groups A–D, 4 teams each) |
| `group2` | — | Giornata 2 mini-group matches (groups E–H, 3 teams each) |
| `quarti` | 0–3 | Quarterfinals; pairings: 1A-1H, 1B-1G, 1C-1F, 1D-1E |
| `semi` | 0–1 | Semifinals; SF0 = Q0 winner vs Q2 winner, SF1 = Q1 winner vs Q3 winner |
| `finale` | 0 | 3rd/4th place match (losers of semis) |
| `finale` | 1 | Championship final (winners of semis) |

**Standings** are computed live from match results (2 pts win, 1 pt loss, basket diff as tiebreaker). Day 2 mini-group formula is fixed: E=[2A,4C,3D], F=[2B,4D,3A], G=[2C,4A,3B], H=[2D,4B,3C].

## Key Files

| File | Purpose |
|------|---------|
| `app/data.js` | Store, tournament generation (`drawGroups`, `generateDay2`, `generateBracket`), standings, `advanceBracket` equivalents |
| `app/cloud.js` | Supabase integration; wraps Store writes, provides async methods |
| `app/ui.jsx` | Shared primitives: `useStore`, `Ic` (icon set), `Btn`, `Field`, `Text`, `Select`, `Seg`, `SignaturePad`, `Sheet`, `useToast`, `Avatar` |
| `app/screens_staff_live.jsx` | Staff live interface: score entry, `advanceBracket()` (winner/loser routing through bracket phases), bracket generation UI |
| `app/screens_live.jsx` | Public live area: `PhaseLabel(phase, slot)` — returns display strings like "Finale 3°/4°" (slot 0) vs "Finale 🏆" (slot 1) |
| `app/screens_staff.jsx` | Staff registration management + NOI document generation (legally required association membership forms) |
| `db/setup.sql` | Full Supabase schema: tables `registrations`, `app_config`; RLS policies; RPCs (`team_count`, `find_team_by_code`, `join_team`, `staff_list`, `staff_delete`, `staff_form_team`, `staff_form_team`) |
| `db/README.md` | Step-by-step Supabase setup guide |

## Privacy Model

- **Public** can: insert registrations, count teams, search by team code, add a player to a team.
- **Staff** (PIN verified server-side) can: read full registrations (personal data, tax codes, signatures), delete, merge solo players into teams.
- Sensitive data is never exposed via public Supabase RPCs.
