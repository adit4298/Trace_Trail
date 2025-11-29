import { TrackerDetector } from './tracker-detector.js';
import { PageAnalyzer } from './page-analyzer.js';
import { MESSAGE_TYPES } from '../utils/constants.js';

const trackerDetector = new TrackerDetector();
const pageAnalyzer = new PageAnalyzer();
const platform = detectPlatform();
let trackerOverlay = null;
let isMonitoring = false;
let scrollTimeout;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case MESSAGE_TYPES.MONITORING_STARTED:
      startPageMonitoring(request.platform);
      sendResponse({ success: true });
      break;
    case MESSAGE_TYPES.MONITORING_STOPPED:
      stopPageMonitoring();
      sendResponse({ success: true });
      break;
    case MESSAGE_TYPES.TRACKERS_DETECTED:
      showTrackerOverlay(request.trackers);
      sendResponse({ success: true });
      break;
    default:
      sendResponse({ error: 'Unknown message type' });
  }
  return true;
});

function detectPlatform() {
  const hostname = window.location.hostname;
  if (hostname.includes('facebook.com')) return 'facebook';
  if (hostname.includes('instagram.com')) return 'instagram';
  if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
  if (hostname.includes('linkedin.com')) return 'linkedin';
  return 'unknown';
}

function startPageMonitoring(currentPlatform) {
  isMonitoring = true;
  document.addEventListener('click', handleClick);
  document.addEventListener('scroll', handleScroll, { passive: true });
  observeDOMChanges();
  analyzePage(currentPlatform);
  showMonitoringIndicator();
}

function stopPageMonitoring() {
  isMonitoring = false;
  document.removeEventListener('click', handleClick);
  document.removeEventListener('scroll', handleScroll);
  removeMonitoringIndicator();
}

function handleClick(event) {
  if (!isMonitoring) return;
  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.TRACK_ACTIVITY,
    data: {
      type: 'click',
      element: event.target.tagName,
      text: event.target.innerText?.substring(0, 60),
      classes: Array.from(event.target.classList),
      timestamp: Date.now()
    }
  });
}

function handleScroll() {
  if (!isMonitoring) return;
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.TRACK_ACTIVITY,
      data: {
        type: 'scroll',
        scrollY: Math.round(window.scrollY),
        scrollPercentage: Math.round((window.scrollY / document.body.scrollHeight) * 100),
        timestamp: Date.now()
      }
    });
  }, 350);
}

function observeDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    if (!isMonitoring) return;
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        detectTrackers(mutation.addedNodes);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function detectTrackers(nodes) {
  nodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName === 'SCRIPT') {
      const src = node.getAttribute('src');
      if (src && trackerDetector.isTracker(src)) {
        chrome.runtime.sendMessage({ type: MESSAGE_TYPES.DETECT_TRACKERS, url: src });
      }
    }
    if (node.tagName === 'IMG' && node.width <= 1 && node.height <= 1) {
      chrome.runtime.sendMessage({ type: MESSAGE_TYPES.DETECT_TRACKERS, url: node.src });
    }
    if (node.tagName === 'IFRAME') {
      const src = node.getAttribute('src');
      if (src && trackerDetector.isTracker(src)) {
        chrome.runtime.sendMessage({ type: MESSAGE_TYPES.DETECT_TRACKERS, url: src });
      }
    }
  });
}

function analyzePage(currentPlatform) {
  const analysis = pageAnalyzer.analyze();
  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.TRACK_ACTIVITY,
    data: { type: 'page_analysis', platform: currentPlatform, ...analysis }
  });
}

function showMonitoringIndicator() {
  removeMonitoringIndicator();
  const indicator = document.createElement('div');
  indicator.id = 'tracetrail-indicator';
  indicator.innerHTML = `
    <span></span>
    <div>
      <strong>TraceTrail monitoring</strong>
      <small>${platform} session</small>
    </div>
  `;
  indicator.addEventListener('click', () => chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SYNC_DATA }));
  document.body.appendChild(indicator);
}

function removeMonitoringIndicator() {
  document.getElementById('tracetrail-indicator')?.remove();
}

function showTrackerOverlay(trackers) {
  if (trackerOverlay) trackerOverlay.remove();
  trackerOverlay = document.createElement('div');
  trackerOverlay.className = 'tracetrail-overlay';
  trackerOverlay.innerHTML = `
    <div class="tracetrail-overlay__card">
      <div class="tracetrail-overlay__badge">Trackers detected</div>
      <p style="margin: 12px 0">${trackers.length} request(s) from known tracking domains were blocked.</p>
      <div class="tracetrail-overlay__list">
        ${trackers.map(
          (tracker) => `
            <div class="tracetrail-overlay__item">
              <strong>${tracker.domain}</strong>
              <span>${tracker.type ?? 'tracker'}</span>
            </div>
          `
        ).join('')}
      </div>
      <button class="tracetrail-overlay__CTA" id="dismiss-tracetrail-overlay">
        Got it
      </button>
    </div>
  `;
  trackerOverlay.querySelector('#dismiss-tracetrail-overlay')?.addEventListener('click', () => {
    trackerOverlay?.remove();
    trackerOverlay = null;
  });
  document.body.appendChild(trackerOverlay);
  setTimeout(() => {
    trackerOverlay?.remove();
    trackerOverlay = null;
  }, 12_000);
}

if (platform !== 'unknown') {
  chrome.runtime.sendMessage({ type: MESSAGE_TYPES.PLATFORM_DETECTED, platform });
}

