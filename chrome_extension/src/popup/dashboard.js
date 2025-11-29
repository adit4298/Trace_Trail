import { fetchDashboardSummary, fetchConnections } from '../utils/api.js';
import { getSettings, storage } from '../utils/storage.js';
import { STORAGE_KEYS } from '../utils/constants.js';

const riskScoreEl = () => document.querySelector('[data-risk-score]');
const riskTrendEl = () => document.querySelector('[data-risk-trend]');
const riskCategoryEl = () => document.querySelector('[data-risk-category]');
const socialRiskEl = () => document.querySelector('[data-social-risk]');
const dataRiskEl = () => document.querySelector('[data-data-risk]');
const privacyRiskEl = () => document.querySelector('[data-privacy-risk]');
const trackerListEl = () => document.getElementById('tracker-list');
const connectionListEl = () => document.getElementById('connection-list');

export async function renderDashboard(notify) {
  setLoading(true);
  try {
    const settings = await getSettings();
    const [summary, trackersCache] = await Promise.all([
      fetchDashboardSummary(),
      storage.get(STORAGE_KEYS.TRACKER_CACHE, 'local')
    ]);

    updateRiskCard(summary);
    updateTrackers(trackersCache?.trackers ?? []);

    if (settings.extensionUserId) {
      const connections = await fetchConnections(settings.extensionUserId);
      updateConnections(connections);
    } else {
      updateConnections([]);
    }
  } catch (error) {
    notify?.('Unable to load dashboard data. Check your token and API URL.', 'error');
    const cached = await storage.get(STORAGE_KEYS.DASHBOARD_CACHE, 'local');
    if (cached?.summary) {
      updateRiskCard(cached.summary);
    }
  } finally {
    setLoading(false);
  }
}

function updateRiskCard(summary) {
  riskScoreEl().textContent = summary?.currentScore ?? '--';
  riskTrendEl().textContent = summary?.riskCategory ?? 'No analysis yet';
  riskCategoryEl().textContent = summary?.riskCategory ?? 'N/A';
  socialRiskEl().textContent = `${summary?.socialMediaRisk ?? 0}`;
  dataRiskEl().textContent = `${summary?.dataExposureRisk ?? 0}`;
  privacyRiskEl().textContent = `${summary?.privacySettingsRisk ?? 0}`;
}

function updateTrackers(trackers) {
  const list = trackerListEl();
  list.innerHTML = '';
  if (!trackers?.length) {
    list.innerHTML = '<p class="empty-state">No tracker events detected.</p>';
    return;
  }

  trackers.slice(0, 5).forEach((tracker) => {
    const el = document.createElement('div');
    el.className = 'tracker-chip';
    let host = '';
    try {
      host = new URL(tracker.url).hostname;
    } catch {
      host = tracker.domain;
    }
    el.innerHTML = `
      <div>
        <strong>${tracker.domain}</strong>
        <span>${tracker.type ?? 'tracker'}</span>
      </div>
      <span>${host}</span>
    `;
    list.appendChild(el);
  });
}

function updateConnections(connections) {
  const list = connectionListEl();
  list.innerHTML = '';
  if (!connections?.length) {
    list.innerHTML = '<p class="empty-state">No connections linked yet.</p>';
    return;
  }

  connections.forEach((connection) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'connection';
    wrapper.innerHTML = `
      <div>
        <strong>${connection.platform}</strong>
        <div class="connection-status">${connection.status ?? 'active'}</div>
      </div>
      <span>${connection.lastSynced ? formatRelative(connection.lastSynced) : 'never'}</span>
    `;
    list.appendChild(wrapper);
  });
}

function formatRelative(dateValue) {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : new Date(dateValue ?? Date.now());
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function setLoading(state) {
  document.body.dataset.loading = state ? 'true' : 'false';
}
