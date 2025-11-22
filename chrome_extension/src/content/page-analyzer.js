export class PageAnalyzer {
  analyze() {
    return {
      // Page metadata
      url: window.location.href,
      title: document.title,
      hostname: window.location.hostname,

      // Privacy indicators
      hasHTTPS: window.location.protocol === 'https:',
      cookieCount: this.getCookieCount(),
      localStorageCount: this.getLocalStorageCount(),

      // Content analysis
      scriptCount: document.scripts.length,
      iframeCount: document.querySelectorAll('iframe').length,
      imageCount: document.querySelectorAll('img').length,

      // Forms (potential data collection)
      formCount: document.forms.length,
      inputFields: this.analyzeInputFields(),

      // Privacy policy
      hasPrivacyPolicy: this.hasPrivacyPolicyLink(),

      // Meta tags
      metaTags: this.getMetaTags(),

      timestamp: Date.now()
    };
  }

  getCookieCount() {
    return document.cookie.split(';').filter(c => c.trim()).length;
  }

  getLocalStorageCount() {
    try {
      return Object.keys(localStorage).length;
    } catch {
      return 0;
    }
  }

  analyzeInputFields() {
    const inputs = Array.from(document.querySelectorAll('input'));
    const sensitive = ['password', 'email', 'ssn', 'credit', 'card'];
    return {
      total: inputs.length,
      types: inputs.map(i => i.type),
      sensitiveCount: inputs.filter(i =>
        sensitive.some(s => i.type.includes(s) || i.name.includes(s))
      ).length
    };
  }

  hasPrivacyPolicyLink() {
    const links = Array.from(document.querySelectorAll('a'));
    return links.some(link =>
      /privacy|policy/i.test(link.textContent) ||
      /privacy|policy/i.test(link.href)
    );
  }

  getMetaTags() {
    const metas = Array.from(document.querySelectorAll('meta'));
    const tags = {};
    metas.forEach(meta => {
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      const content = meta.getAttribute('content');
      if (name && content) {
        tags[name] = content;
      }
    });
    return tags;
  }
}
