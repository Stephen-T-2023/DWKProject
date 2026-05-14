/* ===== FINANCIAL ADVISOR PAGES ===== */
const FAPages = {

  renderDashboard() {
    const u = App.state.user;
    const myClients = Data.users.filter(x=>x.role==='customer'&&x.faId===u.id);
    const myCases = Data.cases.filter(c=>c.faId===u.id);
    const openCases = myCases.filter(c=>c.status==='active');
    const closedCases = myCases.filter(c=>c.status==='closed');
    const myMsgs = Data.messages.filter(m=>m.from!==u.id&&m.to===u.id&&!m.read);
    return `
    <div class="app-layout">
      ${App.buildSidebar('fa','fa-dashboard')}
      <div class="main-content">
        ${App.buildHeader('FA Dashboard', `Welcome, ${u.name.split(' ')[0]}`)}
        <div class="page-content">

          <div class="grid grid-4">
            <div class="stat-card">
              <div class="flex items-center justify-between">
                <div class="stat-card-label">My Clients</div>
                <div class="stat-card-icon" style="background:#EFF6FF"><i class="fa-solid fa-users" style="color:#3B82F6"></i></div>
              </div>
              <div class="stat-card-value">${myClients.length}</div>
              <div class="stat-card-change up"><i class="fa-solid fa-arrow-up"></i> +1 this month</div>
            </div>
            <div class="stat-card">
              <div class="flex items-center justify-between">
                <div class="stat-card-label">Active Cases</div>
                <div class="stat-card-icon" style="background:#FEF2F2"><i class="fa-solid fa-folder-open" style="color:#EF4444"></i></div>
              </div>
              <div class="stat-card-value">${openCases.length}</div>
              <div class="stat-card-change down"><i class="fa-solid fa-arrow-down"></i> 2 due this week</div>
            </div>
            <div class="stat-card">
              <div class="flex items-center justify-between">
                <div class="stat-card-label">Closed This Month</div>
                <div class="stat-card-icon" style="background:#F0FDF4"><i class="fa-solid fa-check-circle" style="color:#22C55E"></i></div>
              </div>
              <div class="stat-card-value">${closedCases.length}</div>
              <div class="stat-card-change up"><i class="fa-solid fa-arrow-up"></i> 80% closure rate</div>
            </div>
            <div class="stat-card">
              <div class="flex items-center justify-between">
                <div class="stat-card-label">Unread Messages</div>
                <div class="stat-card-icon" style="background:var(--purple-bg)"><i class="fa-solid fa-envelope" style="color:var(--purple)"></i></div>
              </div>
              <div class="stat-card-value">${myMsgs.length}</div>
              <div class="stat-card-change" style="color:var(--text-muted)">Reply promptly</div>
            </div>
          </div>

          <div class="grid grid-2-1">
            <div class="card">
              <div class="card-header">
                <div class="card-title">Client Case Overview</div>
                <button class="btn btn-primary btn-sm" onclick="App.navigate('fa-clients')"><i class="fa-solid fa-users"></i> All Clients</button>
              </div>
              <div style="display:flex;flex-direction:column;gap:14px">
                ${myClients.map(client=>{
                  const clientCases = myCases.filter(c=>c.clientId===client.id);
                  const active = clientCases.filter(c=>c.status==='active').length;
                  return `
                  <div class="client-card" onclick="App.navigate('fa-clients')">
                    <div class="client-avatar" style="background:${client.color}">${client.initials}</div>
                    <div class="client-info">
                      <div class="client-name">${client.name}</div>
                      <div class="client-id">ID: ${client.id} · ${client.email}</div>
                      <div class="client-stats">
                        <div class="client-stat"><div class="client-stat-val">${clientCases.length}</div><div class="client-stat-label">Cases</div></div>
                        <div class="client-stat"><div class="client-stat-val" style="color:${active?'var(--warning)':'var(--success)'}">${active}</div><div class="client-stat-label">Active</div></div>
                      </div>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:6px">
                      <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();App.navigate('fa-messages')"><i class="fa-solid fa-message"></i> Message</button>
                      <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();App.navigate('fa-reports')"><i class="fa-solid fa-file-chart-column"></i> Reports</button>
                    </div>
                  </div>`;
                }).join('')}
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:16px">
              <div class="card">
                <div class="card-title" style="margin-bottom:16px">Case Progress</div>
                <div class="chart-wrap-sm"><canvas id="caseChart"></canvas></div>
              </div>
              <div class="card">
                <div class="card-title" style="margin-bottom:12px">Upcoming Deadlines</div>
                ${openCases.slice(0,3).map(c=>`
                <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-light)">
                  <div style="width:4px;height:36px;border-radius:2px;background:${c.priority==='high'?'var(--danger)':c.priority==='medium'?'var(--warning)':'var(--success)'}"></div>
                  <div style="flex:1">
                    <div style="font-size:13px;font-weight:500">${c.title}</div>
                    <div style="font-size:11px;color:var(--text-muted)">Due: ${App.fmt.date(c.deadline)}</div>
                  </div>
                  <span class="badge ${c.priority==='high'?'badge-danger':c.priority==='medium'?'badge-warning':'badge-success'}">${c.priority}</span>
                </div>`).join('')}
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Recent Reports</div>
              <button class="btn btn-primary btn-sm" onclick="FAPages.newReport()"><i class="fa-solid fa-plus"></i> New Report</button>
            </div>
            <div class="grid grid-2">
              ${Data.reports.filter(r=>r.faId===u.id).map(r=>`
              <div class="report-card">
                <div class="report-header">
                  <div>
                    <div class="report-title">${r.title}</div>
                    <div class="report-client">${Data.users.find(x=>x.id===r.clientId)?.name}</div>
                  </div>
                  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
                    <span class="badge ${r.status==='final'?'badge-success':'badge-warning'}">${r.status}</span>
                    <span style="font-size:11px;color:var(--text-muted)">${App.fmt.date(r.date)}</span>
                  </div>
                </div>
                <div class="report-preview">${r.preview.slice(0,120)}…</div>
                <div class="report-footer">
                  <span class="tag"><i class="fa-solid fa-tag"></i> ${r.type}</span>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-secondary btn-sm" onclick="FAPages.editReport('${r.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-secondary btn-sm" onclick="FAPages.deleteReport('${r.id}')"><i class="fa-solid fa-trash" style="color:var(--danger)"></i></button>
                  </div>
                </div>
              </div>`).join('')}
            </div>
          </div>

        </div>
      </div>
    </div>`;
  },

  initDashboard() {
    const myCases = Data.cases.filter(c=>c.faId===App.state.user.id);
    const open = myCases.filter(c=>c.status==='active').length;
    const closed = myCases.filter(c=>c.status==='closed').length;
    App.createChart('caseChart', {
      type: 'doughnut',
      data: {
        labels: ['Active','Closed'],
        datasets: [{ data:[open,closed], backgroundColor:['#F59E0B','#22C55E'], borderWidth:0 }]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ padding:12, font:{ size:12, family:'Inter' } } } }, cutout:'60%' }
    });
  },

  renderClients() {
    const u = App.state.user;
    const clients = Data.users.filter(x=>x.role==='customer'&&x.faId===u.id);
    const prefs = FAPages._getPreferred();
    return `
    <div class="app-layout">
      ${App.buildSidebar('fa','fa-clients')}
      <div class="main-content">
        ${App.buildHeader('Clients','Manage your client portfolio')}
        <div class="page-content">
          <div class="search-bar" style="margin-bottom:4px">
            <div class="search-input-wrap"><div class="input-icon-wrap"><i class="input-icon fa-solid fa-magnifying-glass"></i><input class="form-control" placeholder="Search clients…" id="client-search" oninput="FAPages.filterClients()"></div></div>
            <select class="form-control" style="width:160px" id="client-status" onchange="FAPages.filterClients()">
              <option value="">All statuses</option><option>Active cases</option><option>No active cases</option>
            </select>
            <button class="btn btn-secondary btn-sm" onclick="FAPages.transferClient()"><i class="fa-solid fa-arrow-right-arrow-left"></i> Transfer Client</button>
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;white-space:nowrap">
              <input type="checkbox" id="client-pref-filter" onchange="FAPages.filterClients()" style="accent-color:var(--accent)">
              <i class="fa-solid fa-star" style="color:var(--gold,#F59E0B)"></i> Preferred only
            </label>
          </div>

          <div style="display:flex;flex-direction:column;gap:14px" id="client-list">
            ${clients.map(client=>{
              const clientCases = Data.cases.filter(c=>c.clientId===client.id&&c.faId===u.id);
              const activeCases = clientCases.filter(c=>c.status==='active');
              const clientAccs = Data.accounts.filter(a=>a.userId===client.id);
              const totalBalance = clientAccs.reduce((s,a)=>s+a.balance,0);
              const isPref = prefs.includes(client.id);
              return `
              <div class="card client-card" id="cl-${client.id}" style="flex-direction:column;gap:0;cursor:default">
                <div style="display:flex;align-items:center;gap:16px">
                  <div class="client-avatar" style="background:${client.color}">${client.initials}</div>
                  <div style="flex:1">
                    <div class="flex items-center gap-8">
                      <div class="client-name">${client.name}</div>
                      <span id="pref-badge-${client.id}" class="badge" style="background:#FEF3C7;color:#B45309;${isPref?'':'display:none'}"><i class="fa-solid fa-star"></i> Preferred</span>
                      ${activeCases.length?`<span class="badge badge-warning">${activeCases.length} active</span>`:'<span class="badge badge-success">All resolved</span>'}
                    </div>
                    <div style="font-size:12px;color:var(--text-muted)">${client.email} · ${client.phone}</div>
                    <div style="font-size:12px;color:var(--text-muted)">ID: ${client.id}</div>
                  </div>
                  <div style="text-align:right">
                    <div style="font-size:12px;color:var(--text-muted)">Total Assets</div>
                    <div style="font-size:18px;font-weight:700;color:var(--accent)">${App.fmt.currency(totalBalance)}</div>
                    <div style="font-size:11px;color:var(--text-muted)">${clientAccs.length} accounts</div>
                  </div>
                  <div style="display:flex;gap:6px;flex-shrink:0">
                    <button id="pref-btn-${client.id}" class="btn btn-ghost btn-sm" title="${isPref?'Remove from preferred':'Mark as preferred'}" onclick="FAPages._togglePreferred('${client.id}')" style="color:${isPref?'var(--gold,#F59E0B)':'var(--text-muted)'}"><i class="fa-${isPref?'solid':'regular'} fa-star"></i></button>
                    <button class="btn btn-secondary btn-sm" onclick="App.navigate('fa-messages')"><i class="fa-solid fa-message"></i></button>
                    <button class="btn btn-primary btn-sm" onclick="FAPages.viewClientDetail('${client.id}')"><i class="fa-solid fa-eye"></i> View</button>
                  </div>
                </div>
                ${activeCases.length ? `
                <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border-light)">
                  <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:8px">ACTIVE CASES</div>
                  <div style="display:flex;flex-direction:column;gap:8px">
                    ${activeCases.map(c=>`
                    <div style="display:flex;align-items:center;gap:10px">
                      <div style="flex:1">
                        <div style="font-size:13px;font-weight:500">${c.title}</div>
                        <div style="font-size:11px;color:var(--text-muted)">Due: ${App.fmt.date(c.deadline)}</div>
                      </div>
                      <div style="width:120px">
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:3px">${c.progress}% complete</div>
                        <div class="case-progress"><div class="case-progress-fill" style="width:${c.progress}%"></div></div>
                      </div>
                      <span class="badge ${c.priority==='high'?'badge-danger':c.priority==='medium'?'badge-warning':'badge-success'}">${c.priority}</span>
                    </div>`).join('')}
                  </div>
                </div>` : ''}
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },

  _getPreferred() {
    try { return JSON.parse(localStorage.getItem('nx_preferred_clients') || '[]'); } catch { return []; }
  },

  _togglePreferred(clientId) {
    const prefs = FAPages._getPreferred();
    const idx = prefs.indexOf(clientId);
    if (idx >= 0) prefs.splice(idx, 1); else prefs.push(clientId);
    localStorage.setItem('nx_preferred_clients', JSON.stringify(prefs));
    const isNow = prefs.includes(clientId);
    const btn = document.getElementById('pref-btn-' + clientId);
    if (btn) {
      btn.style.color = isNow ? 'var(--gold, #F59E0B)' : 'var(--text-muted)';
      btn.title = isNow ? 'Remove from preferred' : 'Mark as preferred';
      btn.innerHTML = `<i class="fa-${isNow?'solid':'regular'} fa-star"></i>`;
    }
    const badge = document.getElementById('pref-badge-' + clientId);
    if (badge) badge.style.display = isNow ? '' : 'none';
    App.toast(isNow ? 'Added to preferred clients' : 'Removed from preferred', 'success', 1500);
  },

  initClients() {},

  filterClients() {
    const search = document.getElementById('client-search')?.value.toLowerCase() || '';
    const prefOnly = document.getElementById('client-pref-filter')?.checked;
    const prefs = FAPages._getPreferred();
    Data.users.filter(x=>x.role==='customer'&&x.faId===App.state.user.id).forEach(c=>{
      const el = document.getElementById('cl-'+c.id);
      if (!el) return;
      const nameMatch = c.name.toLowerCase().includes(search)||c.email.toLowerCase().includes(search);
      const prefMatch = !prefOnly || prefs.includes(c.id);
      el.style.display = nameMatch && prefMatch ? '' : 'none';
    });
  },

  viewClientDetail(clientId) {
    const c = Data.users.find(x=>x.id===clientId);
    const accs = Data.accounts.filter(a=>a.userId===clientId);
    const cases = Data.cases.filter(x=>x.clientId===clientId);
    App.openModal(`
      <div class="modal" style="max-width:580px">
        <div class="modal-header">
          <div class="modal-title">Client Profile — ${c?.name}</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div style="display:flex;align-items:center;gap:14px;padding-bottom:14px;border-bottom:1px solid var(--border)">
            <div class="client-avatar" style="background:${c?.color};width:56px;height:56px;font-size:20px">${c?.initials}</div>
            <div>
              <div style="font-size:18px;font-weight:700">${c?.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${c?.email} · ${c?.phone}</div>
              <div style="font-size:12px;color:var(--text-muted)">Client ID: ${c?.id}</div>
            </div>
          </div>
          <div>
            <div style="font-size:13px;font-weight:600;margin-bottom:8px">Accounts</div>
            ${accs.map(a=>`
            <div style="display:flex;justify-content:space-between;padding:8px;background:var(--surface-2);border-radius:6px;margin-bottom:6px">
              <span style="font-size:13px">${a.type}</span>
              <span style="font-size:13px;font-weight:600">${App.fmt.currency(a.balance)}</span>
            </div>`).join('')}
          </div>
          <div>
            <div style="font-size:13px;font-weight:600;margin-bottom:8px">Cases (${cases.length})</div>
            ${cases.map(x=>`
            <div style="display:flex;justify-content:space-between;padding:8px;background:var(--surface-2);border-radius:6px;margin-bottom:6px">
              <div>
                <div style="font-size:13px;font-weight:500">${x.title}</div>
                <div style="font-size:11px;color:var(--text-muted)">${App.fmt.date(x.opened)}</div>
              </div>
              <span class="badge ${x.status==='active'?'badge-warning':'badge-success'}">${x.status}</span>
            </div>`).join('')}
          </div>
          <div style="display:flex;gap:8px;margin-top:4px">
            <button class="btn btn-primary" style="flex:1" onclick="App.navigate('fa-reports');App.closeModal()"><i class="fa-solid fa-file-chart-column"></i> View Reports</button>
            <button class="btn btn-secondary" style="flex:1" onclick="App.closeModal();FAPages.transferClient('${clientId}')"><i class="fa-solid fa-arrow-right-arrow-left"></i> Transfer</button>
          </div>
        </div>
      </div>`);
  },

  transferClient(preselectedClientId) {
    const u = App.state.user;
    const myClients = Data.users.filter(x=>x.role==='customer'&&x.faId===u.id);
    const fas = Data.users.filter(x=>x.role==='fa'&&x.id!==u.id);
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-arrow-right-arrow-left" style="color:var(--accent);margin-right:8px"></i>Transfer Client</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Select client</label>
            <select class="form-control" id="transfer-client-sel">
              ${myClients.map(c=>`<option value="${c.id}" ${c.id===preselectedClientId?'selected':''}>${c.name} (${c.id})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Transfer to Financial Advisor</label>
            <select class="form-control" id="transfer-fa-sel">
              ${fas.map(f=>`<option value="${f.id}">${f.name} — ${f.specialty}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Transfer reason</label>
            <textarea class="form-control" rows="2" placeholder="Reason for transfer…"></textarea>
          </div>
          <div class="alert alert-warning"><i class="fa-solid fa-triangle-exclamation"></i><div class="alert-body">The client and receiving advisor will be notified. All case history will be transferred.</div></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="modal-confirm-btn"><i class="fa-solid fa-check"></i> Confirm Transfer</button>
        </div>
      </div>`, () => {
        const clientId = document.getElementById('transfer-client-sel')?.value;
        const newFaId = document.getElementById('transfer-fa-sel')?.value;
        const client = Data.users.find(x=>x.id===clientId);
        if (client && newFaId) {
          client.faId = newFaId;
          App.toast(`${client.name} transferred successfully`, 'success');
          App.navigate('fa-clients');
        }
      });
  },

  renderReports() {
    const u = App.state.user;
    const myReports = Data.reports.filter(r=>r.faId===u.id);
    const recentReports = [...myReports].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
    return `
    <div class="app-layout">
      ${App.buildSidebar('fa','fa-reports')}
      <div class="main-content">
        ${App.buildHeader('Reports','Manage client financial reports')}
        <div class="page-content">
          <div class="search-bar" style="margin-bottom:4px">
            <div class="search-input-wrap"><div class="input-icon-wrap"><i class="input-icon fa-solid fa-magnifying-glass"></i><input class="form-control" placeholder="Search reports…"></div></div>
            <select class="form-control" style="width:160px">
              <option>All types</option><option>quarterly</option><option>annual</option><option>assessment</option><option>planning</option>
            </select>
            <select class="form-control" style="width:140px">
              <option>All statuses</option><option>draft</option><option>final</option>
            </select>
            <button class="btn btn-primary btn-sm" onclick="FAPages.newReport()"><i class="fa-solid fa-plus"></i> New Report</button>
            <button class="btn btn-secondary btn-sm" onclick="FAPages.showTemplates()"><i class="fa-solid fa-clone"></i> Templates</button>
            <button class="btn btn-secondary btn-sm" onclick="FAPages.showAutomation()"><i class="fa-solid fa-robot"></i> Automation</button>
          </div>

          <div class="card">
            <div class="card-header">
              <div><div class="card-title"><i class="fa-solid fa-clock-rotate-left" style="color:var(--accent);margin-right:6px"></i>Recent Activity</div><div class="card-subtitle">Latest additions and updates</div></div>
              <span class="badge badge-info">${recentReports.length} recent</span>
            </div>
            <div style="display:flex;flex-direction:column">
              ${recentReports.map((r,i)=>{
                const client = Data.users.find(x=>x.id===r.clientId);
                return `
                <div style="display:flex;align-items:center;gap:12px;padding:12px 0;${i<recentReports.length-1?'border-bottom:1px solid var(--border-light)':''}">
                  <div style="width:40px;height:40px;border-radius:10px;background:${r.status==='final'?'var(--success-bg)':'var(--warning-bg)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
                    <i class="fa-solid fa-file-lines" style="color:${r.status==='final'?'var(--success)':'var(--warning)'}"></i>
                  </div>
                  <div style="flex:1;min-width:0">
                    <div style="font-weight:500;font-size:13.5px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                      ${r.title}
                      ${i===0?'<span class="badge badge-info" style="font-size:10px;padding:2px 7px">NEW</span>':''}
                    </div>
                    <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${client?.name} · ${App.fmt.date(r.date)} · <span class="tag" style="font-size:11px">${r.type}</span></div>
                  </div>
                  <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
                    <span class="badge ${r.status==='final'?'badge-success':'badge-warning'}">${r.status}</span>
                    <button class="btn btn-ghost btn-sm" onclick="FAPages.viewReport('${r.id}')"><i class="fa-solid fa-eye"></i></button>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:14px">
            ${myReports.map(r=>{
              const client = Data.users.find(x=>x.id===r.clientId);
              return `
              <div class="report-card" id="rep-${r.id}">
                <div class="report-header">
                  <div style="flex:1">
                    <div class="report-title">${r.title}</div>
                    <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
                      <div class="client-avatar" style="width:22px;height:22px;font-size:10px;background:${client?.color}">${client?.initials}</div>
                      <span class="report-client">${client?.name}</span>
                    </div>
                  </div>
                  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
                    <span class="badge ${r.status==='final'?'badge-success':'badge-warning'}">${r.status}</span>
                    <span class="tag"><i class="fa-solid fa-tag"></i> ${r.type}</span>
                  </div>
                </div>
                <div class="report-preview">${r.preview}</div>
                <div class="report-footer">
                  <span style="font-size:12px;color:var(--text-muted)"><i class="fa-regular fa-calendar"></i> ${App.fmt.date(r.date)}</span>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-ghost btn-sm" onclick="FAPages.viewReport('${r.id}')"><i class="fa-solid fa-eye"></i> View</button>
                    <button class="btn btn-secondary btn-sm" onclick="FAPages.editReport('${r.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button class="btn btn-secondary btn-sm" onclick="App.toast('Report exported as PDF','success')"><i class="fa-solid fa-download"></i></button>
                    <button class="btn btn-secondary btn-sm" onclick="FAPages.deleteReport('${r.id}')"><i class="fa-solid fa-trash" style="color:var(--danger)"></i></button>
                  </div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },

  initReports() {},

  newReport() {
    const clients = Data.users.filter(x=>x.role==='customer');
    App.openModal(`
      <div class="modal" style="max-width:560px">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-plus" style="color:var(--accent);margin-right:8px"></i>New Report</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Report title</label><input class="form-control" id="new-rep-title" placeholder="e.g. Q2 2026 Review"></div>
          <div class="form-group">
            <label class="form-label">Client</label>
            <select class="form-control" id="new-rep-client">${clients.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select>
          </div>
          <div class="form-group">
            <label class="form-label">Report type</label>
            <select class="form-control" id="new-rep-type"><option value="quarterly">Quarterly</option><option value="annual">Annual</option><option value="assessment">Assessment</option><option value="planning">Planning</option></select>
          </div>
          <div class="form-group">
            <label class="form-label">Content</label>
            <textarea class="form-control" id="new-rep-content" rows="5" placeholder="Enter report content or use a template…"></textarea>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary btn-sm" onclick="FAPages.applyTemplate()"><i class="fa-solid fa-clone"></i> Use Template</button>
            <button class="btn btn-secondary btn-sm" onclick="App.toast('AI summary generated!','success')"><i class="fa-solid fa-robot"></i> AI Summary</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-secondary" onclick="FAPages._saveDraft();App.closeModal()"><i class="fa-solid fa-floppy-disk"></i> Save Draft</button>
          <button class="btn btn-primary" id="modal-confirm-btn"><i class="fa-solid fa-check"></i> Publish</button>
        </div>
      </div>`, () => {
        const title = document.getElementById('new-rep-title')?.value.trim() || 'Untitled Report';
        const clientId = document.getElementById('new-rep-client')?.value;
        const type = document.getElementById('new-rep-type')?.value || 'quarterly';
        const content = document.getElementById('new-rep-content')?.value.trim() || 'Report content pending.';
        const newId = 'REP' + String(Data.reports.length + 1).padStart(3, '0');
        Data.reports.push({ id:newId, faId:App.state.user.id, clientId, title, type, date:new Date().toISOString().slice(0,10), status:'final', preview:content });
        App.toast('Report published!', 'success');
        App.navigate('fa-reports');
      });
  },

  _saveDraft() {
    const title = document.getElementById('new-rep-title')?.value.trim() || 'Draft Report';
    const clientId = document.getElementById('new-rep-client')?.value;
    const type = document.getElementById('new-rep-type')?.value || 'quarterly';
    const content = document.getElementById('new-rep-content')?.value.trim() || '';
    const newId = 'REP' + String(Data.reports.length + 1).padStart(3, '0');
    Data.reports.push({ id:newId, faId:App.state.user.id, clientId, title, type, date:new Date().toISOString().slice(0,10), status:'draft', preview:content });
    App.toast('Report saved as draft', 'warning');
    App.navigate('fa-reports');
  },

  editReport(id) {
    const r = Data.reports.find(x=>x.id===id);
    App.openModal(`
      <div class="modal" style="max-width:560px">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-pen" style="color:var(--accent);margin-right:8px"></i>Edit Report</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Report title</label><input class="form-control" value="${r?.title}"></div>
          <div class="form-group"><label class="form-label">Content</label><textarea class="form-control" rows="6">${r?.preview}</textarea></div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-control"><option ${r?.status==='draft'?'selected':''}>draft</option><option ${r?.status==='final'?'selected':''}>final</option></select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="modal-confirm-btn"><i class="fa-solid fa-check"></i> Save Changes</button>
        </div>
      </div>`, () => App.toast('Report updated!', 'success'));
  },

  viewReport(id) {
    const r = Data.reports.find(x=>x.id===id);
    const client = Data.users.find(x=>x.id===r?.clientId);
    App.openModal(`
      <div class="modal" style="max-width:580px">
        <div class="modal-header">
          <div class="modal-title">${r?.title}</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <span class="badge ${r?.status==='final'?'badge-success':'badge-warning'}">${r?.status}</span>
            <span class="tag"><i class="fa-solid fa-tag"></i> ${r?.type}</span>
            <span style="font-size:12px;color:var(--text-muted);margin-left:auto">${App.fmt.date(r?.date||'')}</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--surface-2);border-radius:6px;margin-bottom:12px">
            <div class="client-avatar" style="width:32px;height:32px;font-size:12px;background:${client?.color}">${client?.initials}</div>
            <div style="font-size:13px;font-weight:500">${client?.name} · ${client?.id}</div>
          </div>
          <div style="font-size:13.5px;line-height:1.8;color:var(--text-secondary);background:var(--surface-2);padding:16px;border-radius:8px">${r?.preview}</div>
          <div style="display:flex;gap:8px;margin-top:4px">
            <button class="btn btn-primary" style="flex:1" onclick="App.toast('Downloaded!','success')"><i class="fa-solid fa-download"></i> Export PDF</button>
            <button class="btn btn-secondary" style="flex:1" onclick="FAPages.editReport('${id}');App.closeModal()"><i class="fa-solid fa-pen"></i> Edit</button>
          </div>
        </div>
      </div>`);
  },

  deleteReport(id) {
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Delete Report</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="modal-icon-wrap">
            <div class="modal-icon danger"><i class="fa-solid fa-trash"></i></div>
            <div class="modal-confirm-text">Are you sure you want to delete this report? This action cannot be undone.</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-danger" id="modal-confirm-btn"><i class="fa-solid fa-trash"></i> Delete</button>
        </div>
      </div>`, () => { App.toast('Report deleted', 'warning'); const el=document.getElementById('rep-'+id); if(el) el.remove(); });
  },

  showTemplates() {
    const templates = ['Quarterly Financial Review','Annual Portfolio Summary','Mortgage Pre-Assessment','Investment Risk Profile','Retirement Planning Report','Savings Strategy Analysis'];
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-clone" style="color:var(--accent);margin-right:8px"></i>Report Templates</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          ${templates.map(t=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--surface-2);border-radius:8px;border:1px solid var(--border)">
            <div style="font-size:14px;font-weight:500"><i class="fa-solid fa-file-lines" style="color:var(--accent);margin-right:8px"></i>${t}</div>
            <button class="btn btn-primary btn-sm" onclick="App.toast('Template loaded into editor','success')">Use</button>
          </div>`).join('')}
        </div>
      </div>`);
  },

  showAutomation() {
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-robot" style="color:var(--purple);margin-right:8px"></i>Report Automation</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-info"><i class="fa-solid fa-circle-info"></i><div class="alert-body">Automation generates and sends reports on your behalf based on client activity and schedules.</div></div>
          ${[
            ['Quarterly Reviews','Auto-generate Q-end reviews for all clients',true],
            ['Annual Summaries','Year-end portfolio summary reports',true],
            ['Activity Triggers','Report when client makes major transaction (>£5k)',false],
            ['Risk Alerts','Auto-flag reports when portfolio risk changes',true],
          ].map(([name,desc,on])=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--surface-2);border-radius:8px">
            <div>
              <div style="font-weight:500;font-size:13.5px">${name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${desc}</div>
            </div>
            <label class="toggle"><input type="checkbox" ${on?'checked':''} onchange="App.toast('Automation updated','success')"><span class="toggle-slider"></span></label>
          </div>`).join('')}
        </div>
      </div>`);
  },

  applyTemplate() { App.toast('Template applied to report', 'success'); },

  renderMessages() {
    const u = App.state.user;
    const myClients = Data.users.filter(x=>x.role==='customer'&&x.faId===u.id);
    const contacts = [...myClients, { id:'TL001', name:'Robert Anderson', role:'Team Leader', initials:'RA', color:'#0A2540' }];
    const firstId = contacts[0]?.id;
    const msgs = Data.messages.filter(m=>(m.from===u.id&&m.to===firstId)||(m.from===firstId&&m.to===u.id));
    const lastMsg = msgs.slice(-1)[0];
    return `
    <div class="app-layout">
      ${App.buildSidebar('fa','fa-messages')}
      <div class="main-content">
        ${App.buildHeader('Messages','Secure client communications')}
        <div class="page-content">
          <div class="messaging-layout" id="messaging-layout">
            <div class="msg-sidebar">
              <div class="msg-sidebar-header">Conversations</div>
              <div class="msg-list">
                ${contacts.map((c,i)=>`
                <div class="msg-contact${i===0?' active':''}" data-id="${c.id}" onclick="FAPages.selectContact('${c.id}')">
                  <div class="msg-contact-avatar" style="background:${c.color}">${c.initials}</div>
                  <div style="flex:1;min-width:0">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <div class="msg-contact-name">${c.name}</div>
                      ${i===0?`<span class="msg-unread">1</span>`:''}
                    </div>
                    <div class="msg-contact-preview">${i===0&&lastMsg?lastMsg.text.slice(0,40)+'…':'No messages yet'}</div>
                  </div>
                </div>`).join('')}
              </div>
            </div>
            <div class="msg-main">
              <div class="msg-header">
                <div style="display:flex;align-items:center;gap:6px">
                  <button class="btn btn-ghost btn-icon msg-back-btn" onclick="App.msgBack()" title="Back"><i class="fa-solid fa-chevron-left"></i></button>
                  <div class="msg-contact-avatar msg-chat-avatar" style="background:${contacts[0]?.color};width:38px;height:38px;font-size:15px">${contacts[0]?.initials}</div>
                  <div>
                    <div class="msg-chat-name" style="font-weight:600">${contacts[0]?.name}</div>
                    <div class="msg-chat-status" style="font-size:12px;color:var(--text-muted)">Client</div>
                  </div>
                </div>
                <div style="display:flex;gap:6px">
                  <button class="btn btn-secondary btn-sm"><i class="fa-solid fa-file-chart-column"></i> Attach Report</button>
                  <button class="btn btn-secondary btn-sm" onclick="App.toast('Call started','success')"><i class="fa-solid fa-phone"></i></button>
                </div>
              </div>
              <div class="msg-body" id="msg-body">
                ${msgs.map(m=>`
                <div class="msg-bubble-wrap ${m.from===u.id?'mine':'theirs'}">
                  <div class="msg-bubble ${m.from===u.id?'mine':'theirs'}">${m.text}</div>
                  <div class="msg-time">${m.time}</div>
                </div>`).join('')}
              </div>
              <div class="msg-footer">
                <button class="btn btn-ghost btn-icon" onclick="App.toast('Attach file','default')"><i class="fa-solid fa-paperclip"></i></button>
                <input class="msg-input" id="msg-input" placeholder="Message client…" onkeydown="if(event.key==='Enter')FAPages.sendMsg()">
                <button class="btn btn-primary btn-icon" onclick="FAPages.sendMsg()"><i class="fa-solid fa-paper-plane"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  initMessages() { const b=document.getElementById('msg-body'); if(b) b.scrollTop=b.scrollHeight; },

  selectContact(id) {
    const u = App.state.user;
    const myClients = Data.users.filter(x=>x.role==='customer'&&x.faId===u.id);
    const contacts = [...myClients, { id:'TL001', name:'Robert Anderson', role:'Team Leader', initials:'RA', color:'#0A2540' }];
    const c = contacts.find(x=>x.id===id);
    if (!c) return;
    document.querySelectorAll('.msg-contact').forEach(el=>el.classList.toggle('active', el.dataset.id===id));
    const avatar = document.querySelector('.msg-chat-avatar');
    if (avatar) { avatar.style.background = c.color; avatar.textContent = c.initials; }
    const nameEl = document.querySelector('.msg-chat-name');
    if (nameEl) nameEl.textContent = c.name;
    const statusEl = document.querySelector('.msg-chat-status');
    if (statusEl) statusEl.textContent = id==='TL001'?'Team Leader':'Client';
    const msgs = Data.messages.filter(m=>(m.from===u.id&&m.to===id)||(m.from===id&&m.to===u.id));
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
  },

  renderNews() {
    return `
    <div class="app-layout">
      ${App.buildSidebar('fa','fa-news')}
      <div class="main-content">
        ${App.buildHeader('Financial News','Industry updates and market insights')}
        <div class="page-content">
          <div class="search-bar" style="margin-bottom:4px">
            <div class="search-input-wrap"><div class="input-icon-wrap"><i class="input-icon fa-solid fa-magnifying-glass"></i><input class="form-control" placeholder="Search news…" id="fa-news-search" oninput="FAPages.filterNews()"></div></div>
            <div class="filter-bar" id="fa-news-filters">
              ${['All','Markets','Personal Finance','Mortgages','Economy','Savings'].map((c,i)=>`<button class="btn ${i===0?'btn-primary':'btn-secondary'} btn-sm" onclick="FAPages.filterNews('${c}',this)">${c}</button>`).join('')}
            </div>
          </div>
          <div class="news-grid" id="fa-news-grid">
            ${Data.news.map(n=>`
            <div class="news-card" data-category="${n.category}" onclick="FAPages.viewNews('${n.id}')">
              <div class="news-img">${n.emoji}</div>
              <div class="news-body">
                <div class="news-category">${n.category}</div>
                <div class="news-title">${n.title}</div>
                <div class="news-preview">${n.preview.slice(0,90)}…</div>
                <div class="news-meta"><span>${n.source}</span><span>${n.time}</span></div>
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
          <p style="font-size:14px;line-height:1.8;color:var(--text-secondary)">${n.preview} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
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
      document.querySelectorAll('#fa-news-filters .btn').forEach(b => { b.className = 'btn btn-secondary btn-sm'; });
      btn.className = 'btn btn-primary btn-sm';
    }
    const search = document.getElementById('fa-news-search')?.value.toLowerCase() || '';
    document.querySelectorAll('#fa-news-grid .news-card').forEach(card => {
      const catMatch = isAll || card.dataset.category === cat;
      const txtMatch = !search || card.textContent.toLowerCase().includes(search);
      card.style.display = catMatch && txtMatch ? '' : 'none';
    });
  },

  renderReceipts() {
    const receipts = Data.receipts.filter(r=>r.userId==='FA001');
    return `
    <div class="app-layout">
      ${App.buildSidebar('fa','fa-receipts')}
      <div class="main-content">
        ${App.buildHeader('Receipts','Upload and manage expense receipts')}
        <div class="page-content">
          <div class="card">
            <div class="upload-zone" onclick="document.getElementById('fa-file').click()" ondragover="event.preventDefault()" ondrop="event.preventDefault();App.toast('Uploading…','default');setTimeout(()=>App.toast('Receipt processed!','success'),1200)">
              <div class="upload-icon"><i class="fa-solid fa-cloud-arrow-up"></i></div>
              <div class="upload-text">Upload client or expense receipt</div>
              <div class="upload-hint">JPG, PNG, PDF · Max 20MB</div>
              <input type="file" id="fa-file" hidden accept="image/*,.pdf" onchange="App.toast('Uploading…','default');setTimeout(()=>App.toast('Receipt processed!','success'),1000)">
            </div>
          </div>
          <div class="card">
            <div class="card-title" style="margin-bottom:16px">Recent Receipts</div>
            <div class="receipt-grid">
              ${receipts.map(r=>`
              <div class="receipt-card">
                <div class="receipt-thumb">${r.icon}</div>
                <div class="receipt-info">
                  <div class="receipt-name">${r.name}</div>
                  <div class="receipt-amount">${App.fmt.currency(r.amount)}</div>
                  <div class="receipt-date">${App.fmt.date(r.date)}</div>
                </div>
              </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  renderProfile() {
    const u = App.state.user;
    const myCases = Data.cases.filter(c=>c.faId===u.id);
    return `
    <div class="app-layout">
      ${App.buildSidebar('fa','fa-profile')}
      <div class="main-content">
        ${App.buildHeader('My Profile','Financial Advisor profile')}
        <div class="page-content">
          <div class="grid grid-1-2" style="gap:20px">
            <div style="display:flex;flex-direction:column;gap:16px">
              <div class="card profile-card" style="padding:24px">
                <div class="profile-avatar-lg">${u.initials}</div>
                <div class="profile-name">${u.name}</div>
                <div class="profile-role">Financial Advisor · ${u.specialty||'Retail Banking'}</div>
                <div style="margin-top:12px">
                  <span class="badge badge-success"><i class="fa-solid fa-circle"></i> Active</span>
                </div>
                <div class="profile-stats">
                  <div class="profile-stat"><div class="profile-stat-val">${myCases.length}</div><div class="profile-stat-label">Total Cases</div></div>
                  <div class="profile-stat"><div class="profile-stat-val">${myCases.filter(c=>c.status==='closed').length}</div><div class="profile-stat-label">Closed</div></div>
                  <div class="profile-stat"><div class="profile-stat-val">${u.rating||'4.8'}</div><div class="profile-stat-label">Rating</div></div>
                </div>
              </div>
              <div class="card">
                <div class="card-title" style="margin-bottom:14px">Contact Details</div>
                ${[['Email',u.email,'fa-envelope'],['Phone',u.phone,'fa-phone'],['Employee ID',u.id,'fa-id-badge'],['Team Leader','Robert Anderson','fa-users-gear']].map(([l,v,i])=>`
                <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-light)">
                  <i class="fa-solid ${i}" style="color:var(--accent);width:16px"></i>
                  <div><div style="font-size:11px;color:var(--text-muted)">${l}</div><div style="font-size:13.5px;font-weight:500">${v}</div></div>
                </div>`).join('')}
                <button class="btn btn-secondary btn-full" style="margin-top:12px" onclick="App.toast('Edit mode enabled','default')"><i class="fa-solid fa-pen"></i> Edit Profile</button>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:16px">
              <div class="card">
                <div class="card-header">
                  <div class="card-title">Performance</div>
                  <span class="badge badge-success">This Month</span>
                </div>
                <div class="chart-wrap"><canvas id="perfChart"></canvas></div>
              </div>
              <div class="card">
                <div class="card-title" style="margin-bottom:14px">My Cases</div>
                ${myCases.map(c=>`
                <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-light)">
                  <div style="width:8px;height:8px;border-radius:50%;background:${c.status==='active'?'var(--warning)':'var(--success)'};flex-shrink:0"></div>
                  <div style="flex:1">
                    <div style="font-size:13px;font-weight:500">${c.title}</div>
                    <div style="font-size:11px;color:var(--text-muted)">${Data.users.find(x=>x.id===c.clientId)?.name} · ${App.fmt.date(c.deadline)}</div>
                  </div>
                  <span class="badge ${c.status==='active'?'badge-warning':'badge-success'}">${c.status}</span>
                </div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  initProfile: function() {
    App.createChart('perfChart', {
      type: 'line',
      data: {
        labels: Data.teamStats.months,
        datasets: [{
          label:'Closure Rate %',
          data: Data.teamStats.closureRate,
          borderColor:'#0066FF', backgroundColor:'rgba(0,102,255,0.1)', fill:true, tension:0.4, pointBackgroundColor:'#0066FF', pointRadius:4
        }]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ min:50, max:100, grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ callback:v=>v+'%' } }, x:{ grid:{ display:false } } } }
    });
  },
};
