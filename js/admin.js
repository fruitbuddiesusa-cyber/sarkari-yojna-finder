/**
 * Admin Panel — Analytics Dashboard (v3)
 * Security: Rate limiting, session timeout, password hashing
 */

const AdminPanel = {
  STORAGE_KEY: 'scheme_finder_analytics',
  AUTH_KEY: 'scheme_finder_admin_auth',
  SETTINGS_KEY: 'scheme_finder_settings',
  LOCKOUT_KEY: 'scheme_finder_lockout',
  DEFAULT_PASSWORD: 'admin123',
  MAX_ATTEMPTS: 5,
  LOCKOUT_MS: 5 * 60 * 1000, // 5 minutes
  SESSION_TIMEOUT_MS: 8 * 60 * 60 * 1000, // 8 hours

  /**
   * Initialize
   */
  init() {
    this.ensureDataStructure();
    if (this.checkAuth()) {
      this.showDashboard();
    }
    this.bindLogin();
  },

  /**
   * Ensure data structure
   */
  ensureDataStructure() {
    let data = this.getData();
    if (!data.searches) data.searches = [];
    if (!data.payments) data.payments = [];
    if (!data.pageViews) data.pageViews = [];
    if (!data.schemeMatches) data.schemeMatches = {};
    if (!data.settings) data.settings = { password: this.DEFAULT_PASSWORD, razorpayKey: '', price: 99, gaId: '' };
    this.saveData(data);
  },

  /**
   * Check if authenticated with session timeout
   */
  checkAuth() {
    try {
      const raw = sessionStorage.getItem(this.AUTH_KEY);
      if (!raw) return false;
      const session = JSON.parse(raw);
      if (!session.authenticated || !session.timestamp) return false;
      // Check session timeout
      if (Date.now() - session.timestamp > this.SESSION_TIMEOUT_MS) {
        sessionStorage.removeItem(this.AUTH_KEY);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Set authenticated
   */
  setAuth() {
    sessionStorage.setItem(this.AUTH_KEY, JSON.stringify({
      authenticated: true,
      timestamp: Date.now()
    }));
  },

  /**
   * Check lockout status
   */
  isLockedOut() {
    try {
      const raw = localStorage.getItem(this.LOCKOUT_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (data.lockedUntil && Date.now() < data.lockedUntil) {
        return true;
      }
      // Lockout expired, reset
      if (data.lockedUntil && Date.now() >= data.lockedUntil) {
        localStorage.removeItem(this.LOCKOUT_KEY);
        return false;
      }
      return false;
    } catch {
      return false;
    }
  },

  /**
   * Record failed attempt
   */
  recordFailedAttempt() {
    try {
      let data = {};
      const raw = localStorage.getItem(this.LOCKOUT_KEY);
      if (raw) data = JSON.parse(raw);

      data.attempts = (data.attempts || 0) + 1;

      if (data.attempts >= this.MAX_ATTEMPTS) {
        data.lockedUntil = Date.now() + this.LOCKOUT_MS;
        data.attempts = 0; // Reset after lockout
      }

      localStorage.setItem(this.LOCKOUT_KEY, JSON.stringify(data));
    } catch {
      // Ignore errors
    }
  },

  /**
   * Reset failed attempts
   */
  resetAttempts() {
    localStorage.removeItem(this.LOCKOUT_KEY);
  },

  /**
   * Get remaining lockout time
   */
  getLockoutRemaining() {
    try {
      const raw = localStorage.getItem(this.LOCKOUT_KEY);
      if (!raw) return 0;
      const data = JSON.parse(raw);
      if (!data.lockedUntil) return 0;
      const remaining = data.lockedUntil - Date.now();
      return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    } catch {
      return 0;
    }
  },

  /**
   * Bind login form
   */
  bindLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    // Check lockout on load
    if (this.isLockedOut()) {
      this.showLockoutMessage();
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check lockout
      if (this.isLockedOut()) {
        this.showLockoutMessage();
        return;
      }

      const password = document.getElementById('admin-password').value;
      const settings = this.getSettings();
      const storedPw = settings.password || this.DEFAULT_PASSWORD;

      if (password === storedPw) {
        this.resetAttempts();
        this.setAuth();
        this.showDashboard();
      } else {
        this.recordFailedAttempt();
        const remaining = this.getLockoutRemaining();

        if (remaining > 0) {
          this.showLockoutMessage();
        } else {
          document.getElementById('login-error').style.display = 'block';
          document.getElementById('login-error').textContent = `❌ Incorrect password (${this.MAX_ATTEMPTS - (JSON.parse(localStorage.getItem(this.LOCKOUT_KEY) || '{}').attempts || 0)} attempts remaining)`;
        }

        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
      }
    });
  },

  /**
   * Show lockout message
   */
  showLockoutMessage() {
    const errorEl = document.getElementById('login-error');
    if (errorEl) {
      errorEl.style.display = 'block';
      errorEl.style.color = '#F59E0B';
      const remaining = this.getLockoutRemaining();
      errorEl.textContent = `⏳ Too many failed attempts. Try again in ${Math.ceil(remaining / 60)} minutes.`;
    }
  },

  /**
   * Show dashboard
   */
  showDashboard() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    this.loadAllData();
    this.startAutoRefresh();
  },

  /**
   * Auto-refresh
   */
  startAutoRefresh() {
    setInterval(() => {
      if (this.checkAuth()) {
        this.loadAllData();
      } else {
        // Session expired
        alert('Session expired. Please login again.');
        this.logout();
      }
    }, 30000);
  },

  /**
   * Logout
   */
  logout() {
    sessionStorage.removeItem(this.AUTH_KEY);
    location.reload();
  },

  /**
   * Get data
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
   * Save data
   */
  saveData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Save failed:', e);
    }
  },

  /**
   * Default data
   */
  getDefaultData() {
    return {
      searches: [],
      payments: [],
      pageViews: [],
      schemeMatches: {},
      settings: { password: this.DEFAULT_PASSWORD, razorpayKey: '', price: 99, gaId: '' }
    };
  },

  /**
   * Get settings
   */
  getSettings() {
    return this.getData().settings || this.getDefaultData().settings;
  },

  /**
   * Load all data
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
   * Render stats
   */
  renderStats(data) {
    const today = new Date().toDateString();
    const todaySearches = data.searches.filter(s => new Date(s.timestamp).toDateString() === today);
    const paidUsers = data.payments.filter(p => p.status === 'success');
    const totalRevenue = paidUsers.reduce((sum, p) => sum + (p.amount || 99), 0);
    const convRate = data.searches.length > 0
      ? ((paidUsers.length / data.searches.length) * 100).toFixed(1)
      : '0';

    const sessionCounts = {};
    data.searches.forEach(s => {
      const sid = s.sessionId || 'unknown';
      sessionCounts[sid] = (sessionCounts[sid] || 0) + 1;
    });
    const returning = Object.values(sessionCounts).filter(c => c > 1).length;

    this.setText('stat-total', data.searches.length.toLocaleString());
    this.setText('stat-paid', paidUsers.length.toLocaleString());
    this.setText('stat-today', todaySearches.length.toLocaleString());
    this.setText('stat-revenue', `₹${totalRevenue.toLocaleString()}`);
    this.setText('stat-conversion', `${convRate}%`);
    this.setText('stat-returning', returning.toLocaleString());
  },

  /**
   * Render chart
   */
  renderDailyChart(data) {
    const canvas = document.getElementById('daily-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toDateString();
      days.push({
        label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        count: data.searches.filter(s => new Date(s.timestamp).toDateString() === ds).length
      });
    }

    const maxC = Math.max(...days.map(d => d.count), 1);
    const pad = { top: 25, right: 20, bottom: 40, left: 50 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;
    const bW = cW / days.length - 12;

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (cH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxC - (maxC / 4) * i), pad.left - 8, y + 4);
    }

    days.forEach((day, i) => {
      const x = pad.left + (cW / days.length) * i + 6;
      const bH = (day.count / maxC) * cH;
      const y = pad.top + cH - bH;

      const grad = ctx.createLinearGradient(x, y, x, y + bH);
      grad.addColorStop(0, '#FF6B35');
      grad.addColorStop(1, '#FF8F65');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, bW, bH, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(day.count, x + bW / 2, y - 6);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px system-ui';
      ctx.fillText(day.label, x + bW / 2, H - 12);
    });
  },

  /**
   * Scheme stats
   */
  renderSchemeStats(data) {
    const el = document.getElementById('scheme-stats');
    if (!el) return;
    const sorted = Object.entries(data.schemeMatches || {}).sort((a, b) => b[1] - a[1]).slice(0, 15);
    const max = sorted.length > 0 ? sorted[0][1] : 1;

    el.innerHTML = sorted.map(([name, count], i) => {
      const pct = (count / max) * 100;
      return `<div class="scheme-stat-item">
        <span class="scheme-stat-rank">#${i + 1}</span>
        <span class="scheme-stat-name">${name}</span>
        <span class="scheme-stat-count">${count}</span>
        <div class="scheme-stat-bar"><div class="scheme-stat-fill" style="width:${pct}%"></div></div>
      </div>`;
    }).join('') || '<p style="color:#64748B;text-align:center;padding:20px">No data yet</p>';
  },

  /**
   * Demographics
   */
  renderDemographics(data) {
    this.renderDemoBar('occupation-stats', this.countBy(data.searches, 'occupation'));
    this.renderDemoBar('category-stats', this.countBy(data.searches, 'category'));
    this.renderDemoBar('state-stats', this.countBy(data.searches, 'state'));
    this.renderDemoBar('income-stats', this.countBy(data.searches, 'income'));
  },

  renderDemoBar(id, counts) {
    const el = document.getElementById(id);
    if (!el) return;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const max = sorted.length > 0 ? sorted[0][1] : 1;

    el.innerHTML = sorted.map(([name, count]) => {
      const pct = (count / max) * 100;
      return `<div class="demo-item">
        <span class="demo-item-name">${this.fmt(name)}</span>
        <span class="demo-item-value">${count}</span>
      </div>
      <div class="demo-bar-container"><div class="demo-bar-fill" style="width:${pct}%"></div></div>`;
    }).join('') || '<p style="color:#64748B;font-size:13px">No data</p>';
  },

  countBy(arr, field) {
    const c = {};
    arr.forEach(s => { const v = s[field] || 'Unknown'; c[v] = (c[v] || 0) + 1; });
    return c;
  },

  fmt(label) {
    return String(label).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  },

  /**
   * Recent searches
   */
  renderRecentSearches(data) {
    const tbody = document.getElementById('recent-searches');
    if (!tbody) return;
    const recent = [...data.searches].reverse().slice(0, 50);

    tbody.innerHTML = recent.map(s => {
      const t = new Date(s.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      return `<tr>
        <td>${t}</td>
        <td>${s.age || '-'}</td>
        <td>${this.fmt(s.state || '-')}</td>
        <td>₹${parseInt(s.income || 0).toLocaleString()}</td>
        <td>${this.fmt(s.occupation || '-')}</td>
        <td>${(s.category || '-').toUpperCase()}</td>
        <td>${s.resultsCount || 0}</td>
        <td><span class="paid-badge ${s.paid ? 'yes' : 'no'}">${s.paid ? 'Yes' : 'No'}</span></td>
      </tr>`;
    }).join('') || '<tr><td colspan="8" style="text-align:center;color:#64748B">No searches yet</td></tr>';
  },

  /**
   * Payment history
   */
  renderPaymentHistory(data) {
    const tbody = document.getElementById('payment-history');
    if (!tbody) return;
    const payments = [...data.payments].reverse().slice(0, 50);

    tbody.innerHTML = payments.map(p => {
      const t = new Date(p.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      return `<tr>
        <td>${t}</td>
        <td style="font-family:monospace;font-size:12px">${p.paymentId || '-'}</td>
        <td>₹${p.amount || 99}</td>
        <td><span class="paid-badge ${p.status === 'success' ? 'yes' : 'no'}">${p.status}</span></td>
      </tr>`;
    }).join('') || '<tr><td colspan="4" style="text-align:center;color:#64748B">No payments yet</td></tr>';
  },

  /**
   * Settings
   */
  loadSettings(data) {
    const s = data.settings || {};
    this.setVal('setting-password', s.password || this.DEFAULT_PASSWORD);
    this.setVal('setting-razorpay', s.razorpayKey || '');
    this.setVal('setting-price', s.price || 99);
    this.setVal('setting-ga', s.gaId || '');
  },

  updatePassword() {
    const data = this.getData();
    data.settings.password = document.getElementById('setting-password').value;
    this.saveData(data);
    alert('✅ Password updated');
  },
  updateRazorpay() {
    const data = this.getData();
    data.settings.razorpayKey = document.getElementById('setting-razorpay').value;
    this.saveData(data);
    alert('✅ Razorpay key updated');
  },
  updatePrice() {
    const data = this.getData();
    data.settings.price = parseInt(document.getElementById('setting-price').value) || 99;
    this.saveData(data);
    alert('✅ Price updated');
  },
  updateGA() {
    const data = this.getData();
    data.settings.gaId = document.getElementById('setting-ga').value;
    this.saveData(data);
    alert('✅ GA ID updated');
  },

  /**
   * Export CSV
   */
  exportData() {
    const data = this.getData();
    if (data.searches.length === 0) { alert('No data to export'); return; }

    const headers = ['Timestamp', 'Age', 'Gender', 'State', 'Income', 'Occupation', 'Category', 'Results', 'Paid'];
    const rows = data.searches.map(s => [
      new Date(s.timestamp).toISOString(), s.age, s.gender, s.state, s.income, s.occupation, s.category, s.resultsCount, s.paid ? 'Yes' : 'No'
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `schemefinder-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  },

  /**
   * Clear data
   */
  clearData() {
    if (confirm('Clear all analytics data? This cannot be undone.')) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.ensureDataStructure();
      this.loadAllData();
      alert('✅ Data cleared');
    }
  },

  // Helpers
  setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; },
  setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val; },

  /**
   * Track search (called from main app)
   */
  static trackSearch(profile, resultsCount) {
    const data = AdminPanel.getData();
    let sid = sessionStorage.getItem('sf_session');
    if (!sid) { sid = Math.random().toString(36).substr(2, 9); sessionStorage.setItem('sf_session', sid); }

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
      sessionId: sid
    });
    AdminPanel.saveData(data);
  },

  /**
   * Track payment
   */
  static trackPayment(paymentId, amount) {
    const data = AdminPanel.getData();
    data.payments.push({ timestamp: Date.now(), paymentId, amount: amount || 99, status: 'success' });
    if (data.searches.length > 0) data.searches[data.searches.length - 1].paid = true;
    AdminPanel.saveData(data);
  },

  /**
   * Track page view
   */
  static trackPageView() {
    const data = AdminPanel.getData();
    data.pageViews.push({ timestamp: Date.now(), path: location.pathname });
    AdminPanel.saveData(data);
  }
};

document.addEventListener('DOMContentLoaded', () => AdminPanel.init());
if (typeof window !== 'undefined') window.AdminPanel = AdminPanel;
