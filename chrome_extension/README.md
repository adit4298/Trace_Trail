# TraceTrail Chrome Extension

Privacy intelligence companion for the TraceTrail platform. The extension
monitors social platforms in real time, blocks known trackers, and streams
low-latency telemetry back to the TraceTrail backend so users can see their risk
surface evolve inside the main dashboard.

## Features

- **Per-tab monitoring** for Facebook, Instagram, X/Twitter, and LinkedIn.
- **Tracker detection & optional blocking** using a curated list of analytics,
  ad-tech, and social widget domains.
- **On-device insights** – popup surfaces risk score, tracker events, connection
  health, and last sync status.
- **Secure syncing** with TraceTrail APIs (supports local + production hosts).
- **Granular settings** stored via `chrome.storage.sync` so preferences replicate
  across signed-in browsers.

## Project structure

```
chrome_extension/
├── manifest.json           # Chrome MV3 manifest
├── public/                 # Static assets copied as-is to /dist
│   ├── popup.html / popup.css / content.css
│   └── icons/
├── src/
│   ├── background/         # Service worker + helpers
│   ├── content/            # Scripts injected into social media sites
│   ├── popup/              # Popup UI logic (dashboard + settings)
│   └── utils/              # Shared constants, auth, storage, API helpers
├── webpack.config.js       # Bundles background/content/popup entrypoints
└── package.json
```

## Getting started

1. Install dependencies

   ```bash
   cd chrome_extension
   npm install
   ```

2. Build the extension (outputs to `dist/`)

   ```bash
   # Production bundle
   npm run build

   # or live development bundle
   npm run dev
   ```

3. Load in Chrome / Edge

   - Open `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the `chrome_extension/dist` directory

## Configuration

| Setting              | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| API base URL         | Defaults to `https://api.tracetrail.com`. Point to local backend by entering `http://localhost:8000`. |
| Access token         | Paste an access token from the TraceTrail dashboard (or a service account token) to authorize syncs. |
| Auto monitoring      | When enabled, the extension begins capturing activity as soon as you land on a supported domain. |
| Block known trackers | Uses the curated block list in `src/content/tracker-detector.js` to cancel telemetry requests. |
| Share telemetry      | Toggles whether captured events are batched and POSTed to `/api/extension/sync`. |

All preferences are stored via `chrome.storage.sync` so they roam with the user.

## Connecting to the backend

The extension interacts with the TraceTrail backend via the following endpoints:

- `POST /api/extension/users` – register an extension profile.
- `POST /api/extension/users/{id}/connections` – persist per-platform metadata.
- `POST /api/extension/sync` – upload batched session and tracker data.
- `GET /api/analysis/summary` – fetch the dashboard overview rendered in popup.

Update `src/utils/api.js` if backend routes change. The helper automatically
handles retries, exponential backoff, and token refresh logic.

## Development tips

- Use `npm run dev` while iterating: webpack rebuilds automatically and you can
  click “Reload” in `chrome://extensions`.
- Chrome restricts service-worker lifetime. The `ServiceWorkerManager` keeps the
  worker alive during active monitoring sessions; watch the DevTools “service
  workers” panel if you see unexpected unloads.
- Records stored in `chrome.storage.local` (activity cache, tracker log, last
  summary) can be inspected via DevTools → Application → Storage.
- Lint via `npm run lint`. Tests (`npm run test`) are stubbed so you can add
  Jest specs for critical logic (parsers, tracker detection, etc.).

## Distribution

`npm run build` produces a production bundle in `dist/` that can be zipped and
uploaded to the Chrome Web Store. Remember to update `manifest.json` version and
attach release notes in the main TraceTrail repository for traceability.
