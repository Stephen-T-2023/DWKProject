/* ===== CUSTOMER PAGES ===== */
const CustomerPages = {

  // ===== WIDGET CONFIG =====
  _defaultConfig() {
    return {
      theme: '#0066FF',
      sectionOrder: ['kpi','charts','accounts','activity','extras'],
      kpi: { visible:true, layout:'row', cards:{ balance:true, income:true, spend:true, saved:true } },
      charts: { visible:true, income:true, category:true, chartSize:'normal' },
      accounts: { visible:true },
      activity: { visible:true, transactions:true, quickActions:true, budgetHealth:true },
      extras: { visible:false, news:false, bills:false, goals:false },
    };
  },

  getConfig() {
    try {
      const s = localStorage.getItem('nx_dashboard_cfg');
      return s ? Object.assign({}, CustomerPages._defaultConfig(), JSON.parse(s)) : CustomerPages._defaultConfig();
    } catch(e) { return CustomerPages._defaultConfig(); }
  },

  saveConfig(cfg) {
    localStorage.setItem('nx_dashboard_cfg', JSON.stringify(cfg));
    if (cfg.theme) App.applyTheme(cfg.theme);
    App.navigate('customer-dashboard');
    App.toast('Dashboard saved!', 'success');
  },

  resetConfig() {
    localStorage.removeItem('nx_dashboard_cfg');
    App.navigate('customer-dashboard');
    App.toast('Dashboard reset to defaults', 'default');
  },

  // ===== SECTION RENDERERS =====
  _renderKPI(cfg, totalBalance, monthlyIn, monthlyOut, saved) {
    if (!cfg.kpi.visible) return '';
    const c = cfg.kpi.cards;
    const cards = [
      c.balance ? `<div class="stat-card">
        <div class="flex items-center justify-between">
          <div class="stat-card-label">Total Balance</div>
          <div class="stat-card-icon" style="background:#EFF6FF"><i class="fa-solid fa-wallet" style="color:#3B82F6"></i></div>
        </div>
        <div class="stat-card-value privacy-sensitive">${App.fmt.currency(totalBalance)}</div>
        <div class="stat-card-change up"><i class="fa-solid fa-arrow-up"></i> +2.4% this month</div>
      </div>` : '',
      c.income ? `<div class="stat-card">
        <div class="flex items-center justify-between">
          <div class="stat-card-label">Monthly Income</div>
          <div class="stat-card-icon" style="background:#F0FDF4"><i class="fa-solid fa-arrow-down-to-line" style="color:#22C55E"></i></div>
        </div>
        <div class="stat-card-value privacy-sensitive">${App.fmt.currency(monthlyIn)}</div>
        <div class="stat-card-change up"><i class="fa-solid fa-arrow-up"></i> +14.1% vs last month</div>
      </div>` : '',
      c.spend ? `<div class="stat-card">
        <div class="flex items-center justify-between">
          <div class="stat-card-label">Monthly Spend</div>
          <div class="stat-card-icon" style="background:#FEF2F2"><i class="fa-solid fa-arrow-up-from-line" style="color:#EF4444"></i></div>
        </div>
        <div class="stat-card-value privacy-sensitive">${App.fmt.currency(monthlyOut)}</div>
        <div class="stat-card-change down"><i class="fa-solid fa-arrow-up"></i> +3.7% vs last month</div>
      </div>` : '',
      c.saved ? `<div class="stat-card">
        <div class="flex items-center justify-between">
          <div class="stat-card-label">Net Saved</div>
          <div class="stat-card-icon" style="background:#F5F3FF"><i class="fa-solid fa-piggy-bank" style="color:#8B5CF6"></i></div>
        </div>
        <div class="stat-card-value privacy-sensitive" style="color:var(--success)">${App.fmt.currency(saved)}</div>
        <div class="stat-card-change up"><i class="fa-solid fa-arrow-up"></i> +8.9% vs last month</div>
      </div>` : '',
    ].filter(Boolean);
    const visCount = cards.length;
    const gridCls = cfg.kpi.layout === 'grid'
      ? (visCount <= 2 ? 'grid-2' : 'grid-2')
      : (visCount === 4 ? 'grid-4' : visCount === 3 ? 'grid-3' : visCount === 2 ? 'grid-2' : '');
    return `<div class="grid ${gridCls}">${cards.join('')}</div>`;
  },

  _renderCharts(cfg) {
    if (!cfg.charts.visible) return '';
    const h = cfg.charts.chartSize === 'compact' ? '160px' : cfg.charts.chartSize === 'large' ? '340px' : '240px';
    const both = cfg.charts.income && cfg.charts.category;
    if (!cfg.charts.income && !cfg.charts.category) return '';
    if (!both) {
      return `<div class="card">
        ${cfg.charts.income ? `<div class="card-header"><div><div class="card-title">Income vs Expenses</div><div class="card-subtitle">Last 7 months</div></div></div><div style="height:${h}"><canvas id="incomeChart"></canvas></div>` : ''}
        ${cfg.charts.category ? `<div class="card-header"><div class="card-title">Spending by Category</div></div><div style="height:${h}"><canvas id="catChart"></canvas></div>` : ''}
      </div>`;
    }
    return `<div class="grid grid-2-1">
      <div class="card">
        <div class="card-header">
          <div><div class="card-title">Income vs Expenses</div><div class="card-subtitle">Last 7 months</div></div>
          <div class="tabs"><div class="tab active">Monthly</div><div class="tab">Weekly</div></div>
        </div>
        <div style="height:${h}"><canvas id="incomeChart"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Spending by Category</div></div>
        <div style="height:${h === '240px' ? '200px' : h}"><canvas id="catChart"></canvas></div>
      </div>
    </div>`;
  },

  _renderAccounts(accs, cfg) {
    if (!cfg.accounts.visible) return '';
    return `<div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div style="font-size:15px;font-weight:600">My Accounts</div>
        <button class="btn btn-secondary btn-sm" onclick="App.navigate('customer-settings')"><i class="fa-solid fa-gear"></i> Manage</button>
      </div>
      <div class="grid grid-3">
        ${accs.map(a=>`
        <div class="account-card ${a.color}" onclick="App.navigate('customer-statement')">
          ${a.frozen?'<div class="account-card-badge"><i class="fa-solid fa-snowflake"></i> Frozen</div>':''}
          <div><div class="account-card-type">${a.type}</div></div>
          <div style="display:flex;align-items:flex-end;justify-content:space-between">
            <div>
              <div class="account-card-balance${(App.state.privacyMode||App.state.hiddenBalances.includes(a.id))?' blurred':''}" id="balance-${a.id}" data-account-id="${a.id}">${App.fmt.currency(a.balance)}</div>
              <div class="account-card-number">${a.iban.slice(-9)}</div>
            </div>
            <button class="account-balance-toggle${App.state.hiddenBalances.includes(a.id)?' hidden-balance':''}" id="acc-eye-${a.id}" title="${App.state.hiddenBalances.includes(a.id)?'Show balance':'Hide balance'}" onclick="App.toggleAccountBalance('${a.id}',event)">
              <i class="fa-solid ${App.state.hiddenBalances.includes(a.id)?'fa-eye-slash':'fa-eye'}"></i>
            </button>
          </div>
        </div>`).join('')}
      </div>
    </div>`;
  },

  _renderActivity(txs, cfg) {
    if (!cfg.activity.visible) return '';
    const showTx = cfg.activity.transactions;
    const showQA = cfg.activity.quickActions;
    const showBH = cfg.activity.budgetHealth;
    if (!showTx && !showQA && !showBH) return '';
    const sidebar = (showQA || showBH) ? `
      <div style="display:flex;flex-direction:column;gap:16px">
        ${showQA ? `<div class="card card-sm">
          <div class="card-header" style="margin-bottom:12px"><div class="card-title">Quick Actions</div></div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <button class="btn btn-secondary btn-full" onclick="App.navigate('customer-budget')"><i class="fa-solid fa-wallet" style="color:var(--accent)"></i> Budget Tools</button>
            <button class="btn btn-secondary btn-full" onclick="App.navigate('customer-receipts')"><i class="fa-solid fa-receipt" style="color:var(--success)"></i> Upload Receipt</button>
            <button class="btn btn-secondary btn-full" onclick="App.navigate('customer-messages')"><i class="fa-solid fa-message" style="color:var(--purple)"></i> Message FA</button>
            <button class="btn btn-secondary btn-full" onclick="CustomerPages.showFreezeModal()"><i class="fa-solid fa-snowflake" style="color:var(--info)"></i> Freeze Account</button>
          </div>
        </div>` : ''}
        ${showBH ? `<div class="card card-sm">
          <div class="card-title" style="margin-bottom:12px">Budget Health</div>
          ${Data.budgets.slice(0,3).map(b=>{const pct=App.fmt.percent(b.spent,b.limit);const cls=pct>100?'high':pct>75?'med':'low';return `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
              <span>${b.icon} ${b.category}</span><span style="color:${pct>100?'var(--danger)':'var(--text-muted)'}">${pct}%</span>
            </div>
            <div class="budget-bar"><div class="budget-bar-fill ${cls}" style="width:${Math.min(pct,100)}%"></div></div>
          </div>`;}).join('')}
          <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:4px" onclick="App.navigate('customer-budget')">View all <i class="fa-solid fa-arrow-right"></i></button>
        </div>` : ''}
      </div>` : '';
    if (showTx && sidebar) {
      return `<div class="grid grid-2-1">
        <div class="card">
          <div class="card-header">
            <div class="card-title">Recent Transactions</div>
            <button class="btn btn-ghost btn-sm" onclick="App.navigate('customer-statement')">View all <i class="fa-solid fa-arrow-right"></i></button>
          </div>
          <div class="tx-list">${txs.filter(t=>!t.hidden).slice(0,5).map(t=>`
          <div class="tx-item">
            <div class="tx-icon" style="background:${t.type==='credit'?'#F0FDF4':'#F1F5F9'}"><span style="font-size:18px">${t.icon}</span></div>
            <div class="tx-info">
              <div class="tx-name">${t.name}</div>
              <div class="tx-date">${App.fmt.date(t.date)} · <span class="tag" style="font-size:10px;padding:2px 6px">${t.category}</span></div>
            </div>
            <div class="tx-amount ${t.type} privacy-sensitive">${t.type==='credit'?'+':''}${App.fmt.currency(Math.abs(t.amount))}</div>
          </div>`).join('')}</div>
        </div>
        ${sidebar}
      </div>`;
    }
    if (showTx) {
      return `<div class="card">
        <div class="card-header">
          <div class="card-title">Recent Transactions</div>
          <button class="btn btn-ghost btn-sm" onclick="App.navigate('customer-statement')">View all <i class="fa-solid fa-arrow-right"></i></button>
        </div>
        <div class="tx-list">${txs.filter(t=>!t.hidden).slice(0,5).map(t=>`
        <div class="tx-item">
          <div class="tx-icon" style="background:${t.type==='credit'?'#F0FDF4':'#F1F5F9'}"><span style="font-size:18px">${t.icon}</span></div>
          <div class="tx-info">
            <div class="tx-name">${t.name}</div>
            <div class="tx-date">${App.fmt.date(t.date)}</div>
          </div>
          <div class="tx-amount ${t.type} privacy-sensitive">${t.type==='credit'?'+':''}${App.fmt.currency(Math.abs(t.amount))}</div>
        </div>`).join('')}</div>
      </div>`;
    }
    return `<div class="grid ${sidebar?'grid-2':'grid-1'}">${sidebar}</div>`;
  },

  _renderExtras(cfg) {
    if (!cfg.extras.visible) return '';
    const parts = [];
    if (cfg.extras.news) parts.push(`
      <div class="card">
        <div class="card-header"><div class="card-title">News Headlines</div><button class="btn btn-ghost btn-sm" onclick="App.navigate('customer-news')">More <i class="fa-solid fa-arrow-right"></i></button></div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${Data.news.slice(0,3).map(n=>`
          <div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border-light);cursor:pointer" onclick="App.navigate('customer-news')">
            <div style="font-size:24px">${n.emoji}</div>
            <div>
              <div style="font-size:11px;font-weight:600;color:var(--accent);text-transform:uppercase">${n.category}</div>
              <div style="font-size:13px;font-weight:500;line-height:1.4">${n.title}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${n.source} · ${n.time}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>`);
    if (cfg.extras.bills) parts.push(`
      <div class="card">
        <div class="card-header"><div class="card-title">Upcoming Bills</div><span class="badge badge-warning">3 due soon</span></div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[['⚡ British Gas','£89.20','18 May','3 days'],['🏛️ Council Tax','£164.00','22 May','7 days'],['🏠 Rent','£950.00','1 Jun','17 days']].map(([name,amt,date,days])=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:var(--surface-2);border-radius:8px">
            <div>
              <div style="font-size:13.5px;font-weight:500">${name}</div>
              <div style="font-size:11px;color:var(--text-muted)">Due ${date} · ${days}</div>
            </div>
            <div class="privacy-sensitive" style="font-weight:700;font-size:15px">${amt}</div>
          </div>`).join('')}
        </div>
      </div>`);
    if (cfg.extras.goals) parts.push(`
      <div class="card">
        <div class="card-header"><div class="card-title">Savings Goals</div><button class="btn btn-primary btn-sm" onclick="App.toast('Add goal coming soon','default')"><i class="fa-solid fa-plus"></i> Add</button></div>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${[['🏖️ Holiday Fund','£2,400','£4,000',60,'var(--accent)'],['🚗 New Car','£8,150','£15,000',54,'var(--success)'],['🏠 House Deposit','£22,000','£40,000',55,'var(--purple)']].map(([name,curr,target,pct,color])=>`
          <div>
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
              <span style="font-weight:500">${name}</span>
              <span class="privacy-sensitive" style="color:var(--text-muted)">${curr} of ${target}</span>
            </div>
            <div class="budget-bar" style="height:10px"><div class="budget-bar-fill" style="width:${pct}%;background:${color}"></div></div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:3px">${pct}% of goal reached</div>
          </div>`).join('')}
        </div>
      </div>`);
    if (!parts.length) return '';
    const gridCls = parts.length === 1 ? '' : parts.length === 2 ? 'grid grid-2' : 'grid grid-3';
    return `<div class="${gridCls}">${parts.join('')}</div>`;
  },

  // ===== MAIN DASHBOARD RENDER =====
  renderDashboard() {
    const u = App.state.user;
    const accs = Data.accounts.filter(a=>a.userId===u.id);
    const txs = Data.transactions.filter(t=>accs.some(a=>a.id===t.accountId));
    const totalBalance = accs.reduce((s,a)=>s+a.balance,0);
    const monthlyIn = Data.monthlyData.income.slice(-1)[0];
    const monthlyOut = Data.monthlyData.expenses.slice(-1)[0];
    const saved = monthlyIn - monthlyOut;
    const cfg = CustomerPages.getConfig();

    const sectionMap = {
      kpi:       () => CustomerPages._renderKPI(cfg, totalBalance, monthlyIn, monthlyOut, saved),
      charts:    () => CustomerPages._renderCharts(cfg),
      accounts:  () => CustomerPages._renderAccounts(accs, cfg),
      activity:  () => CustomerPages._renderActivity(txs, cfg),
      extras:    () => CustomerPages._renderExtras(cfg),
    };
    const sectionLabels = { kpi:'Summary Cards', charts:'Charts', accounts:'Accounts', activity:'Recent Activity', extras:'Extras' };
    const sections = cfg.sectionOrder.map(id => {
      if (!sectionMap[id]) return '';
      return `<div class="dash-section-wrap" draggable="true" data-section="${id}"
        ondragstart="CustomerPages._dashDragStart(event,'${id}')"
        ondragover="CustomerPages._dashDragOver(event,'${id}')"
        ondragleave="CustomerPages._dashDragLeave(event)"
        ondrop="CustomerPages._dashDrop(event,'${id}')"
        ondragend="CustomerPages._dashDragEnd(event)">
        <div class="dash-section-handle" title="Drag to reorder">
          <span><i class="fa-solid fa-grip-vertical" style="margin-right:5px;font-size:10px"></i>${sectionLabels[id]||id}</span>
          <i class="fa-solid fa-grip-horizontal" style="font-size:11px"></i>
        </div>
        ${sectionMap[id]()}
      </div>`;
    }).join('');

    return `
    <div class="app-layout">
      ${App.buildSidebar('customer','customer-dashboard')}
      <div class="main-content">
        ${App.buildHeader('Dashboard', `Welcome back, ${u.name.split(' ')[0]}`)}
        <div class="page-content">

          ${accs.some(a=>a.frozen) ? `<div class="frozen-banner"><i class="fa-solid fa-snowflake"></i><div><h4>Account Frozen</h4><p>One or more accounts are frozen. Go to Settings to manage.</p></div></div>` : ''}

          <div style="display:flex;align-items:center;justify-content:space-between;background:var(--surface);border:1px solid var(--border-light);border-radius:var(--radius-sm);padding:10px 16px;box-shadow:var(--shadow-xs)">
            <div style="font-size:13px;color:var(--text-muted)"><i class="fa-solid fa-arrows-up-down" style="margin-right:6px"></i>Drag sections below to reorder your dashboard</div>
            <button class="btn btn-primary btn-sm" onclick="CustomerPages.showCustomizePanel()">
              <i class="fa-solid fa-sliders"></i> Customise Widgets
            </button>
          </div>

          ${sections}

        </div>
      </div>
    </div>`;
  },

  initDashboard() {
    const cfg = CustomerPages.getConfig();
    if (cfg.charts.visible && cfg.charts.income) {
      App.createChart('incomeChart', {
        type: 'bar',
        data: {
          labels: Data.monthlyData.labels,
          datasets: [
            { label:'Income', data:Data.monthlyData.income, backgroundColor:'rgba(34,197,94,0.8)', borderRadius:6, borderSkipped:false },
            { label:'Expenses', data:Data.monthlyData.expenses, backgroundColor:'rgba(239,68,68,0.7)', borderRadius:6, borderSkipped:false },
          ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ padding:16, font:{ size:12, family:'Inter' } } } }, scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ callback:v=>'£'+v.toLocaleString() } } } }
      });
    }
    if (cfg.charts.visible && cfg.charts.category) {
      App.createChart('catChart', {
        type: 'doughnut',
        data: {
          labels: Data.categorySpend.labels,
          datasets: [{ data:Data.categorySpend.data, backgroundColor:['#22C55E','#F59E0B','#3B82F6','#EF4444','#8B5CF6','#0066FF','#14B8A6'], borderWidth:0, hoverOffset:8 }]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ padding:10, font:{ size:11, family:'Inter' }, boxWidth:12 } } }, cutout:'65%' }
      });
    }
  },

  // ===== CUSTOMISE PANEL =====
  showCustomizePanel() {
    const cfg = JSON.parse(JSON.stringify(CustomerPages.getConfig()));
    CustomerPages._wcCurrentOrder = cfg.sectionOrder.slice();
    const renderRow = (id, idx, total) => CustomerPages._wcBuildRow(id, idx, total, cfg);

    App.openModal(`
      <div class="modal" style="max-width:580px">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-sliders" style="color:var(--accent);margin-right:8px"></i>Customise Dashboard</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="gap:10px;max-height:70vh;overflow-y:auto" id="wc-body">
          <div class="alert alert-info" style="font-size:12px">
            <i class="fa-solid fa-circle-info"></i>
            <div>Use the arrows to reorder sections. Toggles show or hide each widget. Changes are saved when you click <strong>Apply</strong>.</div>
          </div>
          <div style="background:var(--surface);border:1.5px solid var(--border);border-radius:10px;padding:14px 16px">
            <div style="font-size:13px;font-weight:600;margin-bottom:10px"><i class="fa-solid fa-palette" style="color:var(--accent);margin-right:6px"></i>Accent Colour</div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              ${[['#0066FF','Blue'],['#22C55E','Green'],['#8B5CF6','Purple'],['#F59E0B','Amber'],['#EF4444','Red']].map(([c,name])=>`
              <label style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer">
                <input type="radio" name="wc-theme" value="${c}" ${cfg.theme===c?'checked':''} style="display:none">
                <div class="wc-theme-dot" data-color="${c}" style="width:32px;height:32px;border-radius:50%;background:${c};border:3px solid ${cfg.theme===c?'var(--text)':'transparent'};transition:border-color 0.15s;cursor:pointer" onclick="document.querySelectorAll('.wc-theme-dot').forEach(d=>d.style.borderColor='transparent');this.style.borderColor='var(--text)';this.previousElementSibling.checked=true;App.applyTheme('${c}')"></div>
                <span style="font-size:10px;color:var(--text-muted)">${name}</span>
              </label>`).join('')}
            </div>
          </div>
          <div id="wc-sections" style="display:flex;flex-direction:column;gap:8px">
            ${cfg.sectionOrder.map((id,i)=>renderRow(id,i,cfg.sectionOrder.length)).join('')}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost btn-sm" onclick="CustomerPages.resetConfig()"><i class="fa-solid fa-rotate-left"></i> Reset</button>
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="modal-confirm-btn"><i class="fa-solid fa-check"></i> Apply</button>
        </div>
      </div>`, () => CustomerPages._applyConfig());
  },

  _sectionDesc(id, cfg) {
    const descs = {
      kpi: () => { const c=cfg.kpi.cards; const n=[c.balance,c.income,c.spend,c.saved].filter(Boolean).length; return `${n} of 4 cards · ${cfg.kpi.layout==='grid'?'2×2 grid':'single row'}`; },
      charts: () => { const n=[cfg.charts.income,cfg.charts.category].filter(Boolean).length; return `${n} of 2 charts · ${cfg.charts.chartSize} size`; },
      accounts: () => 'Account balance cards',
      activity: () => { const n=[cfg.activity.transactions,cfg.activity.quickActions,cfg.activity.budgetHealth].filter(Boolean).length; return `${n} of 3 widgets active`; },
      extras: () => { const n=[cfg.extras.news,cfg.extras.bills,cfg.extras.goals].filter(Boolean).length; return `${n} of 3 extra widgets enabled`; },
    };
    return descs[id] ? descs[id]() : '';
  },

  _renderSubOptions(id, cfg) {
    if (id === 'kpi') return `
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-light);display:flex;flex-direction:column;gap:10px">
        <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">Individual Cards</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${[['balance','💰 Total Balance'],['income','📈 Monthly Income'],['spend','📉 Monthly Spend'],['saved','🐷 Net Saved']].map(([k,l])=>`
          <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;background:var(--surface-2);border-radius:6px">
            <input type="checkbox" class="wc-kpi-card" data-key="${k}" ${cfg.kpi.cards[k]?'checked':''} style="accent-color:var(--accent)"> ${l}
          </label>`).join('')}
        </div>
        <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-top:4px">Layout</div>
        <div style="display:flex;gap:8px">
          <label style="flex:1;display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;border:1.5px solid ${cfg.kpi.layout==='row'?'var(--accent)':'var(--border)'};border-radius:6px;background:${cfg.kpi.layout==='row'?'var(--accent-glow)':''}">
            <input type="radio" name="wc-kpi-layout" value="row" ${cfg.kpi.layout==='row'?'checked':''} style="accent-color:var(--accent)"> <span><i class="fa-solid fa-grip-lines" style="margin-right:4px"></i>Single row</span>
          </label>
          <label style="flex:1;display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;border:1.5px solid ${cfg.kpi.layout==='grid'?'var(--accent)':'var(--border)'};border-radius:6px;background:${cfg.kpi.layout==='grid'?'var(--accent-glow)':''}">
            <input type="radio" name="wc-kpi-layout" value="grid" ${cfg.kpi.layout==='grid'?'checked':''} style="accent-color:var(--accent)"> <span><i class="fa-solid fa-grip" style="margin-right:4px"></i>2 × 2 grid</span>
          </label>
        </div>
      </div>`;
    if (id === 'charts') return `
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-light);display:flex;flex-direction:column;gap:10px">
        <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">Show Charts</div>
        <div style="display:flex;gap:8px">
          <label style="flex:1;display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;background:var(--surface-2);border-radius:6px">
            <input type="checkbox" class="wc-chart" data-key="income" ${cfg.charts.income?'checked':''} style="accent-color:var(--accent)"> 📊 Income vs Expenses
          </label>
          <label style="flex:1;display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;background:var(--surface-2);border-radius:6px">
            <input type="checkbox" class="wc-chart" data-key="category" ${cfg.charts.category?'checked':''} style="accent-color:var(--accent)"> 🍕 Category Breakdown
          </label>
        </div>
        <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-top:4px">Chart Height</div>
        <div style="display:flex;gap:8px">
          ${[['compact','Compact'],['normal','Normal'],['large','Large']].map(([v,l])=>`
          <label style="flex:1;text-align:center;cursor:pointer;padding:8px;border:1.5px solid ${cfg.charts.chartSize===v?'var(--accent)':'var(--border)'};border-radius:6px;font-size:12px;font-weight:500;background:${cfg.charts.chartSize===v?'var(--accent-glow)':''}">
            <input type="radio" name="wc-chart-size" value="${v}" ${cfg.charts.chartSize===v?'checked':''} style="display:none"> ${l}
          </label>`).join('')}
        </div>
      </div>`;
    if (id === 'activity') return `
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-light);display:flex;flex-direction:column;gap:8px">
        <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">Widgets</div>
        ${[['transactions','📋 Recent Transactions'],['quickActions','⚡ Quick Actions'],['budgetHealth','💸 Budget Health']].map(([k,l])=>`
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;background:var(--surface-2);border-radius:6px">
          <input type="checkbox" class="wc-activity" data-key="${k}" ${cfg.activity[k]?'checked':''} style="accent-color:var(--accent)"> ${l}
        </label>`).join('')}
      </div>`;
    if (id === 'extras') return `
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border-light);display:flex;flex-direction:column;gap:8px">
        <div style="font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">Optional Widgets</div>
        ${[['news','📰 News Headlines'],['bills','📅 Upcoming Bills'],['goals','🎯 Savings Goals']].map(([k,l])=>`
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;padding:8px;background:var(--surface-2);border-radius:6px">
          <input type="checkbox" class="wc-extras" data-key="${k}" ${cfg.extras[k]?'checked':''} style="accent-color:var(--accent)"> ${l}
        </label>`).join('')}
      </div>`;
    return '';
  },

  _wcToggleSection(id, checked) {
    const sub = document.getElementById('wc-sub-'+id);
    if (sub) sub.style.cssText = checked ? '' : 'opacity:0.4;pointer-events:none';
  },

  _wcMove(id, dir, cfgStr) {
    const cfg = JSON.parse(cfgStr.replace(/&quot;/g,'"'));
    const order = cfg.sectionOrder;
    const idx = order.indexOf(id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= order.length) return;
    [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
    CustomerPages._rebuildWcPanel(cfg);
  },

  _wcBuildRow(id, i, total, cfg) {
    const sectionMeta = {
      kpi:{icon:'fa-gauge',label:'Summary Cards',color:'#3B82F6'},
      charts:{icon:'fa-chart-bar',label:'Charts',color:'#8B5CF6'},
      accounts:{icon:'fa-credit-card',label:'My Accounts',color:'#22C55E'},
      activity:{icon:'fa-list',label:'Activity Row',color:'#F59E0B'},
      extras:{icon:'fa-star',label:'Extra Widgets',color:'#EF4444'},
    };
    const m = sectionMeta[id]; const sec = cfg[id];
    return `
    <div class="wc-section-row" id="wc-row-${id}" draggable="true" data-id="${id}"
      style="background:var(--surface);border:1.5px solid var(--border);border-radius:10px;padding:14px 16px"
      ondragstart="CustomerPages._wcDragStart(event,'${id}')"
      ondragover="CustomerPages._wcDragOver(event,'${id}')"
      ondragleave="CustomerPages._wcDragLeave(event)"
      ondrop="CustomerPages._wcDrop(event,'${id}')">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="drag-handle" title="Drag to reorder"><i class="fa-solid fa-grip-vertical"></i></div>
        <div style="width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:${m.color}18;color:${m.color};font-size:15px;flex-shrink:0"><i class="fa-solid ${m.icon}"></i></div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:600">${m.label}</div>
          <div style="font-size:11px;color:var(--text-muted)">${CustomerPages._sectionDesc(id,cfg)}</div>
        </div>
        <div style="display:flex;gap:4px;align-items:center">
          <button class="btn btn-ghost btn-icon-sm" ${i===0?'disabled style="opacity:0.3"':''} onclick="CustomerPages._wcMove('${id}',-1,${JSON.stringify(cfg).replace(/"/g,'&quot;')})"><i class="fa-solid fa-chevron-up"></i></button>
          <button class="btn btn-ghost btn-icon-sm" ${i===total-1?'disabled style="opacity:0.3"':''} onclick="CustomerPages._wcMove('${id}',1,${JSON.stringify(cfg).replace(/"/g,'&quot;')})"><i class="fa-solid fa-chevron-down"></i></button>
          <label class="toggle" style="margin-left:6px"><input type="checkbox" ${sec.visible?'checked':''} onchange="CustomerPages._wcToggleSection('${id}',this.checked)"><span class="toggle-slider"></span></label>
        </div>
      </div>
      <div id="wc-sub-${id}" style="${!sec.visible?'opacity:0.4;pointer-events:none':''}">
        ${CustomerPages._renderSubOptions(id,cfg)}
      </div>
    </div>`;
  },

  _wcDragStart(event, id) {
    CustomerPages._wcDragging = id;
    event.currentTarget.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
  },

  _wcDragOver(event, id) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (id !== CustomerPages._wcDragging) {
      document.querySelectorAll('.wc-section-row').forEach(r => r.classList.remove('drag-over'));
      event.currentTarget.classList.add('drag-over');
    }
  },

  _wcDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
  },

  _wcDrop(event, targetId) {
    event.preventDefault();
    const dragId = CustomerPages._wcDragging;
    if (!dragId || dragId === targetId) {
      document.querySelectorAll('.wc-section-row').forEach(r => r.classList.remove('dragging','drag-over'));
      return;
    }
    const order = CustomerPages._wcCurrentOrder || [];
    const fromIdx = order.indexOf(dragId);
    const toIdx = order.indexOf(targetId);
    if (fromIdx > -1 && toIdx > -1) {
      order.splice(fromIdx, 1);
      order.splice(toIdx, 0, dragId);
      CustomerPages._wcCurrentOrder = order;
      const cfg = CustomerPages.getConfig();
      cfg.sectionOrder = order;
      CustomerPages._rebuildWcPanel(cfg);
    }
    CustomerPages._wcDragging = null;
  },

  _rebuildWcPanel(cfg) {
    const container = document.getElementById('wc-sections');
    if (!container) return;
    container.innerHTML = cfg.sectionOrder.map((id,i)=>CustomerPages._wcBuildRow(id,i,cfg.sectionOrder.length,cfg)).join('');
    CustomerPages._wcCurrentOrder = cfg.sectionOrder.slice();
  },

  // ===== LIVE DASHBOARD DRAG =====
  _dashDragStart(event, id) {
    CustomerPages._dashDragging = id;
    CustomerPages._dashDropPos = 'before';
    event.dataTransfer.effectAllowed = 'move';
    setTimeout(() => event.currentTarget.classList.add('dragging'), 0);
  },

  _dashDragOver(event, id) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (id === CustomerPages._dashDragging) return;
    document.querySelectorAll('.dash-section-wrap').forEach(e => e.classList.remove('dash-drag-over-top','dash-drag-over-bottom'));
    const rect = event.currentTarget.getBoundingClientRect();
    const isBefore = event.clientY < rect.top + rect.height / 2;
    event.currentTarget.classList.add(isBefore ? 'dash-drag-over-top' : 'dash-drag-over-bottom');
    CustomerPages._dashDropTarget = id;
    CustomerPages._dashDropPos = isBefore ? 'before' : 'after';
  },

  _dashDragLeave(event) {
    event.currentTarget.classList.remove('dash-drag-over-top','dash-drag-over-bottom');
  },

  _dashDrop(event, targetId) {
    event.preventDefault();
    document.querySelectorAll('.dash-section-wrap').forEach(e => e.classList.remove('dragging','dash-drag-over-top','dash-drag-over-bottom'));
    const dragId = CustomerPages._dashDragging;
    CustomerPages._dashDragging = null;
    if (!dragId || dragId === targetId) return;
    const cfg = CustomerPages.getConfig();
    const order = cfg.sectionOrder.slice();
    const fromIdx = order.indexOf(dragId);
    order.splice(fromIdx, 1);
    const toIdx = order.indexOf(targetId);
    order.splice(CustomerPages._dashDropPos === 'before' ? toIdx : toIdx + 1, 0, dragId);
    cfg.sectionOrder = order;
    CustomerPages.saveConfig(cfg);
  },

  _dashDragEnd(event) {
    document.querySelectorAll('.dash-section-wrap').forEach(e => e.classList.remove('dragging','dash-drag-over-top','dash-drag-over-bottom'));
    CustomerPages._dashDragging = null;
  },

  _applyConfig() {
    const cfg = CustomerPages.getConfig();
    // Read section order from current render state
    if (CustomerPages._wcCurrentOrder) cfg.sectionOrder = CustomerPages._wcCurrentOrder;
    // KPI section visibility & cards
    // read section visible state
    document.querySelectorAll('.wc-section-row').forEach((row, i) => {
      const toggle = row.querySelector('input[type="checkbox"]');
      const id = cfg.sectionOrder[i];
      if (id && toggle && cfg[id] !== undefined) cfg[id].visible = toggle.checked;
    });
    // KPI cards
    document.querySelectorAll('.wc-kpi-card').forEach(el => { cfg.kpi.cards[el.dataset.key] = el.checked; });
    const kpiLayout = document.querySelector('input[name="wc-kpi-layout"]:checked');
    if (kpiLayout) cfg.kpi.layout = kpiLayout.value;
    // Charts
    document.querySelectorAll('.wc-chart').forEach(el => { cfg.charts[el.dataset.key] = el.checked; });
    const chartSize = document.querySelector('input[name="wc-chart-size"]:checked');
    if (chartSize) cfg.charts.chartSize = chartSize.value;
    // Activity
    document.querySelectorAll('.wc-activity').forEach(el => { cfg.activity[el.dataset.key] = el.checked; });
    // Extras
    document.querySelectorAll('.wc-extras').forEach(el => { cfg.extras[el.dataset.key] = el.checked; });
    // Theme colour
    const themePick = document.querySelector('input[name="wc-theme"]:checked');
    if (themePick) cfg.theme = themePick.value;
    CustomerPages.saveConfig(cfg);
  },

  showFreezeModal() {
    const u = App.state.user;
    const accs = Data.accounts.filter(a=>a.userId===u.id);
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-snowflake" style="color:var(--info);margin-right:8px"></i>Account Freeze</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-info"><i class="fa-solid fa-circle-info"></i><div class="alert-body">Freezing an account blocks all new transactions immediately. You can unfreeze at any time.</div></div>
          ${accs.map(a=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--surface-2);border-radius:var(--radius-sm);border:1px solid var(--border)">
            <div>
              <div style="font-size:14px;font-weight:500">${a.type}</div>
              <div style="font-size:12px;color:var(--text-muted)">${a.iban.slice(-9)}</div>
            </div>
            <label class="toggle" title="${a.frozen?'Unfreeze':'Freeze'}">
              <input type="checkbox" ${a.frozen?'checked':''} onchange="CustomerPages.toggleFreeze('${a.id}',this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>`).join('')}
        </div>
      </div>`);
  },

  toggleFreeze(accId, frozen) {
    const acc = Data.accounts.find(a=>a.id===accId);
    if (acc) acc.frozen = frozen;
    App.toast(frozen ? `Account frozen` : `Account unfrozen`, frozen ? 'warning' : 'success');
  },

  renderStatement() {
    const u = App.state.user;
    const accs = Data.accounts.filter(a=>a.userId===u.id);
    let txs = Data.transactions.filter(t=>accs.some(a=>a.id===t.accountId));
    return `
    <div class="app-layout">
      ${App.buildSidebar('customer','customer-statement')}
      <div class="main-content">
        ${App.buildHeader('Statement','Transaction history')}
        <div class="page-content">
          <div class="card">
            <div class="search-bar" style="margin-bottom:20px">
              <div class="search-input-wrap">
                <div class="input-icon-wrap">
                  <i class="input-icon fa-solid fa-magnifying-glass"></i>
                  <input class="form-control" placeholder="Search transactions…" id="tx-search" oninput="CustomerPages.filterTx()">
                </div>
              </div>
              <select class="form-control" style="width:160px" id="tx-category" onchange="CustomerPages.filterTx()">
                <option value="">All categories</option>
                ${[...new Set(txs.map(t=>t.category))].map(c=>`<option>${c}</option>`).join('')}
              </select>
              <select class="form-control" style="width:140px" id="tx-type" onchange="CustomerPages.filterTx()">
                <option value="">All types</option>
                <option value="credit">Income</option>
                <option value="debit">Expenses</option>
              </select>
              <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;white-space:nowrap">
                <input type="checkbox" id="show-hidden" onchange="CustomerPages.filterTx()" style="accent-color:var(--accent)"> Show hidden
              </label>
              <button class="btn btn-secondary btn-sm" onclick="CustomerPages.exportStatement()"><i class="fa-solid fa-download"></i> Export</button>
            </div>
            <div class="table-wrap">
              <table class="table" id="tx-table">
                <thead><tr><th>Transaction</th><th>Category</th><th>Date</th><th>Status</th><th>Amount</th><th>Actions</th></tr></thead>
                <tbody id="tx-body">
                  ${CustomerPages.buildTxRows(txs, false)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  buildTxRows(txs, showHidden) {
    const filtered = showHidden ? txs : txs.filter(t=>!t.hidden);
    if (!filtered.length) return `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-muted)"><i class="fa-solid fa-inbox" style="font-size:24px;display:block;margin-bottom:8px"></i>No transactions found</td></tr>`;
    return filtered.map(t=>`
      <tr id="tx-row-${t.id}">
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="tx-icon" style="background:${t.type==='credit'?'#F0FDF4':'#F1F5F9'};width:36px;height:36px">
              <span>${t.icon}</span>
            </div>
            <div>
              <div style="font-weight:500">${t.name}</div>
              ${t.hidden?'<span class="badge badge-muted"><i class="fa-solid fa-eye-slash"></i> Hidden</span>':''}
            </div>
          </div>
        </td>
        <td><span class="tag">${t.category}</span></td>
        <td style="color:var(--text-secondary)">${App.fmt.date(t.date)}</td>
        <td><span class="badge ${t.type==='credit'?'badge-success':'badge-muted'}">${t.type==='credit'?'Credit':'Debit'}</span></td>
        <td class="privacy-sensitive" style="font-weight:600;color:${t.type==='credit'?'var(--success)':'var(--text)'}">
          ${t.type==='credit'?'+':''}${App.fmt.currency(Math.abs(t.amount))}
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn-ghost btn-icon btn-icon-sm" title="View details" onclick="CustomerPages.viewTxDetail('${t.id}')"><i class="fa-solid fa-eye"></i></button>
            <button class="btn btn-ghost btn-icon btn-icon-sm" title="${t.hidden?'Show':'Hide'}" onclick="CustomerPages.toggleTxHide('${t.id}')">
              <i class="fa-solid ${t.hidden?'fa-eye':'fa-eye-slash'}"></i>
            </button>
            <button class="btn btn-ghost btn-icon btn-icon-sm" title="Dispute" onclick="CustomerPages.disputeTx('${t.id}')"><i class="fa-solid fa-flag"></i></button>
          </div>
        </td>
      </tr>`).join('');
  },

  initStatement() {
    App.state._allTxs = Data.transactions.filter(t=>Data.accounts.filter(a=>a.userId===App.state.user.id).some(a=>a.id===t.accountId));
  },

  filterTx() {
    const search = document.getElementById('tx-search').value.toLowerCase();
    const cat = document.getElementById('tx-category').value;
    const type = document.getElementById('tx-type').value;
    const showHidden = document.getElementById('show-hidden').checked;
    let txs = App.state._allTxs || [];
    if (!showHidden) txs = txs.filter(t=>!t.hidden);
    if (search) txs = txs.filter(t=>t.name.toLowerCase().includes(search)||t.category.toLowerCase().includes(search));
    if (cat) txs = txs.filter(t=>t.category===cat);
    if (type) txs = txs.filter(t=>t.type===type);
    document.getElementById('tx-body').innerHTML = CustomerPages.buildTxRows(txs.length?txs:[], true);
    App.applyPrivacy();
  },

  toggleTxHide(id) {
    const tx = Data.transactions.find(t=>t.id===id);
    if (tx) {
      tx.hidden = !tx.hidden;
      CustomerPages.filterTx();
      App.toast(tx.hidden ? 'Transaction hidden' : 'Transaction visible', 'success');
    }
  },

  viewTxDetail(id) {
    const tx = Data.transactions.find(t=>t.id===id);
    if (!tx) return;
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Transaction Detail</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div style="text-align:center;padding:12px 0">
            <div style="font-size:40px;margin-bottom:8px">${tx.icon}</div>
            <div style="font-size:20px;font-weight:700">${tx.name}</div>
            <div style="font-size:28px;font-weight:800;color:${tx.type==='credit'?'var(--success)':'var(--text)'};margin-top:6px">
              ${tx.type==='credit'?'+':''}${App.fmt.currency(Math.abs(tx.amount))}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;background:var(--surface-2);border-radius:var(--radius-sm);padding:16px">
            ${[['Date', App.fmt.date(tx.date)],['Category',tx.category],['Type',tx.type==='credit'?'Credit (Incoming)':'Debit (Outgoing)'],['Account','Current Account'],['Reference','REF-'+tx.id],['Status','Completed']].map(([k,v])=>`
            <div style="display:flex;justify-content:space-between;font-size:13px">
              <span style="color:var(--text-muted)">${k}</span><span style="font-weight:500">${v}</span>
            </div>`).join('')}
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary" style="flex:1" onclick="CustomerPages.disputeTx('${tx.id}');App.closeModal()"><i class="fa-solid fa-flag"></i> Dispute</button>
            <button class="btn btn-secondary" style="flex:1" onclick="App.closeModal()"><i class="fa-solid fa-receipt"></i> Attach Receipt</button>
          </div>
        </div>
      </div>`);
  },

  disputeTx(id) {
    const tx = Data.transactions.find(t=>t.id===id);
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-flag" style="color:var(--danger);margin-right:8px"></i>Dispute Transaction</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-warning"><i class="fa-solid fa-triangle-exclamation"></i><div class="alert-body">Disputing: <strong>${tx?.name}</strong> — ${App.fmt.currency(Math.abs(tx?.amount||0))}</div></div>
          <div class="form-group">
            <label class="form-label">Reason for dispute</label>
            <select class="form-control">
              <option>I don't recognise this transaction</option>
              <option>Incorrect amount charged</option>
              <option>Duplicate transaction</option>
              <option>Item not received</option>
              <option>Other</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Additional details</label>
            <textarea class="form-control" rows="3" placeholder="Please provide any additional information…"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-danger" id="modal-confirm-btn"><i class="fa-solid fa-flag"></i> Submit Dispute</button>
        </div>
      </div>`, () => App.toast('Dispute submitted. We will review within 3-5 working days.', 'success', 4000));
  },

  exportStatement() {
    App.toast('Statement exported as PDF', 'success');
  },

  renderBudget() {
    const u = App.state.user;
    const budgets = Data.budgets.filter(b=>b.userId===u.id);
    const totalLimit = budgets.reduce((s,b)=>s+b.limit,0);
    const totalSpent = budgets.reduce((s,b)=>s+b.spent,0);
    return `
    <div class="app-layout">
      ${App.buildSidebar('customer','customer-budget')}
      <div class="main-content">
        ${App.buildHeader('Budget Tools','Manage your spending limits')}
        <div class="page-content">
          <div class="grid grid-3">
            <div class="stat-card">
              <div class="stat-card-label">Total Budget</div>
              <div class="stat-card-value privacy-sensitive">${App.fmt.currency(totalLimit)}</div>
              <div class="stat-card-change" style="color:var(--text-muted)">This month</div>
            </div>
            <div class="stat-card">
              <div class="stat-card-label">Total Spent</div>
              <div class="stat-card-value privacy-sensitive" style="color:${totalSpent>totalLimit?'var(--danger)':'var(--text)'}">${App.fmt.currency(totalSpent)}</div>
              <div class="stat-card-change ${totalSpent>totalLimit?'down':'up'}">
                <i class="fa-solid fa-arrow-${totalSpent>totalLimit?'up':'down'}"></i>
                ${App.fmt.percent(totalSpent,totalLimit)}% of budget used
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card-label">Remaining</div>
              <div class="stat-card-value privacy-sensitive" style="color:${totalLimit-totalSpent<0?'var(--danger)':'var(--success)'}">${App.fmt.currency(Math.max(0,totalLimit-totalSpent))}</div>
              <div class="stat-card-change up"><i class="fa-solid fa-piggy-bank"></i> Keep it up!</div>
            </div>
          </div>

          <div class="grid grid-2-1">
            <div class="card">
              <div class="card-header">
                <div class="card-title">Budget Categories</div>
                <button class="btn btn-primary btn-sm" onclick="CustomerPages.addBudgetModal()"><i class="fa-solid fa-plus"></i> Add Category</button>
              </div>
              <div style="display:flex;flex-direction:column;gap:18px" id="budget-list">
                ${budgets.map(b=>{
                  const pct = App.fmt.percent(b.spent,b.limit);
                  const cls = pct>=100?'high':pct>=75?'med':'low';
                  const remaining = b.limit - b.spent;
                  return `
                  <div class="budget-item" id="budget-${b.id}">
                    <div class="budget-item-header">
                      <div class="budget-item-name">
                        <span>${b.icon}</span>${b.category}
                        ${pct>=100?'<span class="badge badge-danger">Over budget</span>':pct>=75?'<span class="badge badge-warning">Near limit</span>':''}
                      </div>
                      <div style="display:flex;align-items:center;gap:8px">
                        <span class="budget-item-amounts privacy-sensitive">${App.fmt.currency(b.spent)} / ${App.fmt.currency(b.limit)}</span>
                        <button class="btn btn-ghost btn-icon-sm" onclick="CustomerPages.editBudget('${b.id}')"><i class="fa-solid fa-pen"></i></button>
                      </div>
                    </div>
                    <div class="budget-bar"><div class="budget-bar-fill ${cls}" style="width:${Math.min(pct,100)}%"></div></div>
                    <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:3px">
                      <span>${pct}% used</span>
                      <span class="privacy-sensitive">${remaining>=0?App.fmt.currency(remaining)+' remaining':'£'+Math.abs(remaining).toFixed(2)+' over'}</span>
                    </div>
                  </div>`;
                }).join('')}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:16px">
              <div class="card">
                <div class="card-title" style="margin-bottom:16px">Spend Distribution</div>
                <div class="chart-wrap" style="height:200px"><canvas id="budgetPie"></canvas></div>
              </div>
              <div class="card">
                <div class="card-title" style="margin-bottom:12px">Spending Tips</div>
                <div style="display:flex;flex-direction:column;gap:10px">
                  <div class="alert alert-warning" style="font-size:12px"><i class="fa-solid fa-triangle-exclamation"></i><div>Shopping budget exceeded by £6. Consider reviewing subscriptions.</div></div>
                  <div class="alert alert-success" style="font-size:12px"><i class="fa-solid fa-check-circle"></i><div>Transport spending is well within budget this month.</div></div>
                  <div class="alert alert-info" style="font-size:12px"><i class="fa-solid fa-lightbulb"></i><div>You could save £45/mo by reducing dining spend to budget level.</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  initBudget() {
    const b = Data.budgets;
    App.createChart('budgetPie', {
      type: 'doughnut',
      data: {
        labels: b.map(x=>x.category),
        datasets: [{ data: b.map(x=>x.spent), backgroundColor: b.map(x=>x.color), borderWidth:0 }]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ padding:8, font:{ size:10, family:'Inter' }, boxWidth:10 } } }, cutout:'60%' }
    });
  },

  editBudget(id) {
    const b = Data.budgets.find(x=>x.id===id);
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">${b?.icon} Edit Budget — ${b?.category}</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Monthly limit (£)</label>
            <input class="form-control" type="number" id="budget-limit-input" value="${b?.limit}" min="0" step="10">
          </div>
          <div class="form-group">
            <label class="form-label">Alert me when I reach</label>
            <select class="form-control">
              <option>75% of budget</option><option>90% of budget</option><option>100% of budget</option><option>No alerts</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="modal-confirm-btn"><i class="fa-solid fa-check"></i> Save</button>
        </div>
      </div>`, () => {
        const val = parseFloat(document.getElementById('budget-limit-input').value);
        if (b && val > 0) { b.limit = val; App.toast('Budget updated!', 'success'); App.navigate('customer-budget'); }
      });
  },

  addBudgetModal() {
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Add Budget Category</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Category name</label><input class="form-control" placeholder="e.g. Holidays"></div>
          <div class="form-group"><label class="form-label">Monthly limit (£)</label><input class="form-control" type="number" value="100" min="0"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="modal-confirm-btn"><i class="fa-solid fa-plus"></i> Add</button>
        </div>
      </div>`, () => App.toast('Budget category added!', 'success'));
  },

  renderReceipts() {
    const u = App.state.user;
    const receipts = Data.receipts.filter(r=>r.userId===u.id);
    return `
    <div class="app-layout">
      ${App.buildSidebar('customer','customer-receipts')}
      <div class="main-content">
        ${App.buildHeader('Receipts','Upload and manage your itemised receipts')}
        <div class="page-content">
          <div class="card">
            <div class="upload-zone" id="upload-zone" onclick="CustomerPages.triggerUpload()" ondragover="CustomerPages.dragOver(event)" ondragleave="CustomerPages.dragLeave(event)" ondrop="CustomerPages.dropFile(event)">
              <div class="upload-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>
              <div class="upload-text">Drop receipt here, or click to browse</div>
              <div class="upload-hint">Supports JPG, PNG, PDF · Max 10MB per file</div>
              <input type="file" id="file-input" hidden accept="image/*,.pdf" onchange="CustomerPages.handleUpload(event)">
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <div class="card-title">Saved Receipts</div>
              <div class="tabs">
                <div class="tab active">All</div>
                <div class="tab">Groceries</div>
                <div class="tab">Shopping</div>
              </div>
            </div>
            <div class="receipt-grid">
              ${receipts.map(r=>`
              <div class="receipt-card" onclick="CustomerPages.viewReceipt('${r.id}')">
                <div class="receipt-thumb">${r.icon}</div>
                <div class="receipt-info">
                  <div class="receipt-name">${r.name}</div>
                  <div class="receipt-amount privacy-sensitive">${App.fmt.currency(r.amount)}</div>
                  <div class="receipt-date">${App.fmt.date(r.date)}</div>
                </div>
              </div>`).join('')}
              <div class="receipt-card" style="border:2px dashed var(--border);background:var(--surface-2);cursor:pointer;display:flex;align-items:center;justify-content:center;min-height:160px" onclick="CustomerPages.triggerUpload()">
                <div style="text-align:center;color:var(--text-muted)">
                  <i class="fa-solid fa-plus" style="font-size:24px;display:block;margin-bottom:6px"></i>
                  <div style="font-size:12px">Add receipt</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  initReceipts() {},

  triggerUpload() { document.getElementById('file-input')?.click(); },
  dragOver(e) { e.preventDefault(); document.getElementById('upload-zone')?.classList.add('drag-over'); },
  dragLeave(_e) { document.getElementById('upload-zone')?.classList.remove('drag-over'); },
  dropFile(e) {
    e.preventDefault();
    document.getElementById('upload-zone')?.classList.remove('drag-over');
    App.toast('Uploading receipt…', 'default');
    setTimeout(() => App.toast('Receipt uploaded and processed!', 'success'), 1500);
  },
  handleUpload(e) {
    if (e.target.files.length) {
      App.toast('Uploading ' + e.target.files[0].name + '…', 'default');
      setTimeout(() => App.toast('Receipt uploaded and processed!', 'success'), 1500);
    }
  },

  viewReceipt(id) {
    const r = Data.receipts.find(x=>x.id===id);
    if (!r) return;
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">${r.icon} ${r.name}</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div style="background:var(--surface-2);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border)">
            <div style="display:flex;justify-content:space-between;margin-bottom:12px">
              <div style="font-size:14px;font-weight:600">${r.merchant}</div>
              <div style="font-size:12px;color:var(--text-muted)">${App.fmt.date(r.date)}</div>
            </div>
            <div style="border-top:1px dashed var(--border);padding-top:12px;display:flex;flex-direction:column;gap:8px">
              ${r.items.map(item=>`
              <div style="display:flex;justify-content:space-between;font-size:13px">
                <span>${item.name}</span><span class="privacy-sensitive" style="font-weight:500">${App.fmt.currency(item.price)}</span>
              </div>`).join('')}
            </div>
            <div style="border-top:1px solid var(--border);margin-top:12px;padding-top:12px;display:flex;justify-content:space-between;font-weight:700">
              <span>TOTAL</span><span class="privacy-sensitive">${App.fmt.currency(r.amount)}</span>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary" style="flex:1" onclick="App.toast('Downloaded!','success')"><i class="fa-solid fa-download"></i> Download</button>
            <button class="btn btn-danger btn-secondary" style="flex:1" onclick="App.toast('Receipt deleted','warning');App.closeModal()"><i class="fa-solid fa-trash"></i> Delete</button>
          </div>
        </div>
      </div>`);
  },

  _msgContacts: [
    { id:'FA001', name:'David Chen', role:'Your Financial Advisor', initials:'DC', color:'#F59E0B', preview:"I can see it — it's flagged…", unread:1 },
    { id:'SUPPORT', name:'Codeherence Support', role:'Customer Support', initials:'CS', color:'#0066FF', preview:'How can we help?', unread:0 },
  ],

  renderMessages() {
    const u = App.state.user;
    const contacts = CustomerPages._msgContacts;
    const msgs = Data.messages.filter(m=>(m.from===u.id&&m.to==='FA001')||(m.from==='FA001'&&m.to===u.id));
    return `
    <div class="app-layout">
      ${App.buildSidebar('customer','customer-messages')}
      <div class="main-content">
        ${App.buildHeader('Messages','In-app secure messaging')}
        <div class="page-content">
          <div class="messaging-layout" id="messaging-layout">
            <div class="msg-sidebar">
              <div class="msg-sidebar-header">Conversations</div>
              <div class="msg-list">
                ${contacts.map((c,i)=>`
                <div class="msg-contact${i===0?' active':''}" data-id="${c.id}" onclick="CustomerPages.selectContact('${c.id}')">
                  <div class="msg-contact-avatar" style="background:${c.color}">${c.initials}</div>
                  <div style="flex:1;min-width:0">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <div class="msg-contact-name">${c.name}</div>
                      ${c.unread?`<span class="msg-unread">${c.unread}</span>`:''}
                    </div>
                    <div class="msg-contact-preview">${c.preview}</div>
                  </div>
                </div>`).join('')}
              </div>
            </div>
            <div class="msg-main">
              <div class="msg-header">
                <div style="display:flex;align-items:center;gap:6px">
                  <button class="btn btn-ghost btn-icon msg-back-btn" onclick="App.msgBack()" title="Back"><i class="fa-solid fa-chevron-left"></i></button>
                  <div class="msg-contact-avatar msg-chat-avatar" style="background:#F59E0B;width:38px;height:38px;font-size:15px">DC</div>
                  <div>
                    <div class="msg-chat-name" style="font-weight:600">David Chen</div>
                    <div class="msg-chat-status" style="font-size:12px;color:var(--success)"><i class="fa-solid fa-circle" style="font-size:8px"></i> Online</div>
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm"><i class="fa-solid fa-phone"></i> Call</button>
              </div>
              <div class="msg-body" id="msg-body">
                ${msgs.map(m=>`
                <div class="msg-bubble-wrap ${m.from===u.id?'mine':'theirs'}">
                  <div class="msg-bubble ${m.from===u.id?'mine':'theirs'}">${m.text}</div>
                  <div class="msg-time">${m.time}</div>
                </div>`).join('')}
              </div>
              <div class="msg-footer">
                <button class="btn btn-ghost btn-icon" title="Attach file" onclick="App.toast('Attach file','default')"><i class="fa-solid fa-paperclip"></i></button>
                <input class="msg-input" id="msg-input" placeholder="Type a message…" onkeydown="if(event.key==='Enter')CustomerPages.sendMsg()">
                <button class="btn btn-primary btn-icon" onclick="CustomerPages.sendMsg()"><i class="fa-solid fa-paper-plane"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  initMessages() {
    const body = document.getElementById('msg-body');
    if (body) body.scrollTop = body.scrollHeight;
  },

  selectContact(id) {
    const u = App.state.user;
    const c = CustomerPages._msgContacts.find(x=>x.id===id);
    if (!c) return;
    document.querySelectorAll('.msg-contact').forEach(el=>el.classList.toggle('active', el.dataset.id===id));
    const avatar = document.querySelector('.msg-chat-avatar');
    if (avatar) { avatar.style.background = c.color; avatar.textContent = c.initials; }
    const nameEl = document.querySelector('.msg-chat-name');
    if (nameEl) nameEl.textContent = c.name;
    const statusEl = document.querySelector('.msg-chat-status');
    if (statusEl) {
      if (id === 'SUPPORT') { statusEl.style.color = 'var(--text-muted)'; statusEl.textContent = 'Customer Support'; }
      else { statusEl.style.color = 'var(--success)'; statusEl.innerHTML = '<i class="fa-solid fa-circle" style="font-size:8px"></i> Online'; }
    }
    const msgs = id === 'SUPPORT' ? [] : Data.messages.filter(m=>(m.from===u.id&&m.to===id)||(m.from===id&&m.to===u.id));
    const body = document.getElementById('msg-body');
    if (body) {
      body.innerHTML = msgs.length
        ? msgs.map(m=>`<div class="msg-bubble-wrap ${m.from===u.id?'mine':'theirs'}"><div class="msg-bubble ${m.from===u.id?'mine':'theirs'}">${m.text}</div><div class="msg-time">${m.time}</div></div>`).join('')
        : '<div style="text-align:center;color:var(--text-muted);padding:40px 20px;font-size:13px">No messages yet. Start the conversation!</div>';
      body.scrollTop = body.scrollHeight;
    }
    document.getElementById('messaging-layout')?.classList.add('chat-active');
  },

  sendMsg() {
    const input = document.getElementById('msg-input');
    const text = input?.value.trim();
    if (!text) return;
    const body = document.getElementById('msg-body');
    const wrap = document.createElement('div');
    wrap.className = 'msg-bubble-wrap mine';
    wrap.innerHTML = `<div class="msg-bubble mine">${text}</div><div class="msg-time">just now</div>`;
    body?.appendChild(wrap);
    input.value = '';
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
      const r = document.createElement('div');
      r.className = 'msg-bubble-wrap theirs';
      r.innerHTML = `<div class="msg-bubble theirs">Thanks for your message! I'll get back to you shortly.</div><div class="msg-time">just now</div>`;
      body?.appendChild(r);
      body.scrollTop = body.scrollHeight;
    }, 1500);
  },

  renderNews() {
    return `
    <div class="app-layout">
      ${App.buildSidebar('customer','customer-news')}
      <div class="main-content">
        ${App.buildHeader('Financial News','Stay informed with the latest updates')}
        <div class="page-content">
          <div class="search-bar" style="margin-bottom:4px">
            <div class="search-input-wrap"><div class="input-icon-wrap"><i class="input-icon fa-solid fa-magnifying-glass"></i><input class="form-control" placeholder="Search news…" id="news-search" oninput="CustomerPages.filterNews()"></div></div>
            <div class="filter-bar" id="news-filters">
              ${['All','Markets','Personal Finance','Mortgages','Economy','Savings'].map((c,i)=>`<button class="btn ${i===0?'btn-primary':'btn-secondary'} btn-sm" data-cat="${c}" onclick="CustomerPages.filterNews('${c}',this)">${c}</button>`).join('')}
            </div>
          </div>
          <div class="news-grid" id="news-grid">
            ${Data.news.map(n=>`
            <div class="news-card" data-category="${n.category}" onclick="CustomerPages.viewNews('${n.id}')">
              <div class="news-img">${n.emoji}</div>
              <div class="news-body">
                <div class="news-category">${n.category}</div>
                <div class="news-title">${n.title}</div>
                <div class="news-preview">${n.preview.slice(0,100)}…</div>
                <div class="news-meta">
                  <span>${n.source}</span><span>${n.time}</span>
                </div>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },

  viewNews(id) {
    const n = Data.news.find(x=>x.id===id);
    if (!n) return;
    App.openModal(`
      <div class="modal" style="max-width:620px">
        <div class="modal-header">
          <div class="modal-title">${n.title}</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div style="font-size:36px;text-align:center;padding:16px;background:var(--surface-2);border-radius:var(--radius-sm)">${n.emoji}</div>
          <div style="display:flex;gap:8px;align-items:center"><span class="badge badge-info">${n.category}</span><span style="font-size:12px;color:var(--text-muted)">${n.source} · ${n.time}</span></div>
          <p style="font-size:14px;line-height:1.8;color:var(--text-secondary)">${n.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <div style="padding-top:8px;border-top:1px solid var(--border-light);display:flex;gap:8px">
            <button class="btn btn-primary btn-sm" onclick="App.toast('Saved to reading list','success')"><i class="fa-solid fa-bookmark"></i> Save</button>
            <button class="btn btn-secondary btn-sm" onclick="App.toast('Link copied','success')"><i class="fa-solid fa-share-nodes"></i> Share</button>
          </div>
        </div>
      </div>`);
  },

  filterNews(cat, btn) {
    const isAll = !cat || cat === 'All';
    if (btn) {
      document.querySelectorAll('#news-filters .btn').forEach(b => { b.className = 'btn btn-secondary btn-sm'; });
      btn.className = 'btn btn-primary btn-sm';
    }
    const search = document.getElementById('news-search')?.value.toLowerCase() || '';
    document.querySelectorAll('#news-grid .news-card').forEach(card => {
      const catMatch = isAll || card.dataset.category === cat;
      const txtMatch = !search || card.textContent.toLowerCase().includes(search);
      card.style.display = catMatch && txtMatch ? '' : 'none';
    });
  },

  renderFAQ() {
    return `
    <div class="app-layout">
      ${App.buildSidebar('customer','customer-faq')}
      <div class="main-content">
        ${App.buildHeader('FAQ','Frequently asked questions')}
        <div class="page-content">
          <div class="card" style="max-width:760px">
            <div class="search-bar" style="margin-bottom:20px">
              <div class="search-input-wrap" style="max-width:100%"><div class="input-icon-wrap"><i class="input-icon fa-solid fa-magnifying-glass"></i><input class="form-control" placeholder="Search FAQ…"></div></div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              ${Data.faqs.map((f,i)=>`
              <div class="faq-item" id="faq-${i}">
                <div class="faq-question" onclick="CustomerPages.toggleFaq(${i})">
                  <span>${f.q}</span><i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="faq-answer">${f.a}</div>
              </div>`).join('')}
            </div>
            <div style="margin-top:24px;text-align:center;padding:20px;background:var(--surface-2);border-radius:var(--radius-sm)">
              <div style="font-size:15px;font-weight:600;margin-bottom:6px">Can't find your answer?</div>
              <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px">Our team is available 9am–6pm, Mon–Fri</div>
              <button class="btn btn-primary" onclick="App.navigate('customer-messages')"><i class="fa-solid fa-message"></i> Message Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  toggleFaq(i) {
    const el = document.getElementById('faq-'+i);
    const wasOpen = el?.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(x=>x.classList.remove('open'));
    if (!wasOpen) el?.classList.add('open');
  },

  renderGuides() {
    const guides = [
      { icon:'💰', title:'Getting Started with Budgeting', desc:'Learn how to set up budget categories and track your spending effectively.', time:'5 min read' },
      { icon:'📈', title:'Understanding Your Credit Score', desc:'Find out what affects your credit score and how to improve it over time.', time:'8 min read' },
      { icon:'🏦', title:'Savings Strategies for 2026', desc:'Explore ISA options, high-interest savings accounts, and tax-efficient investing.', time:'10 min read' },
      { icon:'🛡️', title:'Protecting Yourself from Fraud', desc:'Practical tips to spot phishing, card skimming, and identity theft.', time:'6 min read' },
      { icon:'🏠', title:'First-Time Buyer\'s Guide to Mortgages', desc:'A step-by-step walkthrough of the mortgage application process.', time:'12 min read' },
      { icon:'📋', title:'Making the Most of Your FA', desc:'How to prepare for your financial advisor meetings and what to ask.', time:'4 min read' },
    ];
    return `
    <div class="app-layout">
      ${App.buildSidebar('customer','customer-guides')}
      <div class="main-content">
        ${App.buildHeader('Guides','Financial education resources')}
        <div class="page-content">
          <div class="grid grid-3">
            ${guides.map(g=>`
            <div class="card" style="cursor:pointer;transition:transform 0.2s,box-shadow 0.2s" onclick="App.toast('Opening guide…','default')"
              onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='var(--shadow-md)'"
              onmouseout="this.style.transform='';this.style.boxShadow=''">
              <div style="font-size:36px;margin-bottom:14px">${g.icon}</div>
              <div style="font-size:15px;font-weight:600;margin-bottom:6px">${g.title}</div>
              <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:14px">${g.desc}</div>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <span class="badge badge-info"><i class="fa-solid fa-clock"></i> ${g.time}</span>
                <button class="btn btn-ghost btn-sm" style="color:var(--accent)">Read <i class="fa-solid fa-arrow-right"></i></button>
              </div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },

  renderSettings() {
    const u = App.state.user;
    const accs = Data.accounts.filter(a=>a.userId===u.id);
    return `
    <div class="app-layout">
      ${App.buildSidebar('customer','customer-settings')}
      <div class="main-content">
        ${App.buildHeader('Settings','Manage your account preferences')}
        <div class="page-content">
          <div style="display:flex;flex-direction:column;gap:20px;max-width:760px">

            <div class="settings-section">
              <div class="settings-section-header">
                <div class="settings-section-icon" style="background:var(--accent-glow);color:var(--accent)"><i class="fa-solid fa-shield-halved"></i></div>
                <div class="settings-section-title">Security & Login</div>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Two-Factor Authentication</div><div class="settings-row-desc">Currently using: Biometric + SMS backup</div></div>
                <button class="btn btn-secondary btn-sm" onclick="App.navigate('2fa')"><i class="fa-solid fa-pen"></i> Change</button>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Biometric Login</div><div class="settings-row-desc">Fingerprint and Face ID</div></div>
                <label class="toggle"><input type="checkbox" checked onchange="App.toast('Biometric login updated','success')"><span class="toggle-slider"></span></label>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Change Password</div><div class="settings-row-desc">Last changed 45 days ago</div></div>
                <button class="btn btn-secondary btn-sm" onclick="App.state.fpStep=1;App.navigate('forgot-password')"><i class="fa-solid fa-lock"></i> Change</button>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Login Alerts</div><div class="settings-row-desc">Email alert on new device sign-in</div></div>
                <label class="toggle"><input type="checkbox" checked onchange="App.toast('Login alerts updated','success')"><span class="toggle-slider"></span></label>
              </div>
            </div>

            <div class="settings-section">
              <div class="settings-section-header">
                <div class="settings-section-icon" style="background:#F0FDF4;color:var(--success)"><i class="fa-solid fa-eye"></i></div>
                <div class="settings-section-title">Privacy</div>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Privacy View</div><div class="settings-row-desc">Hide all balances and transaction amounts</div></div>
                <label class="toggle"><input type="checkbox" ${App.state.privacyMode?'checked':''} onchange="App.togglePrivacy()"><span class="toggle-slider"></span></label>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Hidden Transactions</div><div class="settings-row-desc">${Data.transactions.filter(t=>t.hidden).length} transactions hidden from statement view</div></div>
                <button class="btn btn-secondary btn-sm" onclick="App.navigate('customer-statement')"><i class="fa-solid fa-eye-slash"></i> Manage</button>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Screenshot Protection</div><div class="settings-row-desc">Blur app when switching tasks</div></div>
                <label class="toggle"><input type="checkbox" onchange="App.toast('Screenshot protection updated','success')"><span class="toggle-slider"></span></label>
              </div>
            </div>

            <div class="settings-section">
              <div class="settings-section-header">
                <div class="settings-section-icon" style="background:var(--warning-bg);color:var(--warning)"><i class="fa-solid fa-bell"></i></div>
                <div class="settings-section-title">Notifications</div>
              </div>
              ${[
                ['Daily Summary', 'Brief overview of your accounts each morning', true],
                ['Weekly Report', 'Spending summary every Sunday', true],
                ['Uncommon Payments', 'Alert on unusual transaction patterns', true],
                ['Budget Alerts', 'Notify when approaching spending limits', true],
                ['New Messages', 'In-app and email when FA messages you', true],
                ['News & Insights', 'Personalised financial news updates', false],
              ].map(([t,d,c])=>`
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">${t}</div><div class="settings-row-desc">${d}</div></div>
                <label class="toggle"><input type="checkbox" ${c?'checked':''} onchange="App.toast('Notification preference saved','success')"><span class="toggle-slider"></span></label>
              </div>`).join('')}
            </div>

            <div class="settings-section">
              <div class="settings-section-header">
                <div class="settings-section-icon" style="background:var(--danger-bg);color:var(--danger)"><i class="fa-solid fa-snowflake"></i></div>
                <div class="settings-section-title">Account Freeze</div>
              </div>
              ${accs.map(a=>`
              <div class="settings-row">
                <div class="settings-row-info">
                  <div class="settings-row-title">${a.type} ${a.frozen?'<span class="badge badge-danger">Frozen</span>':''}</div>
                  <div class="settings-row-desc privacy-sensitive">${a.iban}</div>
                </div>
                <label class="toggle">
                  <input type="checkbox" ${a.frozen?'checked':''} onchange="CustomerPages.toggleFreeze('${a.id}',this.checked);App.toast(this.checked?'Account frozen':'Account unfrozen',this.checked?'warning':'success')">
                  <span class="toggle-slider" style="${a.frozen?'background:var(--danger)':''}"></span>
                </label>
              </div>`).join('')}
            </div>

            <div class="settings-section">
              <div class="settings-section-header">
                <div class="settings-section-icon" style="background:#F0F9FF;color:#0284C7"><i class="fa-solid fa-universal-access"></i></div>
                <div class="settings-section-title">Accessibility</div>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Text Size</div><div class="settings-row-desc">Increase text size across the whole app</div></div>
                <select class="form-control" style="width:140px" onchange="App.setAccessibility('fontSize',this.value)">
                  <option value="normal" ${(App.state.accessibility?.fontSize||'normal')==='normal'?'selected':''}>Normal</option>
                  <option value="large" ${App.state.accessibility?.fontSize==='large'?'selected':''}>Large</option>
                  <option value="xlarge" ${App.state.accessibility?.fontSize==='xlarge'?'selected':''}>Extra Large</option>
                </select>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">High Contrast</div><div class="settings-row-desc">Enhances colour contrast for better visibility</div></div>
                <label class="toggle"><input type="checkbox" ${App.state.accessibility?.highContrast?'checked':''} onchange="App.setAccessibility('highContrast',this.checked)"><span class="toggle-slider"></span></label>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Reduced Motion</div><div class="settings-row-desc">Disable animations and transitions</div></div>
                <label class="toggle"><input type="checkbox" ${App.state.accessibility?.reducedMotion?'checked':''} onchange="App.setAccessibility('reducedMotion',this.checked)"><span class="toggle-slider"></span></label>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Screen Reader Hints</div><div class="settings-row-desc">Add descriptive labels for assistive technology</div></div>
                <label class="toggle"><input type="checkbox" onchange="App.toast('Screen reader support updated','success')"><span class="toggle-slider"></span></label>
              </div>
            </div>

            <div class="settings-section">
              <div class="settings-section-header">
                <div class="settings-section-icon" style="background:var(--purple-bg);color:var(--purple)"><i class="fa-solid fa-palette"></i></div>
                <div class="settings-section-title">Customisation</div>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Dashboard Layout</div><div class="settings-row-desc">Choose your preferred view</div></div>
                <select class="form-control" style="width:160px" onchange="App.toast('Layout updated','success')">
                  <option>Standard</option><option>Compact</option><option>Detailed</option>
                </select>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Accent Colour</div><div class="settings-row-desc">Personalise your app theme</div></div>
                <div style="display:flex;gap:8px">
                  ${['#0066FF','#22C55E','#8B5CF6','#F59E0B','#EF4444'].map(c=>`
                  <div class="color-swatch${(localStorage.getItem('nx_theme')||'#0066FF')===c?' selected':''}" style="background:${c}" onclick="App.applyTheme('${c}');document.querySelectorAll('.color-swatch').forEach(x=>x.classList.remove('selected'));this.classList.add('selected');App.toast('Theme updated','success')"></div>`).join('')}
                </div>
              </div>
              <div class="settings-row">
                <div class="settings-row-info"><div class="settings-row-title">Default Landing Page</div><div class="settings-row-desc">Page shown after sign in</div></div>
                <select class="form-control" style="width:160px" onchange="App.toast('Preference saved','success')">
                  <option>Dashboard</option><option>Statement</option><option>Budget</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>`;
  },

  initSettings() {},
};
