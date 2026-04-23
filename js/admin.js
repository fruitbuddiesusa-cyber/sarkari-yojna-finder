/**
 * Admin Panel — Analytics Dashboard
 * All data stored in localStorage (no backend needed)
 */

const AdminPanel = {
  STORAGE_KEY: 'scheme_finder_analytics',
  AUTH_KEY: 'scheme_finder_admin_auth',
  SETTINGS_KEY: 'scheme_finder_settings',
  DEFAULT_PASSWORD: 'admin123',

  /**
   * Initialize admin panel
   */
  init() {
    this.checkAuth();
    this.bindLogin();
  },

  /**
   * Check if already authenticated
   */
  checkAuth() {
    const auth = sessionStorage.getItem(this.AUTH_KEY);
    if (auth === 'true') {
      this.showDashboard();
    }
  },

  /**
   * Bind login form
   */
  bindLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('admin-password').value;
      const stored = this.getSettings().password || this.DEFAULT_PASSWORD;

      if (password === stored) {
        sessionStorage.setItem(this.AUTH_KEY, 'true');
        this.showDashboard();
      } else {
        alert('Incorrect password');
      }
    });
  },

  /**
   * Show dashboard
   */
  showDashboard() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    this.loadAllData();
  },

  /**
   * Logout
   */
  logout() {
    sessionStorage.removeItem(this.AUTH_KEY);
    document.getElementById('admin-login').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
  },

  /**
   * Get analytics data
   */
  getData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.getDefaultData();
    } catch {
      return this.getDefaultData();
    }
  },

  /**
   * Save analytics data
   */
  saveData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  },

  /**
   * Get default data structure
   */
  getDefaultData() {
    return {
      searches: [],
      payments: [],
      pageViews: [],
      schemeMatches: {},
      settings: {
        password: this.DEFAULT_PASSWORD,
        razorpayKey: '',
        price: 99,
        gaId: ''
      }
    };
  },

  /**
   * Get settings
   */
  getSettings() {
    const data = this.getData();
    return data.settings || this.getDefaultData().settings;
  },

  /**
   * Load and display all data
   */
  loadAllData() {
    const data = this.getData();
    this.renderStats(data);
    this.renderDailyChart(data);
    this.renderSchemeStats(data);
    this.renderDemographics(data);
    this.renderRecentSearches(data);
    this.renderPaymentHistory(data);
    this.loadSettings(data);
  },

  /**
   * Render overview stats
   */
  renderStats(data) {
    const today = new Date().toDateString();
    const todaySearches = data.searches.filter(s => new Date(s.timestamp).toDateString() === today);
    const paidUsers = data.payments.filter(p => p.status === 'success');
    const totalRevenue = paidUsers.reduce((sum, p) => sum + (p.amount || 99), 0);
    const conversionRate = data.searches.length > 0
      ? ((paidUsers.length / data.searches.length) * 100).toFixed(1)
      : 0;

    // Count returning users (same session multiple searches)
    const sessions = {};
    data.searches.forEach(s => {
      const session = s.sessionId || 'unknown';
      sessions[session] = (sessions[session] || 0) + 1;
    });
    const returning = Object.values(sessions).filter(c => c > 1).length;

    document.getElementById('stat-total').textContent = data.searches.length.toLocaleString();
    document.getElementById('stat-paid').textContent = paidUsers.length.toLocaleString();
    document.getElementById('stat-today').textContent = todaySearches.length.toLocaleString();
    document.getElementById('stat-revenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    document.getElementById('stat-conversion').textContent = `${conversionRate}%`;
    document.getElementById('stat-returning').textContent = returning.toLocaleString();
  },

  /**
   * Render daily chart (simple canvas chart)
   */
  renderDailyChart(data) {
    const canvas = document.getElementById('daily-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Get last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const count = data.searches.filter(s => new Date(s.timestamp).toDateString() === dateStr).length;
      days.push({
        label: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        count: count
      });
    }

    const maxCount = Math.max(...days.map(d => d.count), 1);
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const barWidth = chartWidth / days.length - 10;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = '#64748B';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxCount - (maxCount / 4) * i), padding.left - 8, y + 4);
    }

    // Draw bars
    days.forEach((day, i) => {
      const x = padding.left + (chartWidth / days.length) * i + 5;
      const barHeight = (day.count / maxCount) * chartHeight;
      const y = padding.top + chartHeight - barHeight;

      // Bar gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      gradient.addColorStop(0, '#FF6B35');
      gradient.addColorStop(1, '#FF8F65');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      ctx.fill();

      // Value on top
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(day.count, x + barWidth / 2, y - 6);

      // X-axis label
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px system-ui';
      ctx.fillText(day.label, x + barWidth / 2, height - 10);
    });
  },

  /**
   * Render scheme popularity stats
   */
  renderSchemeStats(data) {
    const container = document.getElementById('scheme-stats');
    if (!container) return;

    const sorted = Object.entries(data.schemeMatches || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    const maxCount = sorted.length > 0 ? sorted[0][1] : 1;

    container.innerHTML = sorted.map(([name, count], i) => {
      const pct = (count / maxCount) * 100;
      return `
        <div class="scheme-stat-item">
          <span class="scheme-stat-rank">#${i + 1}</span>
          <span class="scheme-stat-name">${name}</span>
          <span class="scheme-stat-count">${count}</span>
          <div class="scheme-stat-bar">
            <div class="scheme-stat-fill" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join('') || '<p style="color:#64748B;text-align:center;padding:20px;">No data yet</p>';
  },

  /**
   * Render demographics
   */
  renderDemographics(data) {
    this.renderDemoBar('occupation-stats', this.countBy(data.searches, 'occupation'));
    this.renderDemoBar('category-stats', this.countBy(data.searches, 'category'));
    this.renderDemoBar('state-stats', this.countBy(data.searches, 'state'));
    this.renderDemoBar('income-stats', this.countBy(data.searches, 'income'));
  },

  /**
   * Render a demographic bar chart
   */
  renderDemoBar(containerId, counts) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const max = sorted.length > 0 ? sorted[0][1] : 1;

    container.innerHTML = sorted.map(([name, count]) => {
      const pct = (count / max) * 100;
      return `
        <div class="demo-item">
          <span class="demo-item-name">${this.formatLabel(name)}</span>
          <span class="demo-item-value">${count}</span>
        </div>
        <div class="demo-bar-container">
          <div class="demo-bar-fill" style="width:${pct}%"></div>
        </div>
      `;
    }).join('') || '<p style="color:#64748B;font-size:13px;">No data</p>';
  },

  /**
   * Count occurrences by field
   */
  countBy(searches, field) {
    const counts = {};
    searches.forEach(s => {
      const val = s[field] || 'Unknown';
      counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
  },

  /**
   * Format label for display
   */
  formatLabel(label) {
    return label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  },

  /**
   * Render recent searches table
   */
  renderRecentSearches(data) {
    const tbody = document.getElementById('recent-searches');
    if (!tbody) return;

    const recent = [...data.searches].reverse().slice(0, 50);

    tbody.innerHTML = recent.map(s => {
      const time = new Date(s.timestamp).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      });
      return `
        <tr>
          <td>${time}</td>
          <td>${s.age || '-'}</td>
          <td>${this.formatLabel(s.state || '-')}</td>
          <td>₹${parseInt(s.income || 0).toLocaleString()}</td>
          <td>${this.formatLabel(s.occupation || '-')}</td>
          <td>${(s.category || '-').toUpperCase()}</td>
          <td>${s.resultsCount || 0}</td>
          <td><span class="paid-badge ${s.paid ? 'yes' : 'no'}">${s.paid ? 'Yes' : 'No'}</span></td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="8" style="text-align:center;color:#64748B;">No searches yet</td></tr>';
  },

  /**
   * Render payment history
   */
  renderPaymentHistory(data) {
    const tbody = document.getElementById('payment-history');
    if (!tbody) return;

    const payments = [...data.payments].reverse().slice(0, 50);

    tbody.innerHTML = payments.map(p => {
      const time = new Date(p.timestamp).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
      });
      return `
        <tr>
          <td>${time}</td>
          <td style="font-family:monospace;font-size:12px;">${p.paymentId || '-'}</td>
          <td>₹${p.amount || 99}</td>
          <td><span class="paid-badge ${p.status === 'success' ? 'yes' : 'no'}">${p.status}</span></td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="4" style="text-align:center;color:#64748B;">No payments yet</td></tr>';
  },

  /**
   * Load settings into form
   */
  loadSettings(data) {
    const settings = data.settings || {};
    const pw = document.getElementById('setting-password');
    const rp = document.getElementById('setting-razorpay');
    const pr = document.getElementById('setting-price');
    const ga = document.getElementById('setting-ga');
    if (pw) pw.value = settings.password || this.DEFAULT_PASSWORD;
    if (rp) rp.value = settings.razorpayKey || '';
    if (pr) pr.value = settings.price || 99;
    if (ga) ga.value = settings.gaId || '';
  },

  /**
   * Update settings
   */
  updatePassword() {
    const data = this.getData();
    data.settings = data.settings || {};
    data.settings.password = document.getElementById('setting-password').value;
    this.saveData(data);
    alert('Password updated');
  },

  updateRazorpay() {
    const data = this.getData();
    data.settings = data.settings || {};
    data.settings.razorpayKey = document.getElementById('setting-razorpay').value;
    this.saveData(data);
    alert('Razorpay key updated');
  },

  updatePrice() {
    const data = this.getData();
    data.settings = data.settings || {};
    data.settings.price = parseInt(document.getElementById('setting-price').value) || 99;
    this.saveData(data);
    alert('Price updated');
  },

  updateGA() {
    const data = this.getData();
    data.settings = data.settings || {};
    data.settings.gaId = document.getElementById('setting-ga').value;
    this.saveData(data);
    alert('Google Analytics ID updated');
  },

  /**
   * Export data as CSV
   */
  exportData() {
    const data = this.getData();
    const searches = data.searches || [];

    if (searches.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Timestamp', 'Age', 'State', 'Income', 'Occupation', 'Category', 'Results', 'Paid'];
    const rows = searches.map(s => [
      new Date(s.timestamp).toISOString(),
      s.age,
      s.state,
      s.income,
      s.occupation,
      s.category,
      s.resultsCount,
      s.paid ? 'Yes' : 'No'
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `schemefinder-analytics-${new Date().toISOString().split('T')[0]`.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Clear all data
   */
  clearData() {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.loadAllData();
      alert('Data cleared');
    }
  },

  /**
   * Track a search event (called from main app)
   */
  static trackSearch(profile, resultsCount) {
    const data = AdminPanel.getData();
    const sessionId = sessionStorage.getItem('scheme_finder_session') || 
      (() => { const id = Math.random().toString(36).substr(2, 9); sessionStorage.setItem('scheme_finder_session', id); return id; })();

    data.searches.push({
      timestamp: Date.now(),
      age: profile.age,
      gender: profile.gender,
      state: profile.state,
      income: profile.income,
      occupation: profile.occupation,
      category: profile.category,
      resultsCount: resultsCount,
      paid: false,
      sessionId: sessionId
    });

    // Track scheme matches
    AdminPanel.matcher?.match(profile).forEach(scheme => {
      data.schemeMatches[scheme.name] = (data.schemeMatches[scheme.name] || 0) + 1;
    });

    AdminPanel.saveData(data);
  },

  /**
   * Track a payment event (called from main app)
   */
  static trackPayment(paymentId, amount) {
    const data = AdminPanel.getData();

    data.payments.push({
      timestamp: Date.now(),
      paymentId: paymentId,
      amount: amount || 99,
      status: 'success'
    });

    // Mark last search as paid
    if (data.searches.length > 0) {
      data.searches[data.searches.length - 1].paid = true;
    }

    AdminPanel.saveData(data);
  },

  /**
   * Track page view
   */
  static trackPageView() {
    const data = AdminPanel.getData();
    data.pageViews = data.pageViews || [];
    data.pageViews.push({
      timestamp: Date.now(),
      path: window.location.pathname
    });
    AdminPanel.saveData(data);
  }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  AdminPanel.init();
});

// Export
if (typeof window !== 'undefined') {
  window.AdminPanel = AdminPanel;
}
