/**
 * Sarkari Yojna Finder — Main Application
 */

const App = {
  schemesData: null,
  matcher: null,
  currentResults: [],

  /**
   * Initialize application
   */
  async init() {
    await this.loadSchemes();
    this.bindFormEvents();
    this.renderSchemePreview();
    this.updateVisitorCount();
    CookieManager.init();

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
      CookieManager.showToast('Failed to load scheme data. Please refresh.', 'error');
    }
  },

  /**
   * Bind form submission events
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
   * Handle search form submission
   */
  handleSearch() {
    if (!this.matcher) {
      CookieManager.showToast('Scheme data not loaded. Please refresh.', 'error');
      return;
    }

    const profile = this.getFormData();
    const results = this.matcher.match(profile);
    this.currentResults = results;

    // Show results section
    this.renderResults(results, profile);

    // Track event
    CookieManager.trackEvent('search', {
      occupation: profile.occupation,
      category: profile.category,
      results_count: results.length
    });

    // Scroll to results
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
   * Render search results
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
      title.innerHTML = 'No schemes matched your profile';
      subtitle.textContent = 'Try adjusting your details or check back later.';
      total.textContent = '';
      return;
    }

    noResults.style.display = 'none';

    // Calculate total benefit
    const totalBenefit = this.matcher.getTotalBenefit(results);
    const totalFormatted = totalBenefit >= 100000
      ? `₹${(totalBenefit / 100000).toFixed(1)} Lakh+`
      : `₹${totalBenefit.toLocaleString()}+`;

    title.innerHTML = `We found <span id="scheme-count">${results.length}</span> schemes for you!`;
    subtitle.textContent = `Based on your profile: ${this.formatOccupation(profile.occupation)}, ${profile.category.toUpperCase()}, Age ${profile.age}`;
    total.textContent = `💰 Total potential benefit: ${totalFormatted}`;

    // Determine if unlocked
    const isUnlocked = CookieManager.isUnlocked();

    // Render cards
    grid.innerHTML = results.map((scheme, index) => {
      const isFirst = index === 0;
      const isCardUnlocked = isFirst || isUnlocked;

      return this.renderSchemeCard(scheme, isCardUnlocked, isFirst);
    }).join('');

    // Show/hide paywall
    if (isUnlocked) {
      paywall.style.display = 'none';
    } else {
      paywall.style.display = 'block';
    }
  },

  /**
   * Render a single scheme card
   */
  renderSchemeCard(scheme, isUnlocked, isFirst) {
    const category = this.getCategoryInfo(scheme.category);
    const matchPercent = Math.round(scheme.matchScore || 0);

    return `
      <div class="scheme-card ${isUnlocked ? 'unlocked' : 'locked'}">
        ${!isUnlocked ? `
          <div class="lock-overlay">
            <span class="lock-icon">🔒</span>
            <span class="lock-text">Unlock to see details</span>
          </div>
        ` : ''}
        <div class="card-header">
          <span class="card-category">${category.icon} ${category.name}</span>
          <span class="card-score">${matchPercent}% match</span>
        </div>
        <h3 class="card-name">${scheme.name}</h3>
        <div class="card-benefit">${scheme.benefit}</div>
        <div class="card-details">
          <p class="card-description">${scheme.description}</p>
          <p class="card-ministry">${scheme.ministry}</p>
          ${isUnlocked ? `
            <div class="card-docs">
              <h4>📄 Documents Required:</h4>
              <ul>
                ${scheme.documents.map(doc => `<li>${doc}</li>`).join('')}
              </ul>
            </div>
            <div class="card-match-reasons">
              <h4>Why you match:</h4>
              <ul>
                ${(scheme.matchReasons || []).map(reason => `<li>${reason}</li>`).join('')}
              </ul>
            </div>
            <a href="${scheme.applyLink}" target="_blank" rel="noopener noreferrer" class="card-apply">
              Apply Now →
            </a>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render scheme preview cards on homepage
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
          <a href="#check" class="preview-apply">
            Check Eligibility →
          </a>
        </div>
      `;
    }).join('');
  },

  /**
   * Get category info by ID
   */
  getCategoryInfo(categoryId) {
    if (!this.schemesData || !this.schemesData.categories) {
      return { name: categoryId, icon: '📋' };
    }
    return this.schemesData.categories.find(c => c.id === categoryId) || { name: categoryId, icon: '📋' };
  },

  /**
   * Format occupation for display
   */
  formatOccupation(occ) {
    const map = {
      'farmer': 'Farmer',
      'student': 'Student',
      'business_owner': 'Business Owner',
      'self_employed': 'Self Employed',
      'salaried': 'Salaried',
      'unemployed': 'Unemployed',
      'daily_wage': 'Daily Wage Worker',
      'freelancer': 'Freelancer',
      'agricultural_worker': 'Agricultural Worker',
      'street_vendor': 'Street Vendor',
      'homemaker': 'Homemaker',
      'retired': 'Retired'
    };
    return map[occ] || occ;
  },

  /**
   * Update visitor count (simulated)
   */
  updateVisitorCount() {
    const el = document.getElementById('visitor-count');
    if (!el) return;

    // Generate a realistic-looking count based on time of day
    const hour = new Date().getHours();
    const base = hour < 6 ? 800 : hour < 12 ? 3200 : hour < 18 ? 5500 : 4100;
    const variation = Math.floor(Math.random() * 500);
    el.textContent = (base + variation).toLocaleString();
  },

  /**
   * Show unlocked state
   */
  showUnlockedState() {
    const paywall = document.getElementById('paywall');
    if (paywall) paywall.style.display = 'none';
  }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Smooth scroll for anchor links
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Export
if (typeof window !== 'undefined') {
  window.App = App;
  window.scrollToSection = scrollToSection;
}
