import { storage } from './storage.js';
import { STORAGE_KEYS } from './constants.js';

export async function getStoredAuth() {
  return (await storage.get(STORAGE_KEYS.AUTH, 'sync')) ?? null;
}

export async function saveAuth(authPayload) {
  const payload = {
    ...authPayload,
    savedAt: Date.now()
  };
  await storage.set(STORAGE_KEYS.AUTH, payload, 'sync');
  return payload;
}

export async function clearAuth() {
  await storage.remove(STORAGE_KEYS.AUTH, 'sync');
}

export function isExpired(auth) {
  if (!auth?.expiresAt) return false;
  return Date.now() >= auth.expiresAt;
}

export async function isAuthenticated() {
  const auth = await getStoredAuth();
  return Boolean(auth?.token && !isExpired(auth));
}

export async function setManualToken(token) {
  const auth = {
    token,
    manual: true,
    expiresAt: null
  };
  await saveAuth(auth);
  return auth;
}
