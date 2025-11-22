console.log('TraceTrail Content Script loaded on:', window.location.hostname);

// Detect platform
const platform = detectPlatform();
let isMonitoring = false;
let trackerOverlay = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received:', request.type);

  switch (request.type) {
    case 'MONITORING_STARTED':
      startPageMonitoring(request.platform);
      sendResponse({ success: true });
      break;

    case 'MONITORING_STOPPED':
      stopPageMonitoring();
      sendResponse({ success: true });
      break;

    case 'TRACKERS_DETECTED':
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

function startPageMonitoring(detectedPlatform) {
  console.log(`Starting page monitoring for ${detectedPlatform}`);
  isMonitoring = true;

  // Track page interactions
  document.addEventListener('click', handleClick);
  document.addEventListener('scroll', handleScroll);

  // Monitor DOM changes
  observeDOMChanges();

  // Analyze page content
  analyzePage();

  // Show monitoring indicator
  showMonitoringIndicator();
}

function stopPageMonitoring() {
  console.log('Stopping page monitoring');
  isMonitoring = false;

  document.removeEventListener('click', handleClick);
  document.removeEventListener('scroll', handleScroll);

  removeMonitoringIndicator();
}

function handleClick(event) {
  if (!isMonitoring) return;

  const target = event.target;
  const activity = {
    type: 'click',
    element: target.tagName,
    text: target.innerText?.substring(0, 50),
    classes: Array.from(target.classList),
    timestamp: Date.now()
  };

  // Send to background script
  chrome.runtime.sendMessage({
    type: 'TRACK_ACTIVITY',
    data: activity
  });
}

let scrollTimeout;
function handleScroll() {
  if (!isMonitoring) return;

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const activity = {
      type: 'scroll',
      scrollY: window.scrollY,
      scrollPercentage: (window.scrollY / document.body.scrollHeight) * 100,
      timestamp: Date.now()
    };
    chrome.runtime.sendMessage({
      type: 'TRACK_ACTIVITY',
      data: activity
    });
  }, 500);
}

function observeDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    if (!isMonitoring) return;

    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        detectTrackersInNewContent(mutation.addedNodes);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function detectTrackersInNewContent(nodes) {
  nodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Check for tracking scripts
      if (node.tagName === 'SCRIPT') {
        const src = node.getAttribute('src');
        if (src) {
          chrome.runtime.sendMessage({ type: 'DETECT_TRACKERS', url: src });
        }
      }

      // Check for tracking pixels
      if (node.tagName === 'IMG' && node.width === 1 && node.height === 1) {
        chrome.runtime.sendMessage({ type: 'DETECT_TRACKERS', url: node.src });
      }
    }
  });
}

function analyzePage() {
  const analysis = {
    platform,
    url: window.location.href,
    title: document.title,
    scripts: Array.from(document.scripts).map(s => s.src).filter(Boolean),
    iframes: Array.from(document.querySelectorAll('iframe')).map(i => i.src).filter(Boolean),
    cookies: document.cookie.split(';').length,
    localStorage: Object.keys(localStorage).length,
    timestamp: Date.now()
  };

  console.log('Page analysis:', analysis);

  chrome.runtime.sendMessage({
    type: 'TRACK_ACTIVITY',
    data: { type: 'page_analysis', ...analysis }
  });
}

function showMonitoringIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'tracetrail-indicator';
  indicator.innerHTML = `
    <div>
      <span></span>
      TraceTrail Monitoring
    </div>
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    </style>
  `;
  document.body.appendChild(indicator);

  indicator.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
  });
}

function removeMonitoringIndicator() {
  const indicator = document.getElementById('tracetrail-indicator');
  if (indicator) indicator.remove();
}

function showTrackerOverlay(trackers) {
  if (trackerOverlay) trackerOverlay.remove();

  trackerOverlay = document.createElement('div');
  trackerOverlay.innerHTML = `
    <div>
      <div>
        <div>
          <span>⚠️</span>
          <strong>Trackers Detected</strong>
        </div>
        <p>${trackers.length} tracking request(s) blocked</p>
        <div>
          ${trackers.map(t => `<div>${t.domain}</div>`).join('')}
        </div>
        <button id="close-tracker-overlay" style="
          width: 100%;
          padding: 8px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          font-size: 12px;
        ">
          Close
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(trackerOverlay);

  document.getElementById('close-tracker-overlay').addEventListener('click', () => {
    trackerOverlay.remove();
    trackerOverlay = null;
  });

  // Auto-close after 10 seconds
  setTimeout(() => {
    if (trackerOverlay) {
      trackerOverlay.remove();
      trackerOverlay = null;
    }
  }, 10000);
}

// Initialize
if (platform !== 'unknown') {
  console.log(`Platform detected: ${platform}`);
  chrome.runtime.sendMessage({ type: 'PLATFORM_DETECTED', platform });
}
