/* ===== APPLICATION CORE ===== */
const App = {
  state: {
    user: null,
    privacyMode: false,
    hiddenBalances: [],
    accounts: [],
    currentPage: 'login',
    pendingRole: null,
    twoFAMethod: 'biometric',
    chartInstances: {},
    notifCount: 3,
    accessibility: { fontSize: 'normal', highContrast: false, reducedMotion: false },
  },

  init() {
    App.applyTheme(localStorage.getItem('nx_theme') || '#0066FF');
    try {
      const hb = localStorage.getItem('nx_hidden_balances');
      if (hb) App.state.hiddenBalances = JSON.parse(hb);
    } catch(e) {}
    try {
      const acc = localStorage.getItem('nx_accessibility');
      if (acc) App.state.accessibility = Object.assign({}, App.state.accessibility, JSON.parse(acc));
    } catch(e) {}
    App.applyAccessibility();
    const saved = sessionStorage.getItem('nx_user');
    if (saved) {
      App.state.user = JSON.parse(saved);
      App.goHome();
    } else {
      App.navigate('login');
    }
    window.addEventListener('hashchange', App.onHash);
  },

  applyTheme(color) {
    const glows = {
      '#0066FF': 'rgba(0,102,255,0.15)',
      '#22C55E': 'rgba(34,197,94,0.15)',
      '#8B5CF6': 'rgba(139,92,246,0.15)',
      '#F59E0B': 'rgba(245,158,11,0.15)',
      '#EF4444': 'rgba(239,68,68,0.15)',
    };
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-glow', glows[color] || 'rgba(0,102,255,0.15)');
    localStorage.setItem('nx_theme', color);
  },

  onHash() {
    const page = location.hash.replace('#','') || 'login';
    if (page !== App.state.currentPage) App.navigate(page, false);
  },

  navigate(page, pushHash = true) {
    App.closeSidebar();
    App.state.currentPage = page;
    App.destroyCharts();
    if (pushHash) history.pushState(null, '', '#' + page);
    const routes = {
      'login': AuthPages.renderLogin,
      '2fa': AuthPages.render2FA,
      'forgot-password': AuthPages.renderForgotPassword,
      // Customer
      'customer-dashboard': CustomerPages.renderDashboard,
      'customer-statement': CustomerPages.renderStatement,
      'customer-budget': CustomerPages.renderBudget,
      'customer-receipts': CustomerPages.renderReceipts,
      'customer-messages': CustomerPages.renderMessages,
      'customer-news': CustomerPages.renderNews,
      'customer-faq': CustomerPages.renderFAQ,
      'customer-settings': CustomerPages.renderSettings,
      'customer-guides': CustomerPages.renderGuides,
      // FA
      'fa-dashboard': FAPages.renderDashboard,
      'fa-clients': FAPages.renderClients,
      'fa-reports': FAPages.renderReports,
      'fa-messages': FAPages.renderMessages,
      'fa-news': FAPages.renderNews,
      'fa-receipts': FAPages.renderReceipts,
      'fa-profile': FAPages.renderProfile,
      // Team Leader
      'tl-dashboard': TLPages.renderDashboard,
      'tl-cases': TLPages.renderCases,
      'tl-complaints': TLPages.renderComplaints,
      'tl-security': TLPages.renderSecurity,
      'tl-fa-profiles': TLPages.renderFAProfiles,
      'tl-messages': TLPages.renderMessages,
    };
    const fn = routes[page];
    if (fn) {
      document.getElementById('app').innerHTML = fn();
      App.initPage(page);
    }
  },

  goHome() {
    const u = App.state.user;
    if (!u) { App.navigate('login'); return; }
    if (u.role === 'customer') App.navigate('customer-dashboard');
    else if (u.role === 'fa') App.navigate('fa-dashboard');
    else if (u.role === 'teamleader') App.navigate('tl-dashboard');
  },

  initPage(page) {
    // Sidebar nav highlighting
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
    // Privacy mode
    App.applyPrivacy();
    // Page-specific init
    const inits = {
      'customer-dashboard': CustomerPages.initDashboard,
      'customer-statement': CustomerPages.initStatement,
      'customer-budget': CustomerPages.initBudget,
      'customer-receipts': CustomerPages.initReceipts,
      'customer-messages': CustomerPages.initMessages,
      'customer-settings': CustomerPages.initSettings,
      'fa-dashboard': FAPages.initDashboard,
      'fa-clients': FAPages.initClients,
      'fa-reports': FAPages.initReports,
      'fa-messages': FAPages.initMessages,
      'fa-receipts': FAPages.initReceipts,
      'tl-dashboard': TLPages.initDashboard,
      'tl-cases': TLPages.initCases,
      'tl-complaints': TLPages.initComplaints,
      'tl-fa-profiles': TLPages.initFAProfiles,
      'tl-messages': TLPages.initMessages,
    };
    if (inits[page]) setTimeout(inits[page], 50);
  },

  login(role) {
    const u = Data.users.find(u => u.role === role);
    App.state.user = u;
    sessionStorage.setItem('nx_user', JSON.stringify(u));
    App.state.accounts = Data.accounts.filter(a => a.userId === u.id);
  },

  logout() {
    sessionStorage.removeItem('nx_user');
    App.state.user = null;
    App.state.privacyMode = false;
    App.navigate('login');
  },

  togglePrivacy() {
    App.state.privacyMode = !App.state.privacyMode;
    App.applyPrivacy();
    const btn = document.getElementById('privacyBtn');
    if (btn) {
      btn.classList.toggle('active', App.state.privacyMode);
      btn.title = App.state.privacyMode ? 'Show balances' : 'Hide balances';
      btn.innerHTML = App.state.privacyMode
        ? '<i class="fa-solid fa-eye-slash"></i>'
        : '<i class="fa-solid fa-eye"></i>';
    }
    App.toast(App.state.privacyMode ? 'Privacy mode ON — balances hidden' : 'Privacy mode OFF', 'info');
  },

  applyPrivacy() {
    document.querySelectorAll('.account-card-balance').forEach(el => {
      const perAccountHidden = App.state.hiddenBalances.includes(el.dataset.accountId);
      el.classList.toggle('blurred', App.state.privacyMode || perAccountHidden);
    });
    document.querySelectorAll('.privacy-sensitive').forEach(el => {
      el.classList.toggle('tx-hidden', App.state.privacyMode);
    });
  },

  applyAccessibility() {
    const a = App.state.accessibility;
    document.body.classList.remove('font-large', 'font-xlarge', 'high-contrast', 'reduced-motion');
    if (a.fontSize === 'large') document.body.classList.add('font-large');
    if (a.fontSize === 'xlarge') document.body.classList.add('font-xlarge');
    if (a.highContrast) document.body.classList.add('high-contrast');
    if (a.reducedMotion) document.body.classList.add('reduced-motion');
  },

  setAccessibility(key, val) {
    App.state.accessibility[key] = val;
    localStorage.setItem('nx_accessibility', JSON.stringify(App.state.accessibility));
    App.applyAccessibility();
    App.toast('Accessibility updated', 'success', 1500);
  },

  toggleAccountBalance(accountId, event) {
    event.stopPropagation();
    const idx = App.state.hiddenBalances.indexOf(accountId);
    if (idx > -1) {
      App.state.hiddenBalances.splice(idx, 1);
    } else {
      App.state.hiddenBalances.push(accountId);
    }
    localStorage.setItem('nx_hidden_balances', JSON.stringify(App.state.hiddenBalances));
    const isHidden = App.state.hiddenBalances.includes(accountId);
    const balanceEl = document.getElementById(`balance-${accountId}`);
    if (balanceEl) balanceEl.classList.toggle('blurred', App.state.privacyMode || isHidden);
    const btn = document.getElementById(`acc-eye-${accountId}`);
    if (btn) {
      btn.innerHTML = isHidden ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
      btn.title = isHidden ? 'Show balance' : 'Hide balance';
      btn.classList.toggle('hidden-balance', isHidden);
    }
  },

  // ===== TOAST =====
  toast(msg, type = 'default', duration = 3000) {
    const icons = { success:'fa-check-circle', error:'fa-exclamation-circle', warning:'fa-triangle-exclamation', default:'fa-circle-info' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<i class="fa-solid ${icons[type] || icons.default}"></i><span>${msg}</span>`;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => { t.classList.add('toast-out'); setTimeout(() => t.remove(), 300); }, duration);
  },

  // ===== MODAL =====
  openModal(html, onConfirm) {
    document.getElementById('modal-overlay').classList.remove('hidden');
    const c = document.getElementById('modal-container');
    c.innerHTML = html;
    document.getElementById('modal-overlay').onclick = App.closeModal;
    if (onConfirm) {
      const cb = document.getElementById('modal-confirm-btn');
      if (cb) cb.onclick = () => { onConfirm(); App.closeModal(); };
    }
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.onclick = App.closeModal;
    const cancelBtn = document.getElementById('modal-cancel-btn');
    if (cancelBtn) cancelBtn.onclick = App.closeModal;
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-container').innerHTML = '';
  },

  // ===== CHART HELPERS =====
  destroyCharts() {
    Object.values(App.state.chartInstances).forEach(c => { try { c.destroy(); } catch(e){} });
    App.state.chartInstances = {};
  },

  createChart(id, config) {
    const el = document.getElementById(id);
    if (!el) return null;
    if (App.state.chartInstances[id]) App.state.chartInstances[id].destroy();
    const chart = new Chart(el, config);
    App.state.chartInstances[id] = chart;
    return chart;
  },

  // ===== SIDEBAR BUILDER =====
  buildSidebar(role, activePage) {
    const u = App.state.user;
    const msgUnread = Data.messages.filter(m=>m.to===u?.id&&!m.read).length;
    const cmpOpen = Data.complaints.filter(c=>c.status==='open').length;
    const navs = {
      customer: [
        { section:'Main' },
        { icon:'fa-gauge', label:'Dashboard', page:'customer-dashboard' },
        { icon:'fa-file-lines', label:'Statement', page:'customer-statement' },
        { icon:'fa-wallet', label:'Budget', page:'customer-budget' },
        { icon:'fa-receipt', label:'Receipts', page:'customer-receipts' },
        { section:'Connect' },
        { icon:'fa-message', label:'Messages', page:'customer-messages', badge: msgUnread||'' },
        { icon:'fa-newspaper', label:'News', page:'customer-news' },
        { icon:'fa-circle-question', label:'FAQ', page:'customer-faq' },
        { icon:'fa-book-open', label:'Guides', page:'customer-guides' },
        { section:'Account' },
        { icon:'fa-gear', label:'Settings', page:'customer-settings' },
      ],
      fa: [
        { section:'Main' },
        { icon:'fa-gauge', label:'Dashboard', page:'fa-dashboard' },
        { icon:'fa-users', label:'Clients', page:'fa-clients' },
        { icon:'fa-file-chart-column', label:'Reports', page:'fa-reports' },
        { icon:'fa-receipt', label:'Receipts', page:'fa-receipts' },
        { section:'Connect' },
        { icon:'fa-message', label:'Messages', page:'fa-messages', badge: msgUnread||'' },
        { icon:'fa-newspaper', label:'News', page:'fa-news' },
        { section:'Profile' },
        { icon:'fa-id-card', label:'My Profile', page:'fa-profile' },
      ],
      teamleader: [
        { section:'Main' },
        { icon:'fa-gauge', label:'Manager Dashboard', page:'tl-dashboard' },
        { icon:'fa-folder-open', label:'Case Management', page:'tl-cases' },
        { icon:'fa-triangle-exclamation', label:'Complaints', page:'tl-complaints', badge: cmpOpen||'' },
        { icon:'fa-shield-halved', label:'Security Audit', page:'tl-security' },
        { section:'Team' },
        { icon:'fa-id-card', label:'FA Profiles', page:'tl-fa-profiles' },
        { icon:'fa-message', label:'Messages', page:'tl-messages', badge: msgUnread||'' },
      ],
    };

    // Bottom nav items (mobile only) — 5 most important per role
    const bottomNavs = {
      customer: [
        { icon:'fa-gauge', label:'Home', page:'customer-dashboard' },
        { icon:'fa-file-lines', label:'Statement', page:'customer-statement' },
        { icon:'fa-wallet', label:'Budget', page:'customer-budget' },
        { icon:'fa-message', label:'Messages', page:'customer-messages', badge: msgUnread },
        { icon:'fa-gear', label:'Settings', page:'customer-settings' },
      ],
      fa: [
        { icon:'fa-gauge', label:'Dashboard', page:'fa-dashboard' },
        { icon:'fa-users', label:'Clients', page:'fa-clients' },
        { icon:'fa-file-chart-column', label:'Reports', page:'fa-reports' },
        { icon:'fa-message', label:'Messages', page:'fa-messages', badge: msgUnread },
        { icon:'fa-id-card', label:'Profile', page:'fa-profile' },
      ],
      teamleader: [
        { icon:'fa-gauge', label:'Dashboard', page:'tl-dashboard' },
        { icon:'fa-folder-open', label:'Cases', page:'tl-cases' },
        { icon:'fa-triangle-exclamation', label:'Complaints', page:'tl-complaints', badge: cmpOpen },
        { icon:'fa-message', label:'Messages', page:'tl-messages', badge: msgUnread },
        { icon:'fa-id-card', label:'Team', page:'tl-fa-profiles' },
      ],
    };

    const items = navs[role] || [];
    const bnItems = bottomNavs[role] || [];
    const roleLabel = role==='teamleader'?'Team Leader':role==='fa'?'Financial Advisor':'Customer';

    let sidebarHtml = `
      <div class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <div class="sidebar-logo"><img src="assets/logo.svg" style="width:26px;height:26px;filter:brightness(0) invert(1);"></div>
          <div>
            <div class="sidebar-brand-name">DWK</div>
            <div class="sidebar-brand-sub">Secure Banking</div>
          </div>
        </div>
        <div class="sidebar-user">
          <div class="sidebar-avatar" style="background:${u?.color}">${u?.initials}</div>
          <div>
            <div class="sidebar-user-name">${u?.name}</div>
            <div class="sidebar-user-role">${roleLabel}</div>
          </div>
        </div>
        <nav class="sidebar-nav">`;
    items.forEach(item => {
      if (item.section) {
        sidebarHtml += `<div class="nav-section-label">${item.section}</div>`;
      } else {
        const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
        sidebarHtml += `<div class="nav-item${activePage===item.page?' active':''}" data-page="${item.page}" onclick="App.navigate('${item.page}')">
          <i class="fa-solid ${item.icon}"></i>${item.label}${badge}</div>`;
      }
    });
    sidebarHtml += `</nav>
        <div class="sidebar-footer">
          <div class="nav-item" onclick="App.logout()">
            <i class="fa-solid fa-right-from-bracket"></i>Sign Out
          </div>
        </div>
      </div>`;

    const bottomNavHtml = `
      <nav class="bottom-nav">
        ${bnItems.map(item=>`
        <button class="bn-item${activePage===item.page?' active':''}" onclick="App.navigate('${item.page}')" style="position:relative">
          <i class="fa-solid ${item.icon}"></i>
          <span>${item.label}</span>
          ${item.badge ? '<span class="bn-badge"></span>' : ''}
        </button>`).join('')}
      </nav>`;

    return `<div class="sidebar-backdrop" id="sidebar-backdrop" onclick="App.closeSidebar()"></div>${sidebarHtml}${bottomNavHtml}`;
  },

  // ===== MOBILE SIDEBAR TOGGLE =====
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const isOpen = sidebar?.classList.contains('open');
    if (isOpen) {
      sidebar?.classList.remove('open');
      backdrop?.classList.remove('visible');
      document.body.style.overflow = '';
    } else {
      sidebar?.classList.add('open');
      backdrop?.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
  },

  closeSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('sidebar-backdrop')?.classList.remove('visible');
    document.body.style.overflow = '';
  },

  msgBack() {
    document.querySelector('.messaging-layout')?.classList.remove('chat-active');
  },

  // ===== HEADER BUILDER =====
  buildHeader(title, subtitle = '') {
    const u = App.state.user;
    const isCustomer = u?.role === 'customer';
    return `
      <header class="main-header">
        <div class="header-left">
          <button class="hamburger-btn" onclick="App.toggleSidebar()" aria-label="Open menu">
            <i class="fa-solid fa-bars"></i>
          </button>
          <div>
            <div class="page-title">${title}</div>
            ${subtitle ? `<div class="page-breadcrumb">${subtitle}</div>` : ''}
          </div>
        </div>
        <div class="header-right">
          <div class="header-search">
            <i class="fa-solid fa-magnifying-glass" style="color:var(--text-muted)"></i>
            <input type="text" placeholder="Search…" oninput="App.globalSearch(this.value)">
          </div>
          ${isCustomer ? `
          <button class="header-icon-btn privacy-btn${App.state.privacyMode?' active':''}" id="privacyBtn" title="Toggle privacy" onclick="App.togglePrivacy()">
            <i class="fa-solid ${App.state.privacyMode?'fa-eye-slash':'fa-eye'}"></i>
          </button>` : ''}
          <button class="header-icon-btn" title="Notifications" onclick="App.showNotifications()">
            <i class="fa-solid fa-bell"></i>
            ${App.state.notifCount > 0 ? '<span class="header-notif-dot"></span>' : ''}
          </button>
          <button class="header-icon-btn" title="Account" onclick="App.showAccountMenu()">
            <div class="sidebar-avatar" style="width:32px;height:32px;font-size:13px;background:${u?.color}">${u?.initials}</div>
          </button>
        </div>
      </header>`;
  },

  globalSearch(val) {
    if (val.length > 2) App.toast(`Searching for "${val}"…`, 'default', 1500);
  },

  showNotifications() {
    App.state.notifCount = 0;
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-bell" style="color:var(--accent);margin-right:8px"></i>Notifications</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="gap:10px">
          <div class="alert alert-info"><i class="fa-solid fa-circle-info"></i><div class="alert-body"><div class="alert-title">Uncommon Payment Detected</div>Amazon — £128.50. Please verify this was you.</div></div>
          <div class="alert alert-success"><i class="fa-solid fa-check-circle"></i><div class="alert-body"><div class="alert-title">Salary Received</div>£3,200.00 credited to your Current Account</div></div>
          <div class="alert alert-warning"><i class="fa-solid fa-triangle-exclamation"></i><div class="alert-body"><div class="alert-title">Budget Exceeded</div>Shopping budget is £6.00 over limit this month.</div></div>
          <div style="font-size:12px;color:var(--text-muted);text-align:center;padding-top:4px">All caught up!</div>
        </div>
      </div>`);
    const dot = document.querySelector('.header-notif-dot');
    if (dot) dot.remove();
  },

  showAccountMenu() {
    const u = App.state.user;
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Account</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div style="display:flex;align-items:center;gap:12px;padding:8px 0 16px">
            <div class="sidebar-avatar" style="width:52px;height:52px;font-size:20px;background:${u?.color}">${u?.initials}</div>
            <div>
              <div style="font-size:16px;font-weight:700">${u?.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${u?.email}</div>
              <div style="font-size:12px;color:var(--text-muted)">${u?.phone}</div>
            </div>
          </div>
          <div class="divider"></div>
          <button class="btn btn-secondary btn-full" style="margin-bottom:8px" onclick="App.closeModal();App.showAccessibilityModal()"><i class="fa-solid fa-universal-access"></i>Accessibility</button>
          <button class="btn btn-danger btn-full" onclick="App.closeModal();App.logout()"><i class="fa-solid fa-right-from-bracket"></i>Sign Out</button>
        </div>
      </div>`);
  },

  showAccessibilityModal() {
    const a = App.state.accessibility;
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-universal-access" style="color:var(--accent);margin-right:8px"></i>Accessibility</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="settings-row">
            <div class="settings-row-info"><div class="settings-row-title">Text Size</div><div class="settings-row-desc">Increase text size for easier reading</div></div>
            <select class="form-control" style="width:120px" onchange="App.setAccessibility('fontSize',this.value)">
              <option value="normal" ${a.fontSize==='normal'?'selected':''}>Normal</option>
              <option value="large" ${a.fontSize==='large'?'selected':''}>Large</option>
              <option value="xlarge" ${a.fontSize==='xlarge'?'selected':''}>Extra Large</option>
            </select>
          </div>
          <div class="settings-row">
            <div class="settings-row-info"><div class="settings-row-title">High Contrast</div><div class="settings-row-desc">Enhance colour contrast for visibility</div></div>
            <label class="toggle"><input type="checkbox" ${a.highContrast?'checked':''} onchange="App.setAccessibility('highContrast',this.checked)"><span class="toggle-slider"></span></label>
          </div>
          <div class="settings-row">
            <div class="settings-row-info"><div class="settings-row-title">Reduced Motion</div><div class="settings-row-desc">Disable animations and transitions</div></div>
            <label class="toggle"><input type="checkbox" ${a.reducedMotion?'checked':''} onchange="App.setAccessibility('reducedMotion',this.checked)"><span class="toggle-slider"></span></label>
          </div>
        </div>
      </div>`);
  },

  // Format helpers
  fmt: {
    currency(n) { return (n < 0 ? '-£' : '£') + Math.abs(n).toLocaleString('en-GB', {minimumFractionDigits:2,maximumFractionDigits:2}); },
    date(d) { return new Date(d).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'}); },
    percent(n, total) { return total ? Math.round((n/total)*100) : 0; },
  }
};
