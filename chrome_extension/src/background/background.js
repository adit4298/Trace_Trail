import { API_BASE_URL, SYNC_INTERVAL } from '../utils/constants.js';
import { getStoredAuth, isAuthenticated } from '../utils/auth.js';
import { sendToAPI } from '../utils/api.js';

// Service Worker initialization
console.log('TraceTrail Background Service Worker loaded');

// Track active monitoring sessions
let monitoringSessions = new Map();

// Install event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('TraceTrail Extension installed');
    // Open onboarding page
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
  } else if (details.reason === 'update') {
    console.log(
      'TraceTrail Extension updated to version',
      chrome.runtime.getManifest().version
    );
  }

  // Set default alarm for periodic sync
  chrome.alarms.create('periodicSync', {
    delayInMinutes: 1,
    periodInMinutes: SYNC_INTERVAL
  });
});

// Message handler from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request.type);

  switch (request.type) {
    case 'START_MONITORING':
      startMonitoring(request.platform, sender.tab);
      sendResponse({ success: true });
      break;

    case 'STOP_MONITORING':
      stopMonitoring(request.platform);
      sendResponse({ success: true });
      break;

    case 'TRACK_ACTIVITY':
      handleActivityTracking(request.data, sender.tab);
      sendResponse({ success: true });
      break;

    case 'DETECT_TRACKERS':
      detectTrackers(request.url, sender.tab);
      sendResponse({ success: true });
      break;

    case 'SYNC_DATA':
      syncDataToBackend();
      sendResponse({ success: true });
      break;

    default:
      sendResponse({ error: 'Unknown message type' });
  }

  return true; // Keep message channel open for async response
});

// Alarm handler for periodic tasks
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'periodicSync') {
    console.log('Periodic sync triggered');
    syncDataToBackend();
  }
});

// Web request monitoring for tracker detection
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (shouldBlockRequest(details)) {
      console.log('Blocked tracking request:', details.url);
      return { cancel: true };
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);

// Functions
async function startMonitoring(platform, tab) {
  console.log(`Starting monitoring for ${platform} on tab ${tab.id}`);
  monitoringSessions.set(tab.id, {
    platform,
    startTime: Date.now(),
    activities: []
  });

  // Send message to content script
  chrome.tabs.sendMessage(tab.id, {
    type: 'MONITORING_STARTED',
    platform
  });

  // Update badge
  chrome.action.setBadgeText({ text: '️', tabId: tab.id });
  chrome.action.setBadgeBackgroundColor({ color: '#22c55e', tabId: tab.id });
}

function stopMonitoring(platform) {
  console.log(`Stopping monitoring for ${platform}`);
  monitoringSessions.forEach((session, tabId) => {
    if (session.platform === platform) {
      monitoringSessions.delete(tabId);
      chrome.action.setBadgeText({ text: '', tabId });
    }
  });
}

async function handleActivityTracking(data, tab) {
  const session = monitoringSessions.get(tab.id);
  if (!session) return;

  session.activities.push({
    ...data,
    timestamp: Date.now(),
    url: tab.url
  });
  console.log('Activity tracked:', data);

  // If authenticated, send to backend
  if (await isAuthenticated()) {
    sendActivityToBackend(data, tab);
  }
}

async function detectTrackers(url, tab) {
  const trackers = [];
  const trackerDomains = [
    'doubleclick.net',
    'google-analytics.com',
    'facebook.com/tr',
    'connect.facebook.net',
    'analytics.twitter.com',
    'ads-twitter.com'
  ];

  trackerDomains.forEach((domain) => {
    if (url.includes(domain)) {
      trackers.push({
        domain,
        url,
        type: 'analytics',
        timestamp: Date.now()
      });
    }
  });

  if (trackers.length > 0) {
    console.log('Trackers detected:', trackers);

    // Send to content script to display
    chrome.tabs.sendMessage(tab.id, {
      type: 'TRACKERS_DETECTED',
      trackers
    });

    // Update badge count
    chrome.action.setBadgeText({
      text: String(trackers.length),
      tabId: tab.id
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#ef4444',
      tabId: tab.id
    });
  }
}

function shouldBlockRequest(details) {
  const blockList = ['doubleclick.net', 'googleadservices.com'];
  return blockList.some((domain) => details.url.includes(domain));
}

async function syncDataToBackend() {
  console.log('Syncing data to backend...');
  if (!(await isAuthenticated())) {
    console.log('Not authenticated, skipping sync');
    return;
  }

  const auth = await getStoredAuth();
  const sessions = Array.from(monitoringSessions.values());

  if (sessions.length === 0) {
    console.log('No sessions to sync');
    return;
  }

  try {
    const response = await sendToAPI('/extension/sync', {
      method: 'POST',
      data: {
        sessions,
        timestamp: Date.now()
      },
      token: auth.token
    });
    console.log('Sync successful:', response);

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'TraceTrail Sync Complete',
      message: 'Your privacy data has been synced successfully.'
    });

    // Clear synced sessions
    monitoringSessions.clear();
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function sendActivityToBackend(data, tab) {
  try {
    const auth = await getStoredAuth();
    await sendToAPI('/extension/activity', {
      method: 'POST',
      data: {
        ...data,
        url: tab.url,
        title: tab.title,
        timestamp: Date.now()
      },
      token: auth.token
    });
  } catch (error) {
    console.error('Failed to send activity:', error);
  }
}

// Tab events
chrome.tabs.onRemoved.addListener((tabId) => {
  monitoringSessions.delete(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && monitoringSessions.has(tabId)) {
    // Reinject content script if needed
    console.log('Tab updated, checking monitoring session');
  }
});
