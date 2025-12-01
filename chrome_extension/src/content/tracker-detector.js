export class TrackerDetector {
  constructor() {
    this.trackerPatterns = [
      // Analytics
      /google-analytics\.com/,
      /googletagmanager\.com/,
      /analytics\.facebook\.com/,
      /analytics\.twitter\.com/,
      // Advertising
      /doubleclick\.net/,
      /googleadservices\.com/,
      /facebook\.com\/tr/,
      /ads-twitter\.com/,
      // Tracking pixels
      /pixel\./,
      /track\./,
      /beacon\./,
      // Social widgets
      /connect\.facebook\.net/,
      /platform\.twitter\.com/,
      /platform\.linkedin\.com/
    ];
  }

  isTracker(url) {
    return this.trackerPatterns.some((pattern) => pattern.test(url));
  }

  getTrackerType(url) {
    if (/analytic/i.test(url)) return 'analytics';
    if (/ad|doubleclick/i.test(url)) return 'advertising';
    if (/pixel|beacon/i.test(url)) return 'tracking-pixel';
    if (/facebook|twitter|linkedin/i.test(url)) return 'social-widget';
    return 'unknown';
  }

  detectAll() {
    const trackers = [];

    // Check all scripts
    document.querySelectorAll('script[src]').forEach((script) => {
      const src = script.getAttribute('src');
      if (this.isTracker(src)) {
        trackers.push({
          url: src,
          type: this.getTrackerType(src),
          element: 'script'
        });
      }
    });

    // Check all images (tracking pixels)
    document.querySelectorAll('img').forEach((img) => {
      if (img.width === 1 && img.height === 1 && this.isTracker(img.src)) {
        trackers.push({
          url: img.src,
          type: 'tracking-pixel',
          element: 'img'
        });
      }
    });

    // Check iframes
    document.querySelectorAll('iframe').forEach((iframe) => {
      const src = iframe.getAttribute('src');
      if (src && this.isTracker(src)) {
        trackers.push({
          url: src,
          type: this.getTrackerType(src),
          element: 'iframe'
        });
      }
    });

    return trackers;
  }
}
