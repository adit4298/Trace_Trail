import { renderDashboard } from './dashboard.js';
import { initSettingsPanel } from './settings.js';
import { MESSAGE_TYPES } from '../utils/constants.js';

function showBanner(message, variant = 'success') {
  const banner = document.getElementById('status-banner');
  if (!banner) return;
  banner.textContent = message;
  banner.className = `status-banner ${variant} is-visible`;
  setTimeout(() => banner.classList.remove('is-visible'), 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
  await renderDashboard(showBanner);
  initSettingsPanel(showBanner);

  document.getElementById('sync-now')?.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SYNC_DATA }, () => {
      showBanner('Sync requested', 'success');
    });
  });

  document.getElementById('open-dashboard')?.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://app.tracetrail.com/dashboard' });
  });
});
