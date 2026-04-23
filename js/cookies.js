/**
 * Cookie Consent Manager
 * GDPR/DPDP Act compliant cookie handling
 */

const CookieManager = {
  CONSENT_KEY: 'scheme_finder_cookie_consent',
  UNLOCK_KEY: 'scheme_finder_unlocked',

  /**
   * Initialize cookie consent
   */
  init() {
    const consent = this.getConsent();
    if (!consent) {
      this.showBanner();
    } else if (consent === 'accepted') {
      this.loadAnalytics();
    }
    this.bindEvents();
  },

  /**
   * Show cookie banner
   */
  showBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.display = 'block';
      // Add padding to body to prevent content from being hidden
      document.body.style.paddingBottom = '80px';
    }
  },

  /**
   * Hide cookie banner
   */
  hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.display = 'none';
      document.body.style.paddingBottom = '';
    }
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.accept());
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => this.reject());
    }
  },

  /**
   * Accept all cookies
   */
  accept() {
    this.setConsent('accepted');
    this.hideBanner();
    this.loadAnalytics();
    this.showToast('Cookie preferences saved');
  },

  /**
   * Reject non-essential cookies
   */
  reject() {
    this.setConsent('rejected');
    this.hideBanner();
    this.showToast('Non-essential cookies disabled');
  },

  /**
   * Get stored consent
   */
  getConsent() {
    try {
      return localStorage.getItem(this.CONSENT_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Set consent value
   */
  setConsent(value) {
    try {
      localStorage.setItem(this.CONSENT_KEY, value);
    } catch {
      // localStorage not available
    }
  },

  /**
   * Check if user has unlocked results
   */
  isUnlocked() {
    try {
      const data = localStorage.getItem(this.UNLOCK_KEY);
      if (!data) return false;
      const parsed = JSON.parse(data);
      // Check if unlock is still valid (lifetime, but check for corruption)
      return parsed && parsed.unlocked === true;
    } catch {
      return false;
    }
  },

  /**
   * Set unlock status
   */
  setUnlocked(paymentId) {
    try {
      localStorage.setItem(this.UNLOCK_KEY, JSON.stringify({
        unlocked: true,
        paymentId: paymentId,
        timestamp: Date.now()
      }));
    } catch {
      // localStorage not available
    }
  },

  /**
   * Load Google Analytics (only if consented)
   */
  loadAnalytics() {
    // Replace G-XXXXXXXXXX with your actual GA4 measurement ID
    const GA_ID = 'G-XXXXXXXXXX';
    if (GA_ID === 'G-XXXXXXXXXX') return; // Not configured yet

    // Load gtag
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  },

  /**
   * Track event (only if analytics loaded)
   */
  trackEvent(eventName, params = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, params);
    }
  },

  /**
   * Show toast notification
   */
  showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Export
if (typeof window !== 'undefined') {
  window.CookieManager = CookieManager;
}
