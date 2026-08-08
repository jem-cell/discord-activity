# Research: Discord Embedded App SDK — how Activities work

> Resolves ticket **#3** (Research: Embedded App SDK mechanics). Sources: Discord's official developer docs (Activities section), fetched 2026-08-08.

## What an Activity is

- Activities are **web apps hosted in an iframe** inside the Discord client (desktop, mobile, web). They communicate with Discord via the **postMessage protocol**; the **Embedded App SDK** (`@discord/embedded-app-sdk`) manages that protocol for you.
- The SDK is intended for a **single-page application** (SPA). Frameworks like React/Vue are the norm; the official starter uses React/Vite.
- Source: https://discord.com/developers/docs/activities/overview, .../how-activities-work

## Tech stack (from the official "Build Your First Activity" guide)

- **Frontend**: SPA (React/Vue/vanilla JS) built with **Vite**.
- **Backend**: typically **Node.js + Express** (serves the app + handles OAuth token exchange). You can use any backend you like.
- **Official starter**: `discord/getting-started-activity` (a `client/` + `server/` split).
- **Local dev**: `cloudflared` tunnel to expose localhost to the internet.
- Source: https://discord.com/developers/docs/activities/building-an-activity

## Lifecycle & auth

1. **Init**: the iframe loads with unique query params; construct `new DiscordSDK(CLIENT_ID)`.
2. **Handshake**: `await discordSdk.ready()` resolves once connected (READY frame).
3. **Authorize**: `discordSdk.commands.authorize({...scope:['identify']})` → returns an OAuth `code`.
4. **Exchange**: your **server** exchanges the code for an `access_token` (via `/.proxy/api/token` in the sample).
5. **Authenticate**: `discordSdk.commands.authenticate({access_token})` → gives you the user's identity.
- Source: https://discord.com/developers/docs/activities/how-activities-work

## Identifying the server (guild) — matters for per-server leaderboard

- The guide has explicit steps: **"Use the SDK to fetch the channel"** and **"Use the API to fetch the guild"**. So the Activity can determine which guild/channel it's running in — the key to a **per-server** leaderboard.
- Source: https://discord.com/developers/docs/activities/building-an-activity

## Networking / sandbox (critical for our backend)

- **All network traffic is routed through the Discord Proxy** (Cloudflare Workers). **WebRTC is not supported**; only websockets.
- The Activity is **sandboxed**: it cannot reach arbitrary external URLs. To reach your own backend, you configure a **URL Mapping** in the developer portal (e.g. prefix `/api` → target `your-backend.com`), then call `/api/...` from the app.
- **CSP exceptions** (reachable without a mapping): `https://discord.com/api/`, `canary.discord.com/api/`, `ptb.discord.com/api/`, `cdn.discordapp.com` — i.e. Discord's own API.
- Source: https://discord.com/developers/docs/activities/development-guides/networking, .../local-development

## Local development & testing

- **Localhost**: you can load the app from a localhost port, but it must be **HTTPS** on web/desktop (HTTPS not required on mobile). Traffic won't go through the proxy, so requests need full URLs, not mapped ones.
- **Recommended**: test against the proxy via a **tunnel** (`cloudflared tunnel --url http://localhost:3000`), with a **dev-only Discord application** per developer. Set the app's URL mapping `/` to the tunnel URL.
- **Launching**: enable Developer Mode in Discord → join a voice channel → click the **Rocket button** (Activity Shelf) → launch your app. The app must be flagged "Embedded" and the platform checked in Settings/Supported Platforms.
- Source: https://discord.com/developers/docs/activities/development-guides/local-development

## Production

- Host the app at a public HTTPS URL; set the URL Mapping `/` to it; enable Activities; launch from the Activity Shelf.
- **Cache-busting**: Discord's proxy strips cache headers for `text/html`; use cache-busting for JS/CSS.
- **Rate limits**: respect Discord API rate limits (429 / `retry_after`).
- **Static IP**: if your server uses a dynamic IP (cloud functions), you may inherit a Cloudflare-banned IP → egress to Discord API banned up to an hour. Prefer a static egress IP.
- Source: https://discord.com/developers/docs/activities/development-guides/production-readiness

## Security

- **Don't trust client data** (user, nitro, channel info can be falsified). For trusted data, call the Discord API from your server with the user token from OAuth.
- **Sanitize** usernames/channel names (arbitrary user input) before rendering.
- Source: https://discord.com/developers/docs/activities/development-guides/networking

## Implications for our math game

- **Architecture**: a React SPA (the Activity) + a Node/Express backend. The backend serves the app, handles OAuth token exchange, serves the daily puzzle, stores scores, and computes the per-server leaderboard + BST reset.
- **Backend reachability**: the Activity reaches our backend through a **URL Mapping** (e.g. `/api` → our backend). This is a hard requirement — the sandbox blocks direct external calls.
- **Per-server leaderboard**: feasible — the Activity can identify the guild via the SDK/API.
- **Daily puzzle**: the backend serves the day's puzzle deterministically (seeded by date in BST).
- **Testing**: the puzzle engine is pure logic → unit-testable without Discord. Live testing needs a dev-only Discord application + a cloudflared tunnel (or localhost with HTTPS).
- **Hosting**: needs a public HTTPS host for the app + backend; prefer a static egress IP for the backend.
