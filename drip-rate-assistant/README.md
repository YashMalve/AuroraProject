# Drip Rate Assistant — React + Node Starter

This repository was converted from a plain static site into a small React + Node structure to improve modularity and optimization.

What I added:
- Node Express server at `server/index.js` with a small `/api/parkland` endpoint that mirrors the Parkland calculation.
- React client skeleton under `client/` (Vite) with core components ported from the legacy JS.
- Root `package.json` with simple scripts to run the server and client.

Getting started (local dev):

1. Install server dependencies (from repo root):

```bash
cd /Users/yashmalve/Desktop/CLgpro/drip-rate-assistant
npm install
```

2. Install client dependencies and start dev server (in new terminal):

```bash
cd client
npm install
npm run dev
```

3. Start the Node server (optional; the client dev server will proxy API requests if configured):

```bash
npm run start
```

Notes:
- The new React client is scaffolded with Vite. I included core components for Parkland, Tracker and a simple Burn/TBSA input. Styles can be copied from the original `css/style.css` or further modularized into CSS Modules.
- If you want the server and client to run concurrently, consider adding `concurrently` to the root `package.json` and a `dev` script that runs both.

Next steps I can do for you (pick any):
- Wire up full body-map SVG selection into the React `BurnCalculator` (I scaffolded a basic input + placeholder).
- Copy the full existing `css/style.css` into the React app and adjust selectors to work with components.
- Add tests and linting, or set up a lightweight Dockerfile for deployment.
