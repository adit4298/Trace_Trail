import {
  API_BASE_URL,
  FALLBACK_API_BASE_URL,
  API_TIMEOUT,
  STORAGE_KEYS
} from './constants.js';
import { getSettings, storage } from './storage.js';
import { clearAuth, getStoredAuth, saveAuth } from './auth.js';

function normalizePath(path) {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
}

async function resolveBaseUrl() {
  const settings = await getSettings();
  const configured = settings.apiBaseUrl?.trim();
  if (!configured) return API_BASE_URL;
  if (configured === 'local') {
    return FALLBACK_API_BASE_URL;
  }
  return configured;
}

async function performFetch(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  }).catch((error) => {
    clearTimeout(timeout);
    throw error;
  });

  clearTimeout(timeout);
  return response;
}

async function refreshTokenIfNeeded() {
  const auth = await getStoredAuth();
  if (!auth?.refreshToken) {
    await clearAuth();
    return null;
  }

  try {
    const baseUrl = await resolveBaseUrl();
    const response = await performFetch(
      `${baseUrl}/api/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: auth.refreshToken })
      }
    );

    if (!response.ok) {
      await clearAuth();
      return null;
    }

    const payload = await response.json();
    const nextAuth = {
      ...auth,
      token: payload.accessToken,
      refreshToken: payload.refreshToken ?? auth.refreshToken,
      expiresAt: Date.now() + (payload.expiresIn ?? 600) * 1000
    };

    await saveAuth(nextAuth);
    return nextAuth.token;
  } catch (error) {
    console.error('Failed to refresh token', error);
    await clearAuth();
    return null;
  }
}

export async function sendToAPI(path, { method = 'GET', data, headers = {}, token, skipAuth = false } = {}) {
  const baseUrl = await resolveBaseUrl();
  const url = `${baseUrl}${normalizePath(path)}`;

  let authToken = token;
  if (!skipAuth && !authToken) {
    const auth = await getStoredAuth();
    if (auth?.token) {
      authToken = auth.token;
    }
  }

  const requestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: data ? JSON.stringify(data) : undefined
  };

  if (authToken && !skipAuth) {
    requestInit.headers.Authorization = `Bearer ${authToken}`;
  }

  let response = await performFetch(url, requestInit);

  if (response.status === 401 && !skipAuth) {
    const refreshed = await refreshTokenIfNeeded();
    if (refreshed) {
      requestInit.headers.Authorization = `Bearer ${refreshed}`;
      response = await performFetch(url, requestInit);
    }
  }

  if (!response.ok) {
    const message = await response.text();
    const error = new Error(message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return response.text();
  }

  return response.json();
}

export async function fetchDashboardSummary() {
  const summary = await sendToAPI('/api/analysis/summary');
  await storage.set(
    STORAGE_KEYS.DASHBOARD_CACHE,
    { summary, cachedAt: Date.now() },
    'local'
  );
  return summary;
}

export async function fetchConnections(extensionUserId) {
  if (!extensionUserId) return [];
  return sendToAPI(`/api/extension/users/${extensionUserId}/connections`);
}

export async function registerExtensionUser(payload) {
  return sendToAPI('/api/extension/users', {
    method: 'POST',
    data: payload
  });
}

export async function pushTrackerEvents(events) {
  if (!events?.length) return null;
  return sendToAPI('/api/extension/sync', {
    method: 'POST',
    data: { sessions: events, timestamp: Date.now() }
  });
}
