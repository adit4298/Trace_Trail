import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants.js';

const areaMap = {
  local: chrome.storage?.local,
  sync: chrome.storage?.sync
};

function read(area, key) {
  return new Promise((resolve, reject) => {
    area.get(key, (result) => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      resolve(key ? result[key] : result);
    });
  });
}

function write(area, entries) {
  return new Promise((resolve, reject) => {
    area.set(entries, () => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      resolve(entries);
    });
  });
}

function remove(area, key) {
  return new Promise((resolve, reject) => {
    area.remove(key, () => {
      if (chrome.runtime.lastError) {
        return reject(new Error(chrome.runtime.lastError.message));
      }
      resolve();
    });
  });
}

export const storage = {
  async get(key, scope = 'local') {
    const area = areaMap[scope];
    return read(area, key);
  },

  async set(key, value, scope = 'local') {
    const area = areaMap[scope];
    return write(area, { [key]: value });
  },

  async remove(key, scope = 'local') {
    const area = areaMap[scope];
    return remove(area, key);
  }
};

export async function getSettings() {
  const stored = await storage.get(STORAGE_KEYS.SETTINGS, 'sync');
  return {
    ...DEFAULT_SETTINGS,
    ...(stored ?? {})
  };
}

export async function saveSettings(nextSettings) {
  const toPersist = {
    ...DEFAULT_SETTINGS,
    ...(await getSettings()),
    ...nextSettings
  };
  await storage.set(STORAGE_KEYS.SETTINGS, toPersist, 'sync');
  return toPersist;
}

export function observeSettings(callback) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return;
    if (!changes[STORAGE_KEYS.SETTINGS]) return;
    callback(changes[STORAGE_KEYS.SETTINGS].newValue ?? DEFAULT_SETTINGS);
  });
}
