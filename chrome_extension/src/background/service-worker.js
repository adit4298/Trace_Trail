// Service Worker specific functionality
export class ServiceWorkerManager {
  constructor() {
    this.keepAliveInterval = null;
  }

  // Keep service worker alive
  startKeepAlive() {
    this.keepAliveInterval = setInterval(() => {
      console.log('Service worker keep-alive ping');
    }, 20000); // Every 20 seconds
  }

  stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  // Handle service worker lifecycle
  async handleActivate() {
    console.log('Service worker activated');
    this.startKeepAlive();
  }

  async handleDeactivate() {
    console.log('Service worker deactivated');
    this.stopKeepAlive();
  }
}

// Initialize Service Worker Manager
const swManager = new ServiceWorkerManager();
swManager.handleActivate();
