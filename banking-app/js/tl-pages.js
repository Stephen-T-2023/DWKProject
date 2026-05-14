/* ===== TEAM LEADER PAGES ===== */
const TLPages = {

  renderDashboard() {
    const fas = Data.users.filter(x=>x.role==='fa');
    const allCases = Data.cases;
    const activeCases = allCases.filter(c=>c.status==='active');
    const closedCases = allCases.filter(c=>c.status==='closed');
    const openComplaints = Data.complaints.filter(c=>c.status==='open');
    const allClients = Data.users.filter(x=>x.role==='customer');
    const ratio = Data.teamStats.caseRatio;
    return `
    <div class="app-layout">
      ${App.buildSidebar('teamleader','tl-dashboard')}
      <div class="main-content">
        ${App.buildHeader('Manager Dashboard', `Team overview — ${App.fmt.date(new Date().toISOString().slice(0,10))}`)}
        <div class="page-content">

          <div class="grid grid-4">
            <div class="stat-card">
              <div class="flex items-center justify-between">
                <div class="stat-card-label">Total Clients</div>
                <div class="stat-card-icon" style="background:#EFF6FF"><i class="fa-solid fa-users" style="color:#3B82F6"></i></div>
              </div>
              <div class="stat-card-value">${allClients.length}</div>
              <div class="stat-card-change up"><i class="fa-solid fa-arrow-up"></i> +1 this month</div>
            </div>
            <div class="stat-card">
              <div class="flex items-center justify-between">
                <div class="stat-card-label">Active Cases</div>
                <div class="stat-card-icon" style="background:var(--warning-bg)"><i class="fa-solid fa-folder-open" style="color:var(--warning)"></i></div>
              </div>
              <div class="stat-card-value">${activeCases.length}</div>
              <div class="stat-card-change down"><i class="fa-solid fa-arrow-down"></i> 3 high priority</div>
            </div>
            <div class="stat-card">
              <div class="flex items-center justify-between">
                <div class="stat-card-label">Closed This Month</div>
                <div class="stat-card-icon" style="background:#F0FDF4"><i class="fa-solid fa-circle-check" style="color:#22C55E"></i></div>
              </div>
              <div class="stat-card-value">${closedCases.length}</div>
              <div class="stat-card-change up"><i class="fa-solid fa-arrow-up"></i> 57% closure rate</div>
            </div>
            <div class="stat-card">
              <div class="flex items-center justify-between">
                <div class="stat-card-label">Open Complaints</div>
                <div class="stat-card-icon" style="background:var(--danger-bg)"><i class="fa-solid fa-triangle-exclamation" style="color:var(--danger)"></i></div>
              </div>
              <div class="stat-card-value" style="color:${openComplaints.length>0?'var(--danger)':'var(--text)'}">${openComplaints.length}</div>
              <div class="stat-card-change ${openComplaints.length>0?'down':'up'}">
                ${openComplaints.length>0?'<i class="fa-solid fa-arrow-up"></i> Requires attention':'<i class="fa-solid fa-check"></i> All resolved'}
              </div>
            </div>
          </div>

          <div class="grid grid-2">
            <div class="card">
              <div class="card-header">
                <div class="card-title">Team Closure Rate</div>
                <span class="badge badge-success">Trending up</span>
              </div>
              <div class="chart-wrap"><canvas id="closureChart"></canvas></div>
            </div>
            <div class="card">
              <div class="card-header">
                <div class="card-title">Case Difficulty Ratio</div>
                <button class="btn btn-ghost btn-sm" onclick="App.navigate('tl-cases')">Detail <i class="fa-solid fa-arrow-right"></i></button>
              </div>
              <div class="chart-wrap" style="height:200px"><canvas id="difficultyChart"></canvas></div>
              <div style="display:flex;gap:12px;justify-content:center;margin-top:8px">
                <div style="display:flex;align-items:center;gap:6px;font-size:12px"><div style="width:12px;height:12px;border-radius:3px;background:#22C55E"></div>Low (${ratio.low})</div>
                <div style="display:flex;align-items:center;gap:6px;font-size:12px"><div style="width:12px;height:12px;border-radius:3px;background:#F59E0B"></div>Medium (${ratio.medium})</div>
                <div style="display:flex;align-items:center;gap:6px;font-size:12px"><div style="width:12px;height:12px;border-radius:3px;background:#EF4444"></div>High (${ratio.high})</div>
              </div>
            </div>
          </div>

          <div class="grid grid-2">
            <div class="card">
              <div class="card-header">
                <div class="card-title">Financial Advisor Performance</div>
                <button class="btn btn-secondary btn-sm" onclick="App.navigate('tl-fa-profiles')"><i class="fa-solid fa-id-card"></i> View All</button>
              </div>
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Advisor</th><th>Clients</th><th>Active</th><th>Closed</th><th>Rating</th><th>Status</th></tr></thead>
                  <tbody>
                    ${fas.map(f=>{
                      const faCases = Data.cases.filter(c=>c.faId===f.id);
                      const active = faCases.filter(c=>c.status==='active').length;
                      const closed = faCases.filter(c=>c.status==='closed').length;
                      const clients = Data.users.filter(x=>x.role==='customer'&&x.faId===f.id).length;
                      return `<tr>
                        <td><div style="display:flex;align-items:center;gap:8px">
                          <div class="sidebar-avatar" style="width:30px;height:30px;font-size:11px;background:${f.color}">${f.initials}</div>
                          <div><div style="font-weight:500">${f.name}</div><div style="font-size:11px;color:var(--text-muted)">${f.specialty||''}</div></div>
                        </div></td>
                        <td>${clients}</td>
                        <td><span class="badge badge-warning">${active}</span></td>
                        <td><span class="badge badge-success">${closed}</span></td>
                        <td><i class="fa-solid fa-star" style="color:var(--gold);font-size:12px"></i> ${f.rating||'4.7'}</td>
                        <td><span class="badge badge-success"><i class="fa-solid fa-circle"></i> Active</span></td>
                      </tr>`;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <div class="card-title">Case Distribution</div>
              </div>
              <div class="chart-wrap" style="height:200px"><canvas id="caseDistChart"></canvas></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Complaint Summary</div>
              <button class="btn btn-primary btn-sm" onclick="App.navigate('tl-complaints')"><i class="fa-solid fa-triangle-exclamation"></i> Manage</button>
            </div>
            <div class="grid grid-4">
              ${[
                ['Total', Data.complaints.length, 'var(--text)', 'fa-list'],
                ['Open', Data.complaints.filter(c=>c.status==='open').length, 'var(--danger)', 'fa-circle-exclamation'],
                ['In Progress', Data.complaints.filter(c=>c.status==='in-progress').length, 'var(--warning)', 'fa-spinner'],
                ['Resolved', Data.complaints.filter(c=>c.status==='resolved').length, 'var(--success)', 'fa-circle-check'],
              ].map(([l,v,color,icon])=>`
              <div style="text-align:center;padding:16px;background:var(--surface-2);border-radius:var(--radius-sm)">
                <i class="fa-solid ${icon}" style="color:${color};font-size:20px;margin-bottom:8px;display:block"></i>
                <div style="font-size:24px;font-weight:700;color:${color}">${v}</div>
                <div style="font-size:12px;color:var(--text-muted)">${l}</div>
              </div>`).join('')}
            </div>
          </div>

        </div>
      </div>
    </div>`;
  },

  initDashboard() {
    App.createChart('closureChart', {
      type:'line',
      data:{
        labels:Data.teamStats.months,
        datasets:[{ label:'Closure Rate %', data:Data.teamStats.closureRate, borderColor:'#22C55E', backgroundColor:'rgba(34,197,94,0.1)', fill:true, tension:0.4, pointBackgroundColor:'#22C55E', pointRadius:4 }]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ min:50, max:100, grid:{ color:'rgba(0,0,0,0.04)' }, ticks:{ callback:v=>v+'%' } }, x:{ grid:{ display:false } } } }
    });
    const r = Data.teamStats.caseRatio;
    App.createChart('difficultyChart', {
      type:'doughnut',
      data:{ labels:['Low','Medium','High'], datasets:[{ data:[r.low,r.medium,r.high], backgroundColor:['#22C55E','#F59E0B','#EF4444'], borderWidth:0 }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, cutout:'65%' }
    });
    const fas = Data.users.filter(x=>x.role==='fa');
    App.createChart('caseDistChart', {
      type:'bar',
      data:{
        labels:fas.map(f=>f.name.split(' ')[0]),
        datasets:[
          { label:'Active', data:fas.map(f=>Data.cases.filter(c=>c.faId===f.id&&c.status==='active').length), backgroundColor:'#F59E0B', borderRadius:4 },
          { label:'Closed', data:fas.map(f=>Data.cases.filter(c=>c.faId===f.id&&c.status==='closed').length), backgroundColor:'#22C55E', borderRadius:4 },
        ]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ padding:14, font:{ size:11 } } } }, scales:{ x:{ grid:{ display:false }, stacked:false }, y:{ grid:{ color:'rgba(0,0,0,0.04)' } } } }
    });
  },

  renderCases() {
    const allCases = Data.cases;
    const fas = Data.users.filter(x=>x.role==='fa');
    return `
    <div class="app-layout">
      ${App.buildSidebar('teamleader','tl-cases')}
      <div class="main-content">
        ${App.buildHeader('Case Management','View, assign, and track all cases')}
        <div class="page-content">

          <div class="grid grid-4">
            ${[
              ['All Cases', allCases.length, '#3B82F6', 'fa-folder'],
              ['Active', allCases.filter(c=>c.status==='active').length, 'var(--warning)', 'fa-folder-open'],
              ['High Priority', allCases.filter(c=>c.priority==='high').length, 'var(--danger)', 'fa-fire'],
              ['Closed', allCases.filter(c=>c.status==='closed').length, 'var(--success)', 'fa-check-circle'],
            ].map(([l,v,color,icon])=>`
            <div class="stat-card">
              <div class="stat-card-label">${l}</div>
              <div class="stat-card-value" style="color:${color}">${v}</div>
              <div class="stat-card-icon" style="background:${color}18;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:8px">
                <i class="fa-solid ${icon}" style="color:${color}"></i>
              </div>
            </div>`).join('')}
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">All Cases</div>
              <div style="display:flex;gap:8px">
                <select class="form-control" style="width:150px" id="case-filter-fa" onchange="TLPages.filterCases()">
                  <option value="">All Advisors</option>
                  ${fas.map(f=>`<option value="${f.id}">${f.name}</option>`).join('')}
                </select>
                <select class="form-control" style="width:130px" id="case-filter-status" onchange="TLPages.filterCases()">
                  <option value="">All statuses</option><option>active</option><option>closed</option>
                </select>
                <select class="form-control" style="width:130px" id="case-filter-priority" onchange="TLPages.filterCases()">
                  <option value="">All priorities</option><option>high</option><option>medium</option><option>low</option>
                </select>
                <button class="btn btn-primary btn-sm" onclick="TLPages.assignCaseModal()"><i class="fa-solid fa-plus"></i> Assign</button>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px" id="case-grid">
              ${allCases.map(c=>TLPages.buildCaseCard(c)).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Case Difficulty Distribution</div>
            </div>
            <div style="display:flex;gap:20px;align-items:center">
              <div class="chart-wrap" style="width:200px;height:200px;flex-shrink:0"><canvas id="diffChart2"></canvas></div>
              <div style="flex:1;display:flex;flex-direction:column;gap:12px">
                ${[['Low','#22C55E',Data.cases.filter(c=>c.difficulty==='low').length],['Medium','#F59E0B',Data.cases.filter(c=>c.difficulty==='medium').length],['High','#EF4444',Data.cases.filter(c=>c.difficulty==='high').length]].map(([l,c,n])=>{
                  const pct = Math.round(n/Data.cases.length*100);
                  return `<div>
                    <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
                      <span style="display:flex;align-items:center;gap:6px"><div style="width:10px;height:10px;border-radius:50%;background:${c}"></div>${l}</span>
                      <span style="font-weight:600">${n} cases (${pct}%)</span>
                    </div>
                    <div class="budget-bar"><div class="budget-bar-fill" style="width:${pct}%;background:${c}"></div></div>
                  </div>`;
                }).join('')}
                <div class="alert alert-info" style="margin-top:4px;font-size:12px"><i class="fa-solid fa-circle-info"></i><div>High-difficulty cases should be reviewed weekly by Team Leader.</div></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>`;
  },

  initCases() {
    const r = Data.teamStats.caseRatio;
    App.createChart('diffChart2', {
      type:'doughnut',
      data:{ labels:['Low','Medium','High'], datasets:[{ data:[r.low,r.medium,r.high], backgroundColor:['#22C55E','#F59E0B','#EF4444'], borderWidth:0 }] },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, cutout:'60%' }
    });
  },

  buildCaseCard(c) {
    const client = Data.users.find(x=>x.id===c.clientId);
    const fa = Data.users.find(x=>x.id===c.faId);
    const priorityColor = c.priority==='high'?'var(--danger)':c.priority==='medium'?'var(--warning)':'var(--success)';
    return `
    <div class="case-card" id="case-${c.id}">
      <div class="case-header">
        <div>
          <div class="case-id">${c.id}</div>
          <div class="case-title">${c.title}</div>
        </div>
        <span class="badge ${c.status==='active'?'badge-warning':'badge-success'}">${c.status}</span>
      </div>
      <div class="case-meta">
        <div style="display:flex;align-items:center;gap:6px;font-size:12px">
          <div class="sidebar-avatar" style="width:22px;height:22px;font-size:9px;background:${client?.color}">${client?.initials}</div>${client?.name}
        </div>
        <div style="display:flex;align-items:center;gap:6px;font-size:12px">
          <div class="sidebar-avatar" style="width:22px;height:22px;font-size:9px;background:${fa?.color}">${fa?.initials}</div>${fa?.name}
        </div>
        <span class="badge badge-danger-muted" style="background:${priorityColor}18;color:${priorityColor}">${c.priority} priority</span>
        <span class="badge badge-muted">${c.difficulty} difficulty</span>
      </div>
      <div class="case-meta">
        ${c.tags.map(t=>`<span class="tag" style="font-size:10px;padding:2px 7px">${t}</span>`).join('')}
      </div>
      <div class="case-progress"><div class="case-progress-fill" style="width:${c.progress}%"></div></div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:6px">
        <span>${c.progress}% complete</span><span>Due: ${App.fmt.date(c.deadline)}</span>
      </div>
      <div style="display:flex;gap:6px;margin-top:12px">
        <button class="btn btn-secondary btn-sm" onclick="TLPages.reassignCase('${c.id}')"><i class="fa-solid fa-arrow-right-arrow-left"></i> Reassign</button>
        <button class="btn btn-secondary btn-sm" onclick="TLPages.viewCaseHistory('${c.id}')"><i class="fa-solid fa-clock-rotate-left"></i> History</button>
        ${c.status==='active'?`<button class="btn btn-success btn-sm" onclick="TLPages.closeCase('${c.id}')"><i class="fa-solid fa-check"></i> Close</button>`:''}
      </div>
    </div>`;
  },

  filterCases() {
    const faId = document.getElementById('case-filter-fa').value;
    const status = document.getElementById('case-filter-status').value;
    const priority = document.getElementById('case-filter-priority').value;
    const grid = document.getElementById('case-grid');
    let cases = Data.cases;
    if (faId) cases = cases.filter(c=>c.faId===faId);
    if (status) cases = cases.filter(c=>c.status===status);
    if (priority) cases = cases.filter(c=>c.priority===priority);
    grid.innerHTML = cases.length ? cases.map(c=>TLPages.buildCaseCard(c)).join('') :
      `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon"><i class="fa-solid fa-folder-open"></i></div><div class="empty-title">No cases found</div></div>`;
  },

  assignCaseModal() {
    const fas = Data.users.filter(x=>x.role==='fa');
    const clients = Data.users.filter(x=>x.role==='customer');
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-plus" style="color:var(--accent);margin-right:8px"></i>Assign New Case</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Case title</label><input class="form-control" placeholder="e.g. Pension Review 2026"></div>
          <div class="form-group"><label class="form-label">Client</label><select class="form-control">${clients.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
          <div class="form-group"><label class="form-label">Assign to Financial Advisor</label><select class="form-control">${fas.map(f=>`<option value="${f.id}">${f.name} — ${f.cases} active cases</option>`).join('')}</select></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group"><label class="form-label">Priority</label><select class="form-control"><option>low</option><option>medium</option><option>high</option></select></div>
            <div class="form-group"><label class="form-label">Difficulty</label><select class="form-control"><option>low</option><option>medium</option><option>high</option></select></div>
          </div>
          <div class="form-group"><label class="form-label">Deadline</label><input class="form-control" type="date" value="${new Date(Date.now()+30*24*60*60*1000).toISOString().slice(0,10)}"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="modal-confirm-btn"><i class="fa-solid fa-check"></i> Create & Assign</button>
        </div>
      </div>`, () => App.toast('Case created and assigned!', 'success', 3000));
  },

  reassignCase(id) {
    const c = Data.cases.find(x=>x.id===id);
    const fas = Data.users.filter(x=>x.role==='fa');
    const activeCounts = fas.reduce((m,f)=>{ m[f.id]=Data.cases.filter(x=>x.faId===f.id&&x.status==='active').length; return m; }, {});
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-arrow-right-arrow-left" style="color:var(--accent);margin-right:8px"></i>Reassign Case</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div style="padding:10px;background:var(--surface-2);border-radius:8px;margin-bottom:12px">
            <div style="font-size:13px;font-weight:600">${c?.title}</div>
            <div style="font-size:12px;color:var(--text-muted)">Currently: ${Data.users.find(x=>x.id===c?.faId)?.name}</div>
          </div>
          <div class="form-group">
            <label class="form-label">Reassign to</label>
            <select class="form-control" id="reassign-fa-sel">${fas.filter(f=>f.id!==c?.faId).map(f=>`<option value="${f.id}">${f.name} — ${activeCounts[f.id]||0} active cases</option>`).join('')}</select>
          </div>
          <div class="form-group"><label class="form-label">Reason</label><textarea class="form-control" rows="2" placeholder="Reason for reassignment…"></textarea></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="modal-confirm-btn"><i class="fa-solid fa-check"></i> Confirm Reassignment</button>
        </div>
      </div>`, () => {
        const newFaId = document.getElementById('reassign-fa-sel')?.value;
        if (c && newFaId) {
          c.faId = newFaId;
          App.toast('Case reassigned successfully', 'success');
          App.navigate('tl-cases');
        }
      });
  },

  closeCase(id) {
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Close Case</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="modal-icon-wrap">
            <div class="modal-icon success"><i class="fa-solid fa-check-circle"></i></div>
            <div class="modal-confirm-text">Mark this case as closed? The client and FA will be notified.</div>
          </div>
          <div class="form-group"><label class="form-label">Closure notes</label><textarea class="form-control" rows="3" placeholder="Summary of resolution…"></textarea></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-success" id="modal-confirm-btn"><i class="fa-solid fa-check"></i> Close Case</button>
        </div>
      </div>`, () => {
        const c = Data.cases.find(x=>x.id===id);
        if (c) { c.status='closed'; c.progress=100; }
        App.toast('Case closed successfully', 'success');
        const el = document.getElementById('case-'+id);
        if (el) el.innerHTML = TLPages.buildCaseCard(Data.cases.find(x=>x.id===id));
      });
  },

  viewCaseHistory(id) {
    const c = Data.cases.find(x=>x.id===id);
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-clock-rotate-left" style="color:var(--accent);margin-right:8px"></i>Case History — ${c?.id}</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          ${[
            { date: c?.opened, event: 'Case opened', detail: `Assigned to ${Data.users.find(x=>x.id===c?.faId)?.name}`, icon:'fa-folder-plus', color:'var(--accent)' },
            { date: '2026-04-22', event: 'Initial assessment', detail: 'First client meeting completed. Documents collected.', icon:'fa-file-lines', color:'var(--info)' },
            { date: '2026-05-01', event: 'Progress update 25%', detail: 'Analysis in progress. Awaiting additional statements.', icon:'fa-chart-line', color:'var(--warning)' },
            { date: '2026-05-08', event: 'Progress update 50%', detail: 'Draft recommendations prepared and shared with client.', icon:'fa-arrow-up', color:'var(--success)' },
          ].map(h=>`
          <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-light)">
            <div style="width:32px;height:32px;border-radius:50%;background:${h.color}18;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <i class="fa-solid ${h.icon}" style="color:${h.color};font-size:13px"></i>
            </div>
            <div>
              <div style="font-size:13px;font-weight:600">${h.event}</div>
              <div style="font-size:12px;color:var(--text-secondary)">${h.detail}</div>
              <div style="font-size:11px;color:var(--text-muted)">${App.fmt.date(h.date)}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>`);
  },

  renderComplaints() {
    return `
    <div class="app-layout">
      ${App.buildSidebar('teamleader','tl-complaints')}
      <div class="main-content">
        ${App.buildHeader('Complaint Management','Review and resolve client complaints')}
        <div class="page-content">

          <div class="grid grid-4">
            ${[
              ['Open', Data.complaints.filter(c=>c.status==='open').length, 'var(--danger)'],
              ['In Progress', Data.complaints.filter(c=>c.status==='in-progress').length, 'var(--warning)'],
              ['Resolved', Data.complaints.filter(c=>c.status==='resolved').length, 'var(--success)'],
              ['Avg Resolution', '4.2 days', 'var(--accent)'],
            ].map(([l,v,color])=>`
            <div class="stat-card">
              <div class="stat-card-label">${l}</div>
              <div class="stat-card-value" style="color:${color}">${v}</div>
            </div>`).join('')}
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">All Complaints</div>
              <div style="display:flex;gap:8px">
                <select class="form-control" style="width:130px" id="comp-status" onchange="TLPages.filterComplaints()">
                  <option value="">All statuses</option><option>open</option><option>in-progress</option><option>resolved</option>
                </select>
                <select class="form-control" style="width:130px" id="comp-severity" onchange="TLPages.filterComplaints()">
                  <option value="">All severities</option><option>low</option><option>medium</option><option>high</option>
                </select>
                <button class="btn btn-primary btn-sm" onclick="TLPages.newComplaint()"><i class="fa-solid fa-plus"></i> Log Complaint</button>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px" id="complaint-list">
              ${Data.complaints.map(c=>TLPages.buildComplaintCard(c)).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Complaint Trend</div>
            </div>
            <div class="chart-wrap"><canvas id="complaintChart"></canvas></div>
          </div>

        </div>
      </div>
    </div>`;
  },

  initComplaints() {
    App.createChart('complaintChart', {
      type:'bar',
      data:{
        labels:['Nov','Dec','Jan','Feb','Mar','Apr','May'],
        datasets:[
          { label:'Open', data:[3,5,2,4,3,2,2], backgroundColor:'rgba(239,68,68,0.8)', borderRadius:4 },
          { label:'Resolved', data:[2,3,4,3,5,4,1], backgroundColor:'rgba(34,197,94,0.8)', borderRadius:4 },
        ]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top' } }, scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(0,0,0,0.04)' } } } }
    });
  },

  buildComplaintCard(c) {
    const client = Data.users.find(x=>x.id===c.clientId);
    const fa = Data.users.find(x=>x.id===c.assignedFa);
    const statusBadge = { open:'badge-danger', 'in-progress':'badge-warning', resolved:'badge-success' };
    const sevBadge = { low:'badge-success', medium:'badge-warning', high:'badge-danger' };
    return `
    <div class="complaint-card" id="cmp-${c.id}">
      <div style="flex:1">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
          <div>
            <div class="complaint-number">${c.id}</div>
            <div class="complaint-title">${c.title}</div>
            <div class="complaint-desc">${c.desc}</div>
            ${c.resolution?`<div style="margin-top:8px;padding:8px;background:var(--success-bg);border-radius:6px;font-size:12px;color:#15803D"><i class="fa-solid fa-check"></i> <strong>Resolution:</strong> ${c.resolution}</div>`:''}
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;flex-shrink:0">
            <span class="badge ${statusBadge[c.status]||'badge-muted'}">${c.status}</span>
            <span class="badge ${sevBadge[c.severity]||'badge-muted'}">${c.severity}</span>
          </div>
        </div>
        <div class="complaint-meta">
          <div style="display:flex;align-items:center;gap:5px;font-size:12px">
            <div class="sidebar-avatar" style="width:20px;height:20px;font-size:8px;background:${client?.color}">${client?.initials}</div>${client?.name}
          </div>
          <div style="display:flex;align-items:center;gap:5px;font-size:12px">
            <i class="fa-solid fa-user-tie" style="color:var(--text-muted)"></i>${fa?.name}
          </div>
          <span style="font-size:11px;color:var(--text-muted)">${App.fmt.date(c.date)}</span>
          <div style="display:flex;gap:6px;margin-left:auto">
            ${c.status!=='resolved'?`<button class="btn btn-primary btn-sm" onclick="TLPages.resolveComplaint('${c.id}')"><i class="fa-solid fa-check"></i> Resolve</button>`:''}
            <button class="btn btn-secondary btn-sm" onclick="TLPages.reassignComplaint('${c.id}')"><i class="fa-solid fa-arrow-right-arrow-left"></i></button>
          </div>
        </div>
      </div>
    </div>`;
  },

  filterComplaints() {
    const status = document.getElementById('comp-status').value;
    const severity = document.getElementById('comp-severity').value;
    let complaints = Data.complaints;
    if (status) complaints = complaints.filter(c=>c.status===status);
    if (severity) complaints = complaints.filter(c=>c.severity===severity);
    document.getElementById('complaint-list').innerHTML = complaints.map(c=>TLPages.buildComplaintCard(c)).join('') ||
      `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-check-circle"></i></div><div class="empty-title">No complaints found</div></div>`;
  },

  resolveComplaint(id) {
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-check-circle" style="color:var(--success);margin-right:8px"></i>Resolve Complaint</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Resolution notes</label><textarea class="form-control" rows="4" id="resolution-text" placeholder="Describe how the complaint was resolved…"></textarea></div>
          <div class="alert alert-info"><i class="fa-solid fa-circle-info"></i><div class="alert-body">The client and assigned advisor will be notified of the resolution.</div></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-success" id="modal-confirm-btn"><i class="fa-solid fa-check"></i> Mark Resolved</button>
        </div>
      </div>`, () => {
        const c = Data.complaints.find(x=>x.id===id);
        if (c) { c.status='resolved'; c.resolution=document.getElementById('resolution-text')?.value||'Resolved by Team Leader'; }
        App.toast('Complaint marked as resolved', 'success');
        document.getElementById('complaint-list').innerHTML = Data.complaints.map(x=>TLPages.buildComplaintCard(x)).join('');
      });
  },

  reassignComplaint(_id) {
    const fas = Data.users.filter(x=>x.role==='fa');
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Reassign Complaint</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Assign to</label><select class="form-control">${fas.map(f=>`<option>${f.name}</option>`).join('')}</select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="modal-confirm-btn"><i class="fa-solid fa-check"></i> Reassign</button>
        </div>
      </div>`, () => App.toast('Complaint reassigned', 'success'));
  },

  newComplaint() {
    const clients = Data.users.filter(x=>x.role==='customer');
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Log New Complaint</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Client</label><select class="form-control">${clients.map(c=>`<option>${c.name}</option>`).join('')}</select></div>
          <div class="form-group"><label class="form-label">Title</label><input class="form-control" placeholder="Brief title…"></div>
          <div class="form-group"><label class="form-label">Description</label><textarea class="form-control" rows="3"></textarea></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="form-group"><label class="form-label">Severity</label><select class="form-control"><option>low</option><option>medium</option><option>high</option></select></div>
            <div class="form-group"><label class="form-label">Assign to</label><select class="form-control">${Data.users.filter(x=>x.role==='fa').map(f=>`<option>${f.name}</option>`).join('')}</select></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="modal-confirm-btn"><i class="fa-solid fa-check"></i> Log Complaint</button>
        </div>
      </div>`, () => App.toast('Complaint logged and assigned', 'success'));
  },

  renderSecurity() {
    const checks = [
      { icon:'fa-shield-halved', title:'SSL Encryption', desc:'All connections using TLS 1.3', status:'pass', color:'var(--success)' },
      { icon:'fa-fingerprint', title:'2FA Coverage', desc:'98% of active users have 2FA enabled', status:'pass', color:'var(--success)' },
      { icon:'fa-key', title:'Password Policies', desc:'Minimum 8 chars, mixed case required', status:'pass', color:'var(--success)' },
      { icon:'fa-rotate', title:'Session Timeouts', desc:'15-minute inactivity timeout active', status:'pass', color:'var(--success)' },
      { icon:'fa-eye', title:'Audit Logging', desc:'All admin actions logged and monitored', status:'pass', color:'var(--success)' },
      { icon:'fa-lock-open', title:'Dormant Accounts', desc:'3 accounts inactive >90 days — review needed', status:'warn', color:'var(--warning)' },
      { icon:'fa-triangle-exclamation', title:'Failed Login Attempts', desc:'2 accounts with >5 failed attempts today', status:'warn', color:'var(--warning)' },
      { icon:'fa-virus-slash', title:'Malware Scanning', desc:'Last scan: 12 May 2026 02:00 UTC — Clean', status:'pass', color:'var(--success)' },
    ];
    return `
    <div class="app-layout">
      ${App.buildSidebar('teamleader','tl-security')}
      <div class="main-content">
        ${App.buildHeader('Security Audit','Platform security monitoring and compliance')}
        <div class="page-content">

          <div class="grid grid-3">
            <div class="card" style="grid-column:span 1">
              <div class="security-score">
                <div class="security-score-value">91</div>
                <div class="security-score-label">Security Score</div>
                <div style="margin-top:10px"><span class="badge badge-success"><i class="fa-solid fa-shield-halved"></i> Good</span></div>
              </div>
              <div style="height:10px;background:var(--border);border-radius:5px;overflow:hidden;margin:8px 0">
                <div style="width:91%;height:100%;background:linear-gradient(90deg,#22C55E,#86EFAC);border-radius:5px"></div>
              </div>
              <div style="font-size:12px;color:var(--text-muted);text-align:center">2 items need attention</div>
            </div>
            <div class="card" style="grid-column:span 2">
              <div class="card-header">
                <div class="card-title">Last 30 Day Activity</div>
              </div>
              <div class="chart-wrap" style="height:160px"><canvas id="secChart"></canvas></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Security Checklist</div>
              <button class="btn btn-secondary btn-sm" onclick="App.toast('Report exported','success')"><i class="fa-solid fa-download"></i> Export Report</button>
            </div>
            <div class="grid grid-2" id="security-grid-inner">
              ${checks.map(c=>`
              <div class="security-item">
                <div class="security-item-icon" style="background:${c.color}18;color:${c.color}">
                  <i class="fa-solid ${c.icon}"></i>
                </div>
                <div class="security-item-info">
                  <div class="security-item-title">${c.title}</div>
                  <div class="security-item-desc">${c.desc}</div>
                </div>
                <span class="badge ${c.status==='pass'?'badge-success':'badge-warning'}">${c.status==='pass'?'Pass':'Review'}</span>
              </div>`).join('')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Recent Security Events</div>
            </div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Event</th><th>User</th><th>IP Address</th><th>Time</th><th>Severity</th><th>Action</th></tr></thead>
                <tbody>
                  ${[
                    ['Failed login attempt ×5','C002 — James Thompson','185.220.101.47','2026-05-13 09:14','high'],
                    ['New device sign-in','FA001 — David Chen','82.45.123.91','2026-05-13 08:02','info'],
                    ['Password changed','C001 — Sarah Mitchell','172.16.0.55','2026-05-12 14:30','info'],
                    ['Account frozen by user','C001 — Sarah Mitchell','172.16.0.55','2026-05-11 11:45','medium'],
                    ['2FA disabled (re-enabled)','FA002 — Emily Williams','10.0.0.2','2026-05-10 16:20','medium'],
                  ].map(([e,u,ip,t,s])=>`<tr>
                    <td style="font-weight:500">${e}</td>
                    <td style="font-size:12px">${u}</td>
                    <td style="font-family:monospace;font-size:12px">${ip}</td>
                    <td style="font-size:12px;color:var(--text-muted)">${t}</td>
                    <td><span class="badge ${s==='high'?'badge-danger':s==='medium'?'badge-warning':'badge-info'}">${s}</span></td>
                    <td><button class="btn btn-ghost btn-sm" onclick="App.toast('Reviewed','success')">Review</button></td>
                  </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>`;
  },

  initSecurity() {
    App.createChart('secChart', {
      type:'line',
      data:{
        labels:['1','5','10','15','20','25','30'].map(d=>`May ${d}`),
        datasets:[
          { label:'Logins', data:[45,52,48,61,55,58,63], borderColor:'#3B82F6', backgroundColor:'rgba(59,130,246,0.1)', fill:true, tension:0.4, pointRadius:3 },
          { label:'Alerts', data:[2,1,3,2,4,1,2], borderColor:'#EF4444', backgroundColor:'rgba(239,68,68,0.1)', fill:true, tension:0.4, pointRadius:3 },
        ]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ font:{ size:11 } } } }, scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(0,0,0,0.04)' } } } }
    });
  },

  _workloadScore(faId) {
    const w = { low:1, medium:2, high:3 };
    return Data.cases.filter(c=>c.faId===faId&&c.status==='active').reduce((s,c)=>s+(w[c.difficulty]||1),0);
  },

  renderFAProfiles() {
    const fas = Data.users.filter(x=>x.role==='fa');
    return `
    <div class="app-layout">
      ${App.buildSidebar('teamleader','tl-fa-profiles')}
      <div class="main-content">
        ${App.buildHeader('FA Profiles','Financial Advisor team management')}
        <div class="page-content">
          <div class="search-bar" style="margin-bottom:4px">
            <div class="search-input-wrap"><div class="input-icon-wrap"><i class="input-icon fa-solid fa-magnifying-glass"></i><input class="form-control" placeholder="Search advisors…"></div></div>
            <select class="form-control" style="width:160px"><option>All specialties</option><option>Retail Banking</option><option>Investments</option><option>Mortgages</option></select>
            <button class="btn btn-secondary btn-sm" onclick="App.showAccessibilityModal()"><i class="fa-solid fa-universal-access"></i> Accessibility</button>
          </div>

          <div class="card">
            <div class="card-header">
              <div><div class="card-title">Team Workload Overview</div><div class="card-subtitle">Based on active case difficulty scores</div></div>
              <span class="badge badge-info">${fas.length} advisors</span>
            </div>
            <div class="chart-wrap" style="height:180px"><canvas id="workloadChart"></canvas></div>
            <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
              ${fas.map(f=>{
                const score = TLPages._workloadScore(f.id);
                const label = score<=2?'Low':score<=4?'Medium':'High';
                const col = score<=2?'var(--success)':score<=4?'var(--warning)':'var(--danger)';
                return `<div style="flex:1;min-width:80px;text-align:center;padding:10px 8px;background:var(--surface-2);border-radius:8px">
                  <div style="font-size:16px;font-weight:700;color:${col}">${label}</div>
                  <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${f.name.split(' ')[0]}</div>
                  <div style="font-size:11px;color:var(--text-muted)">${score} pts</div>
                </div>`;
              }).join('')}
            </div>
          </div>

          <div class="grid grid-3">
            ${fas.map(f=>{
              const faCases = Data.cases.filter(c=>c.faId===f.id);
              const clients = Data.users.filter(x=>x.role==='customer'&&x.faId===f.id);
              const score = TLPages._workloadScore(f.id);
              const wLabel = score<=2?'Low':score<=4?'Medium':'High';
              const wCol = score<=2?'var(--success)':score<=4?'var(--warning)':'var(--danger)';
              const wPct = Math.min(100, Math.round(score/9*100));
              return `
              <div class="card" style="text-align:center;padding:24px">
                <div class="profile-avatar-lg" style="background:linear-gradient(135deg,${f.color},${f.color}99)">${f.initials}</div>
                <div class="profile-name">${f.name}</div>
                <div class="profile-role">${f.specialty||'Banking'}</div>
                <div style="margin-top:8px"><span class="badge badge-success"><i class="fa-solid fa-circle"></i> Active</span></div>
                <div style="margin-top:12px;font-size:12px;color:var(--text-muted)">${f.email}</div>
                <div class="profile-stats">
                  <div class="profile-stat"><div class="profile-stat-val">${clients.length}</div><div class="profile-stat-label">Clients</div></div>
                  <div class="profile-stat"><div class="profile-stat-val">${faCases.filter(c=>c.status==='active').length}</div><div class="profile-stat-label">Active</div></div>
                  <div class="profile-stat"><div class="profile-stat-val"><i class="fa-solid fa-star" style="color:var(--gold);font-size:12px"></i> ${f.rating}</div><div class="profile-stat-label">Rating</div></div>
                </div>
                <div style="margin-top:8px;text-align:left">
                  <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
                    <span style="color:var(--text-muted)">Workload</span>
                    <span style="color:${wCol};font-weight:600">${wLabel}</span>
                  </div>
                  <div style="height:6px;background:var(--border);border-radius:10px;overflow:hidden">
                    <div style="height:100%;width:${wPct}%;background:${wCol};border-radius:10px;transition:width 0.6s ease"></div>
                  </div>
                </div>
                <div style="display:flex;gap:8px;margin-top:12px">
                  <button class="btn btn-secondary btn-sm" style="flex:1" onclick="App.navigate('tl-messages')"><i class="fa-solid fa-message"></i></button>
                  <button class="btn btn-primary btn-sm" style="flex:1" onclick="TLPages.viewFADetail('${f.id}')"><i class="fa-solid fa-eye"></i> View</button>
                  <button class="btn btn-ghost btn-sm" style="color:var(--danger)" title="Remove advisor" onclick="TLPages.deleteFA('${f.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },

  initFAProfiles() {
    const fas = Data.users.filter(x=>x.role==='fa');
    const scores = fas.map(f=>TLPages._workloadScore(f.id));
    const colors = scores.map(s=>s<=2?'#22C55E':s<=4?'#F59E0B':'#EF4444');
    const ctx = document.getElementById('workloadChart');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: fas.map(f=>f.name),
        datasets: [{ label:'Workload Score', data:scores, backgroundColor:colors, borderRadius:6, borderSkipped:false }]
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:(ctx)=>`Score: ${ctx.raw} (${ctx.raw<=2?'Low':ctx.raw<=4?'Medium':'High'})` } } },
        scales:{
          y:{ beginAtZero:true, max:9, grid:{color:'rgba(0,0,0,0.05)'}, ticks:{color:'#888',stepSize:3,callback:v=>v===0?'':v<=3?'Low':v<=6?'Med':'High'} },
          x:{ grid:{display:false}, ticks:{color:'#888'} }
        }
      }
    });
  },

  viewFADetail(id) {
    const f = Data.users.find(x=>x.id===id);
    const faCases = Data.cases.filter(c=>c.faId===id);
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">FA Profile — ${f?.name}</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div style="display:flex;gap:12px;align-items:center;padding-bottom:14px;border-bottom:1px solid var(--border)">
            <div class="profile-avatar-lg" style="width:56px;height:56px;font-size:20px">${f?.initials}</div>
            <div>
              <div style="font-size:16px;font-weight:700">${f?.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${f?.email} · ${f?.phone}</div>
              <div style="font-size:12px;color:var(--text-muted)">Specialty: ${f?.specialty}</div>
            </div>
          </div>
          <div style="display:flex;gap:12px;text-align:center">
            ${[['Cases',faCases.length],['Active',faCases.filter(c=>c.status==='active').length],['Closed',faCases.filter(c=>c.status==='closed').length],['Rating',f?.rating]].map(([l,v])=>`
            <div style="flex:1;padding:10px;background:var(--surface-2);border-radius:8px">
              <div style="font-size:18px;font-weight:700">${v}</div>
              <div style="font-size:11px;color:var(--text-muted)">${l}</div>
            </div>`).join('')}
          </div>
          <div>
            <div style="font-size:13px;font-weight:600;margin-bottom:8px">Current Cases</div>
            ${faCases.filter(c=>c.status==='active').map(c=>`
            <div style="padding:8px;background:var(--surface-2);border-radius:6px;margin-bottom:6px;display:flex;justify-content:space-between">
              <div style="font-size:13px;font-weight:500">${c.title}</div>
              <span class="badge ${c.priority==='high'?'badge-danger':c.priority==='medium'?'badge-warning':'badge-success'}">${c.priority}</span>
            </div>`).join('')||'<div style="color:var(--text-muted);font-size:13px">No active cases</div>'}
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" style="flex:1" onclick="TLPages.assignCaseModal();App.closeModal()"><i class="fa-solid fa-plus"></i> Assign Case</button>
            <button class="btn btn-secondary" style="flex:1" onclick="App.navigate('tl-messages');App.closeModal()"><i class="fa-solid fa-message"></i> Message</button>
            <button class="btn btn-danger btn-sm" onclick="App.closeModal();TLPages.deleteFA('${id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>`);
  },

  renderMessages() {
    const u = App.state.user;
    const fas = Data.users.filter(x=>x.role==='fa');
    const firstId = fas[0]?.id;
    const msgs = Data.messages.filter(m=>(m.from===u.id&&m.to===firstId)||(m.from===firstId&&m.to===u.id));
    return `
    <div class="app-layout">
      ${App.buildSidebar('teamleader','tl-messages')}
      <div class="main-content">
        ${App.buildHeader('Messages','Team communications')}
        <div class="page-content">
          <div class="messaging-layout" id="messaging-layout">
            <div class="msg-sidebar">
              <div class="msg-sidebar-header">Team</div>
              <div class="msg-list">
                ${fas.map((f,i)=>{
                  const lastMsg = Data.messages.filter(m=>m.from===f.id||m.to===f.id).slice(-1)[0];
                  return `
                  <div class="msg-contact${i===0?' active':''}" data-id="${f.id}" onclick="TLPages.selectContact('${f.id}')">
                    <div class="msg-contact-avatar" style="background:${f.color}">${f.initials}</div>
                    <div style="flex:1;min-width:0">
                      <div style="display:flex;justify-content:space-between;align-items:center">
                        <div class="msg-contact-name">${f.name}</div>
                        ${i===0?'<span class="msg-unread">1</span>':''}
                      </div>
                      <div class="msg-contact-preview">${lastMsg?lastMsg.text.slice(0,35)+'…':'No messages yet'}</div>
                    </div>
                  </div>`;
                }).join('')}
              </div>
            </div>
            <div class="msg-main">
              <div class="msg-header">
                <div style="display:flex;align-items:center;gap:6px">
                  <button class="btn btn-ghost btn-icon msg-back-btn" onclick="App.msgBack()" title="Back"><i class="fa-solid fa-chevron-left"></i></button>
                  <div class="msg-contact-avatar msg-chat-avatar" style="background:${fas[0]?.color};width:38px;height:38px;font-size:15px">${fas[0]?.initials}</div>
                  <div>
                    <div class="msg-chat-name" style="font-weight:600">${fas[0]?.name}</div>
                    <div class="msg-chat-status" style="font-size:12px;color:var(--text-muted)">Financial Advisor</div>
                  </div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="TLPages.assignCaseModal()"><i class="fa-solid fa-folder-plus"></i> Assign Case</button>
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
                <input class="msg-input" id="msg-input" placeholder="Message advisor…" onkeydown="if(event.key==='Enter')TLPages.sendMsg()">
                <button class="btn btn-primary btn-icon" onclick="TLPages.sendMsg()"><i class="fa-solid fa-paper-plane"></i></button>
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
    const fas = Data.users.filter(x=>x.role==='fa');
    const f = fas.find(x=>x.id===id);
    if (!f) return;
    document.querySelectorAll('.msg-contact').forEach(el=>el.classList.toggle('active', el.dataset.id===id));
    const avatar = document.querySelector('.msg-chat-avatar');
    if (avatar) { avatar.style.background = f.color; avatar.textContent = f.initials; }
    const nameEl = document.querySelector('.msg-chat-name');
    if (nameEl) nameEl.textContent = f.name;
    const statusEl = document.querySelector('.msg-chat-status');
    if (statusEl) statusEl.textContent = 'Financial Advisor';
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

  deleteFA(id) {
    const f = Data.users.find(x=>x.id===id);
    if (!f) return;
    const clients = Data.users.filter(x=>x.role==='customer'&&x.faId===id);
    App.openModal(`
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title"><i class="fa-solid fa-trash" style="color:var(--danger);margin-right:8px"></i>Remove Financial Advisor</div>
          <button class="modal-close" id="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="modal-icon-wrap">
            <div class="modal-icon danger"><i class="fa-solid fa-user-minus"></i></div>
            <div class="modal-confirm-text">Remove <strong>${f.name}</strong> from the team? This action cannot be undone.</div>
          </div>
          ${clients.length ? `<div class="alert alert-warning"><i class="fa-solid fa-triangle-exclamation"></i><div class="alert-body">${clients.length} client(s) currently assigned to this advisor will need to be reassigned.</div></div>` : ''}
          <div class="form-group"><label class="form-label">Reason for removal</label><textarea class="form-control" rows="2" id="delete-fa-reason" placeholder="e.g. Resigned, performance review…"></textarea></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button class="btn btn-danger" id="modal-confirm-btn"><i class="fa-solid fa-trash"></i> Remove Advisor</button>
        </div>
      </div>`, () => {
        const idx = Data.users.findIndex(x=>x.id===id);
        if (idx > -1) Data.users.splice(idx, 1);
        App.toast(`${f.name} has been removed from the team`, 'warning');
        App.navigate('tl-fa-profiles');
      });
  },
};
