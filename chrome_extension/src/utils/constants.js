export const API_BASE_URL = 'https://api.tracetrail.com';
export const FALLBACK_API_BASE_URL = 'http://localhost:8000';
export const API_TIMEOUT = 15_000;
export const SYNC_INTERVAL = 15; // minutes

export const STORAGE_KEYS = {
  AUTH: 'tracetrail::auth',
  SETTINGS: 'tracetrail::settings',
  DASHBOARD_CACHE: 'tracetrail::dashboard-cache',
  TRACKER_CACHE: 'tracetrail::tracker-cache'
};

export const DEFAULT_SETTINGS = {
  apiBaseUrl: API_BASE_URL,
  autoMonitor: true,
  blockTrackers: true,
  telemetry: true,
  extensionUserId: null,
  lastKnownVersion: chrome.runtime?.getManifest()?.version ?? '1.0.0'
};

export const SUPPORTED_PLATFORMS = {
  facebook: { hostname: 'facebook.com', icon: 'icons/icon48.png' },
  instagram: { hostname: 'instagram.com', icon: 'icons/icon48.png' },
  twitter: { hostname: 'twitter.com', icon: 'icons/icon48.png' },
  linkedin: { hostname: 'linkedin.com', icon: 'icons/icon48.png' }
};

export const MESSAGE_TYPES = {
  START_MONITORING: 'START_MONITORING',
  STOP_MONITORING: 'STOP_MONITORING',
  TRACK_ACTIVITY: 'TRACK_ACTIVITY',
  DETECT_TRACKERS: 'DETECT_TRACKERS',
  MONITORING_STARTED: 'MONITORING_STARTED',
  MONITORING_STOPPED: 'MONITORING_STOPPED',
  TRACKERS_DETECTED: 'TRACKERS_DETECTED',
  SYNC_DATA: 'SYNC_DATA',
  PLATFORM_DETECTED: 'PLATFORM_DETECTED'
};

export const TRACKER_DOMAINS = [
  'doubleclick.net',
  'googleadservices.com',
  'googletagmanager.com',
  'google-analytics.com',
  'facebook.com/tr',
  'connect.facebook.net',
  'analytics.twitter.com',
  'ads-twitter.com',
  'platform.linkedin.com',
  'snapads.com',
  'mixpanel.com',
  'hotjar.com'
];

export function normalizeUrl(url) {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
}
