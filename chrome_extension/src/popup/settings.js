import { getSettings, saveSettings } from '../utils/storage.js';
import { getStoredAuth, setManualToken } from '../utils/auth.js';

export function initSettingsPanel(notify) {
  const panel = document.getElementById('settings-panel');
  const toggleBtn = document.getElementById('toggle-settings');
  const form = document.getElementById('settings-form');
  if (!panel || !toggleBtn || !form) return;

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('is-visible');
  });

  hydrateForm(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const nextSettings = {
      apiBaseUrl: formData.get('apiBaseUrl')?.trim(),
      autoMonitor: form.elements.autoMonitor.checked,
      blockTrackers: form.elements.blockTrackers.checked,
      telemetry: form.elements.telemetry.checked,
      extensionUserId: parseInt(formData.get('extensionUserId'), 10) || null
    };
    try {
      await saveSettings(nextSettings);
      const token = formData.get('accessToken')?.trim();
      if (token) {
        await setManualToken(token);
      }
      notify?.('Settings saved', 'success');
      panel.classList.remove('is-visible');
    } catch (error) {
      console.error(error);
      notify?.('Failed to save settings', 'error');
    }
  });
}

async function hydrateForm(form) {
  const [settings, auth] = await Promise.all([getSettings(), getStoredAuth()]);
  form.elements.apiBaseUrl.value = settings.apiBaseUrl;
  form.elements.autoMonitor.checked = settings.autoMonitor;
  form.elements.blockTrackers.checked = settings.blockTrackers;
  form.elements.telemetry.checked = settings.telemetry;
  if (auth?.token && auth.manual) {
    form.elements.accessToken.value = auth.token;
  }
  form.elements.extensionUserId.value = settings.extensionUserId ?? '';
}
