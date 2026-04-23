/**
 * Sarkari Yojna Finder — Main Application (v2)
 * Features: Card flip, Hindi/English, Admin analytics
 */

const App = {
  schemesData: null,
  matcher: null,
  currentResults: [],

  /**
   * Initialize application
   */
  async init() {
    LangManager.init();
    await this.loadSchemes();
    this.bindFormEvents();
    this.renderSchemePreview();
    this.updateVisitorCount();
    this.updateLangButtons();
    CookieManager.init();

    // Track page view for admin
    if (typeof AdminPanel !== 'undefined') {
      AdminPanel.trackPageView();
    }

    // Check if already unlocked
    if (CookieManager.isUnlocked()) {
      this.showUnlockedState();
    }
  },

  /**
   * Load schemes data
   */
  async loadSchemes() {
    try {
      const response = await fetch('data/schemes.json');
      this.schemesData = await response.json();
      this.matcher = new SchemeMatcher(this.schemesData);
    } catch (error) {
      console.error('Failed to load schemes:', error);
    }
  },

  /**
   * Bind form events
   */
  bindFormEvents() {
    const form = document.getElementById('eligibility-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSearch();
    });
  },

  /**
   * Handle search
   */
  handleSearch() {
    if (!this.matcher) return;

    const profile = this.getFormData();
    const results = this.matcher.match(profile);
    this.currentResults = results;

    // Track in admin panel
    if (typeof AdminPanel !== 'undefined') {
      AdminPanel.trackSearch(profile, results.length);
    }

    // Track in cookie manager analytics
    CookieManager.trackEvent('search', {
      occupation: profile.occupation,
      category: profile.category,
      results_count: results.length
    });

    this.renderResults(results, profile);

    setTimeout(() => {
      document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  },

  /**
   * Get form data
   */
  getFormData() {
    return {
      age: document.getElementById('age').value,
      gender: document.getElementById('gender').value,
      state: document.getElementById('state').value,
      income: document.getElementById('income').value,
      occupation: document.getElementById('occupation').value,
      category: document.getElementById('category').value,
      isStudent: document.getElementById('isStudent').checked,
      hasLand: document.getElementById('hasLand').checked,
      hasHouse: document.getElementById('hasHouse').checked,
      isRural: document.getElementById('isRural').checked,
      hasRationCard: document.getElementById('hasRationCard').checked
    };
  },

  /**
   * Render results with card flip
   */
  renderResults(results, profile) {
    const section = document.getElementById('results');
    const grid = document.getElementById('results-grid');
    const title = document.getElementById('results-title');
    const subtitle = document.getElementById('results-subtitle');
    const total = document.getElementById('results-total');
    const paywall = document.getElementById('paywall');
    const noResults = document.getElementById('no-results');

    section.style.display = 'block';

    if (results.length === 0) {
      grid.innerHTML = '';
      paywall.style.display = 'none';
      noResults.style.display = 'block';
      title.innerHTML = `<span data-i18n="noResults">${LangManager.t('noResults')}</span>`;
      subtitle.textContent = '';
      total.textContent = '';
      return;
    }

    noResults.style.display = 'none';

    const totalBenefit = this.matcher.getTotalBenefit(results);
    const totalFormatted = totalBenefit >= 100000
      ? `₹${(totalBenefit / 100000).toFixed(1)} Lakh+`
      : `₹${totalBenefit.toLocaleString()}+`;

    title.innerHTML = `${LangManager.t('resultsFound')} <span>${results.length}</span> ${LangManager.t('resultsSchemes')}`;
    subtitle.textContent = `${LangManager.t('resultsBasedOn')} ${this.formatOccupation(profile.occupation)}, ${profile.category.toUpperCase()}, ${LangManager.t('labelAge')} ${profile.age}`;
    total.textContent = `${LangManager.t('totalBenefit')} ${totalFormatted}`;

    const isUnlocked = CookieManager.isUnlocked();

    grid.innerHTML = results.map((scheme, index) => {
      const isFirst = index === 0;
      const isCardUnlocked = isFirst || isUnlocked;
      return this.renderFlipCard(scheme, isCardUnlocked, isFirst);
    }).join('');

    if (isUnlocked) {
      paywall.style.display = 'none';
    } else {
      paywall.style.display = 'block';
    }
  },

  /**
   * Render a flip card
   */
  renderFlipCard(scheme, isUnlocked, isFirst) {
    const category = this.getCategoryInfo(scheme.category);
    const matchPercent = Math.round(scheme.matchScore || 0);

    if (isUnlocked) {
      return `
        <div class="flip-card-container" onclick="App.flipCard(this)">
          <div class="flip-card">
            <div class="flip-card-front unlocked">
              <div class="card-header">
                <span class="card-category">${category.icon} ${category.name}</span>
                <span class="card-score">${matchPercent}% ${LangManager.t('match')}</span>
              </div>
              <h3 class="card-name">${scheme.name}</h3>
              <div class="card-benefit">${scheme.benefit}</div>
              <p class="card-description">${scheme.description}</p>
              <p class="card-ministry">${LangManager.t('ministry')} ${scheme.ministry}</p>
              <div class="flip-hint">
                <span class="flip-hint-icon">🔄</span> ${LangManager.t('lockText').replace('🔒 ', '')}
              </div>
            </div>
            <div class="flip-card-back">
              <div class="back-header">
                <span class="back-title">${scheme.name}</span>
                <button class="back-flip-btn" onclick="event.stopPropagation(); App.flipCard(this.closest('.flip-card-container'))">↩</button>
              </div>
              <div class="back-benefit">${scheme.benefit}</div>
              <div class="back-section">
                <h4>${LangManager.t('docsRequired')}</h4>
                <ul>
                  ${scheme.documents.map(doc => `<li>${doc}</li>`).join('')}
                </ul>
              </div>
              <div class="back-section back-match">
                <h4>${LangManager.t('whyMatch')}</h4>
                <ul>
                  ${(scheme.matchReasons || []).map(r => `<li>${r}</li>`).join('')}
                </ul>
              </div>
              <a href="${scheme.applyLink}" target="_blank" rel="noopener noreferrer" class="back-apply" onclick="event.stopPropagation()">
                ${LangManager.t('btnApply')}
              </a>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="flip-card-container" onclick="App.flipCard(this)">
          <div class="flip-card">
            <div class="flip-card-front locked">
              <div class="card-header">
                <span class="card-category">${category.icon} ${category.name}</span>
                <span class="card-score">${matchPercent}% ${LangManager.t('match')}</span>
              </div>
              <h3 class="card-name">${scheme.name}</h3>
              <div class="card-benefit">${scheme.benefit}</div>
              <p class="card-description">${scheme.description.substring(0, 100)}...</p>
              <p class="card-ministry">${LangManager.t('ministry')} ${scheme.ministry}</p>
              <div class="lock-overlay">
                <span class="lock-icon">${LangManager.t('lockIcon')}</span>
                <span class="lock-text">${LangManager.t('lockText')}</span>
                <span class="lock-hint">Tap to see preview</span>
              </div>
              <div class="flip-hint">
                <span class="flip-hint-icon">🔄</span> Tap to flip
              </div>
            </div>
            <div class="flip-card-back locked-back">
              <span class="locked-icon">🔒</span>
              <h3>${LangManager.t('paywallTitle')}</h3>
              <p>${LangManager.t('paywallDesc')}</p>
              <ul class="locked-features">
                <li>${LangManager.t('feature1')}</li>
                <li>${LangManager.t('feature2')}</li>
                <li>${LangManager.t('feature3')}</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    }
  },

  /**
   * Flip a card
   */
  flipCard(container) {
    const card = container.querySelector('.flip-card');
    if (card) {
      card.classList.toggle('flipped');
    }
  },

  /**
   * Render scheme preview
   */
  renderSchemePreview() {
    const container = document.getElementById('schemes-preview');
    if (!container || !this.schemesData) return;

    const popular = this.schemesData.schemes
      .filter(s => s.isPopular)
      .slice(0, 6);

    container.innerHTML = popular.map(scheme => {
      const category = this.getCategoryInfo(scheme.category);
      return `
        <div class="scheme-preview">
          <div class="preview-icon">${category.icon}</div>
          <h3>${scheme.name}</h3>
          <div class="preview-benefit">${scheme.benefit}</div>
          <p>${scheme.description.substring(0, 120)}...</p>
          <a href="#check" class="preview-apply" data-i18n="checkEligibility">${LangManager.t('checkEligibility')}</a>
        </div>
      `;
    }).join('');
  },

  /**
   * Get category info
   */
  getCategoryInfo(categoryId) {
    if (!this.schemesData || !this.schemesData.categories) {
      return { name: categoryId, icon: '📋' };
    }
    return this.schemesData.categories.find(c => c.id === categoryId) || { name: categoryId, icon: '📋' };
  },

  /**
   * Format occupation
   */
  formatOccupation(occ) {
    return LangManager.t(`occ_${occ}`) || occ;
  },

  /**
   * Update visitor count
   */
  updateVisitorCount() {
    const el = document.getElementById('visitor-count');
    if (!el) return;
    const hour = new Date().getHours();
    const base = hour < 6 ? 800 : hour < 12 ? 3200 : hour < 18 ? 5500 : 4100;
    const variation = Math.floor(Math.random() * 500);
    el.textContent = (base + variation).toLocaleString();
  },

  /**
   * Update language button states
   */
  updateLangButtons() {
    const enBtn = document.getElementById('lang-en');
    const hiBtn = document.getElementById('lang-hi');
    if (enBtn) enBtn.classList.toggle('active', LangManager.currentLang === 'en');
    if (hiBtn) hiBtn.classList.toggle('active', LangManager.currentLang === 'hi');
  },

  /**
   * Show unlocked state
   */
  showUnlockedState() {
    const paywall = document.getElementById('paywall');
    if (paywall) paywall.style.display = 'none';
  }
};

// Override LangManager switchLang to also update buttons
const originalSwitchLang = LangManager.switchLang.bind(LangManager);
LangManager.switchLang = function(lang) {
  originalSwitchLang(lang);
  App.updateLangButtons();
  // Re-render results if visible
  if (App.currentResults.length > 0) {
    const profile = App.getFormData();
    App.renderResults(App.currentResults, profile);
  }
  App.renderSchemePreview();
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

if (typeof window !== 'undefined') {
  window.App = App;
  window.scrollToSection = scrollToSection;
}
