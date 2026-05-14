/* ===== AUTH PAGES ===== */
const AuthPages = {

  renderLogin() {
    return `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="auth-brand-logo"><img src="assets/logo.svg" style="width:28px;height:28px;filter:brightness(0) invert(1);"></div>
          <div class="auth-brand-name">Codeherence</div>
        </div>
        <div class="auth-tagline">
          <h2>Banking built<br>around you.</h2>
          <p>Secure, transparent, and intelligent financial services for individuals and advisors.</p>
        </div>
        <div class="auth-features">
          <div class="auth-feature"><div class="auth-feature-icon"><i class="fa-solid fa-shield-halved"></i></div><div class="auth-feature-text">Biometric & multi-factor authentication</div></div>
          <div class="auth-feature"><div class="auth-feature-icon"><i class="fa-solid fa-chart-line"></i></div><div class="auth-feature-text">Real-time financial insights & budgeting</div></div>
          <div class="auth-feature"><div class="auth-feature-icon"><i class="fa-solid fa-lock"></i></div><div class="auth-feature-text">Bank-grade encryption on every transaction</div></div>
          <div class="auth-feature"><div class="auth-feature-icon"><i class="fa-solid fa-headset"></i></div><div class="auth-feature-text">Direct messaging with your Financial Advisor</div></div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-form-wrap">
          <div class="auth-form-title">Welcome back</div>
          <div class="auth-form-subtitle">Sign in to your Codeherence account</div>

          <div class="auth-form">
            <div class="form-group">
              <label class="form-label">Sign in as</label>
              <div class="role-selector">
                <div class="role-btn active" id="role-customer" onclick="AuthPages.selectRole('customer')">
                  <i class="fa-solid fa-user" style="color:#0066FF"></i>
                  <span>Customer</span>
                </div>
                <div class="role-btn" id="role-fa" onclick="AuthPages.selectRole('fa')">
                  <i class="fa-solid fa-briefcase" style="color:#F59E0B"></i>
                  <span>Advisor</span>
                </div>
                <div class="role-btn" id="role-teamleader" onclick="AuthPages.selectRole('teamleader')">
                  <i class="fa-solid fa-users-gear" style="color:#8B5CF6"></i>
                  <span>Team Lead</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email address</label>
              <div class="input-icon-wrap">
                <i class="input-icon fa-solid fa-envelope"></i>
                <input id="login-email" class="form-control" type="email" placeholder="your@email.com" value="sarah@email.com">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-icon-wrap">
                <i class="input-icon fa-solid fa-lock"></i>
                <input id="login-password" class="form-control" type="password" placeholder="••••••••" value="password">
                <i class="input-icon-right fa-solid fa-eye" id="togglePwd" onclick="AuthPages.togglePwd()"></i>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin:-4px 0">
              <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer">
                <input type="checkbox" checked style="accent-color:var(--accent)"> Remember me
              </label>
              <a href="#" style="font-size:13px;color:var(--accent);font-weight:500" onclick="event.preventDefault();App.navigate('forgot-password')">Forgot password?</a>
            </div>

            <button class="btn btn-primary btn-full btn-lg" onclick="AuthPages.doLogin()">
              <i class="fa-solid fa-right-to-bracket"></i> Sign In
            </button>

            <div class="alert alert-info" style="margin-top:4px">
              <i class="fa-solid fa-circle-info"></i>
              <div class="alert-body" style="font-size:12px"><strong>Demo:</strong> Select a role above and click Sign In. Any email/password works.</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  selectRole(role) {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('role-' + role).classList.add('active');
    App.state.pendingRole = role;
    const emails = { customer:'sarah@email.com', fa:'david@codeherence.com', teamleader:'robert@codeherence.com' };
    document.getElementById('login-email').value = emails[role];
  },

  togglePwd() {
    const p = document.getElementById('login-password');
    const i = document.getElementById('togglePwd');
    if (p.type === 'password') { p.type = 'text'; i.className = 'input-icon-right fa-solid fa-eye-slash'; }
    else { p.type = 'password'; i.className = 'input-icon-right fa-solid fa-eye'; }
  },

  doLogin() {
    const email = document.getElementById('login-email').value.trim();
    const pwd = document.getElementById('login-password').value;
    if (!email || !pwd) { App.toast('Please enter your email and password', 'error'); return; }
    const role = App.state.pendingRole || 'customer';
    App.state.pendingRole = role;
    App.navigate('2fa');
  },

  render2FA() {
    return `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="auth-brand-logo"><img src="assets/logo.svg" style="width:28px;height:28px;filter:brightness(0) invert(1);"></div>
          <div class="auth-brand-name">Codeherence</div>
        </div>
        <div class="auth-tagline">
          <h2>Two-Factor Authentication</h2>
          <p>An extra layer of security keeps your account protected from unauthorised access.</p>
        </div>
        <div class="auth-features">
          <div class="auth-feature"><div class="auth-feature-icon"><i class="fa-solid fa-fingerprint"></i></div><div class="auth-feature-text">Biometric — fastest &amp; most secure</div></div>
          <div class="auth-feature"><div class="auth-feature-icon"><i class="fa-solid fa-envelope"></i></div><div class="auth-feature-text">Email — code sent to your address</div></div>
          <div class="auth-feature"><div class="auth-feature-icon"><i class="fa-solid fa-mobile-screen"></i></div><div class="auth-feature-text">SMS — text message to your phone</div></div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-form-wrap">
          <div style="margin-bottom:6px">
            <button class="btn btn-ghost btn-sm" onclick="App.navigate('login')">
              <i class="fa-solid fa-arrow-left"></i> Back
            </button>
          </div>
          <div class="auth-form-title">Verify your identity</div>
          <div class="auth-form-subtitle">Choose a verification method to continue</div>

          <div style="margin-top:24px;display:flex;flex-direction:column;gap:20px">
            <div>
              <label class="form-label" style="margin-bottom:8px">Verification method</label>
              <div class="twofa-methods">
                <div class="method-btn active" id="m-biometric" onclick="AuthPages.select2FA('biometric')">
                  <i class="fa-solid fa-fingerprint"></i><span>Biometric</span>
                </div>
                <div class="method-btn" id="m-email" onclick="AuthPages.select2FA('email')">
                  <i class="fa-solid fa-envelope"></i><span>Email Code</span>
                </div>
                <div class="method-btn" id="m-sms" onclick="AuthPages.select2FA('sms')">
                  <i class="fa-solid fa-mobile-screen"></i><span>SMS Code</span>
                </div>
              </div>
            </div>

            <div id="twofa-content">
              ${AuthPages.build2FAContent('biometric')}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  build2FAContent(method) {
    if (method === 'biometric') {
      return `
        <div class="biometric-prompt">
          <div class="biometric-icon"><i class="fa-solid fa-fingerprint"></i></div>
          <div class="biometric-status">
            <div style="font-size:15px;font-weight:600;margin-bottom:8px">Place your finger on the sensor</div>
            <div class="biometric-scanning">
              <span class="scan-dot"></span><span class="scan-dot"></span><span class="scan-dot"></span>
              <span style="margin-left:6px">Scanning…</span>
            </div>
          </div>
          <div style="margin-top:20px;color:var(--text-muted);font-size:12px">or</div>
          <button class="btn btn-primary btn-lg" style="margin-top:12px" onclick="AuthPages.completeBiometric()">
            <i class="fa-solid fa-face-viewfinder"></i> Use Face ID instead
          </button>
          <div style="margin-top:16px">
            <button class="btn btn-ghost btn-sm" onclick="AuthPages.completeBiometric()">
              <i class="fa-solid fa-circle-check" style="color:var(--success)"></i> Simulate scan approved
            </button>
          </div>
        </div>`;
    }
    const isEmail = method === 'email';
    const dest = isEmail ? 's****@email.com' : '+44 **** *** 123';
    const code = isEmail ? '483920' : '716254';
    return `
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="alert alert-info">
          <i class="fa-solid fa-circle-info"></i>
          <div class="alert-body">
            <div class="alert-title">Code sent</div>
            A 6-digit code was sent to <strong>${dest}</strong>. Demo code: <strong>${code}</strong>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Enter the 6-digit code</label>
          <div class="otp-input-wrap" id="otp-wrap">
            ${[0,1,2,3,4,5].map(i=>`<input class="otp-digit" maxlength="1" id="otp${i}" oninput="AuthPages.otpInput(${i})" onkeydown="AuthPages.otpKey(event,${i})">`).join('')}
          </div>
        </div>
        <button class="btn btn-primary btn-full btn-lg" onclick="AuthPages.verifyOTP('${code}')">
          <i class="fa-solid fa-check-circle"></i> Verify Code
        </button>
        <div style="text-align:center">
          <a href="#" style="font-size:13px;color:var(--accent)" onclick="event.preventDefault();App.toast('Code resent!','success')">
            <i class="fa-solid fa-rotate-right"></i> Resend code
          </a>
        </div>
      </div>`;
  },

  select2FA(method) {
    App.state.twoFAMethod = method;
    document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('m-' + method).classList.add('active');
    document.getElementById('twofa-content').innerHTML = AuthPages.build2FAContent(method);
    if (method !== 'biometric') {
      setTimeout(() => { const f = document.getElementById('otp0'); if(f) f.focus(); }, 100);
    }
  },

  completeBiometric() {
    App.toast('Biometric verified successfully!', 'success');
    setTimeout(() => { AuthPages.completeLogin(); }, 800);
  },

  otpInput(i) {
    const val = document.getElementById('otp' + i).value;
    if (val && i < 5) document.getElementById('otp' + (i+1)).focus();
  },

  otpKey(e, i) {
    if (e.key === 'Backspace' && !document.getElementById('otp' + i).value && i > 0) {
      document.getElementById('otp' + (i-1)).focus();
    }
    if (e.key === 'Enter') AuthPages.verifyOTP(App.state.twoFAMethod === 'email' ? '483920' : '716254');
  },

  verifyOTP(expected) {
    const entered = [0,1,2,3,4,5].map(i => document.getElementById('otp'+i)?.value || '').join('');
    if (entered === expected) {
      App.toast('Code verified!', 'success');
      setTimeout(() => AuthPages.completeLogin(), 600);
    } else if (entered.length < 6) {
      App.toast('Please enter all 6 digits', 'error');
    } else {
      App.toast('Incorrect code. Please try again.', 'error');
      [0,1,2,3,4,5].forEach(i => { const el = document.getElementById('otp'+i); if(el) el.value=''; });
      document.getElementById('otp0').focus();
    }
  },

  completeLogin() {
    const role = App.state.pendingRole || 'customer';
    App.login(role);
    App.goHome();
  },

  renderForgotPassword() {
    let step = App.state.fpStep || 1;
    const steps = ['Find Account','Verify','Reset'];
    const stepDots = steps.map((s,i) => {
      const n = i+1;
      const cls = n < step ? 'done' : n === step ? 'active' : '';
      const icon = n < step ? '<i class="fa-solid fa-check"></i>' : n;
      return `${i>0?`<div class="step-line${n<=step?' done':''}"></div>`:''}
        <div class="step-dot ${cls}" title="${s}">${icon}</div>`;
    }).join('');

    let content = '';
    if (step === 1) {
      content = `
        <div class="auth-form-title">Forgot Password</div>
        <div class="auth-form-subtitle">Enter the email address on your account</div>
        <div class="auth-form">
          <div class="step-indicator">${stepDots}</div>
          <div class="form-group">
            <label class="form-label">Email address</label>
            <div class="input-icon-wrap">
              <i class="input-icon fa-solid fa-envelope"></i>
              <input id="fp-email" class="form-control" type="email" placeholder="your@email.com">
            </div>
          </div>
          <button class="btn btn-primary btn-full btn-lg" onclick="AuthPages.fpStep1()">
            <i class="fa-solid fa-paper-plane"></i> Send Reset Code
          </button>
          <div style="text-align:center">
            <a href="#" style="font-size:13px;color:var(--accent)" onclick="event.preventDefault();App.navigate('login')">Back to Sign In</a>
          </div>
        </div>`;
    } else if (step === 2) {
      content = `
        <div class="auth-form-title">Check Your Email</div>
        <div class="auth-form-subtitle">Enter the 6-digit code we sent you. Demo code: <strong>123456</strong></div>
        <div class="auth-form">
          <div class="step-indicator">${stepDots}</div>
          <div class="form-group">
            <label class="form-label">Verification code</label>
            <div class="otp-input-wrap">
              ${[0,1,2,3,4,5].map(i=>`<input class="otp-digit" maxlength="1" id="fpotp${i}" oninput="AuthPages.fpOtpInput(${i})" onkeydown="AuthPages.fpOtpKey(event,${i})">`).join('')}
            </div>
          </div>
          <button class="btn btn-primary btn-full btn-lg" onclick="AuthPages.fpStep2()">
            <i class="fa-solid fa-check"></i> Verify Code
          </button>
          <div style="text-align:center">
            <a href="#" style="font-size:13px;color:var(--accent)" onclick="event.preventDefault();App.toast('Code resent!','success')">Resend code</a>
          </div>
        </div>`;
    } else {
      content = `
        <div class="auth-form-title">Create New Password</div>
        <div class="auth-form-subtitle">Your new password must be at least 8 characters</div>
        <div class="auth-form">
          <div class="step-indicator">${stepDots}</div>
          <div class="form-group">
            <label class="form-label">New password</label>
            <div class="input-icon-wrap">
              <i class="input-icon fa-solid fa-lock"></i>
              <input id="fp-pwd1" class="form-control" type="password" placeholder="New password" oninput="AuthPages.checkPwdStrength()">
            </div>
            <div id="pwd-strength" style="height:4px;background:var(--border);border-radius:2px;margin-top:6px;overflow:hidden">
              <div id="pwd-strength-bar" style="height:100%;width:0;border-radius:2px;transition:all 0.3s"></div>
            </div>
            <div id="pwd-strength-label" class="form-hint" style="margin-top:2px"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm new password</label>
            <div class="input-icon-wrap">
              <i class="input-icon fa-solid fa-lock"></i>
              <input id="fp-pwd2" class="form-control" type="password" placeholder="Confirm password">
            </div>
          </div>
          <button class="btn btn-success btn-full btn-lg" onclick="AuthPages.fpStep3()">
            <i class="fa-solid fa-check-circle"></i> Reset Password
          </button>
        </div>`;
    }
    return `
      <div class="auth-page">
        <div class="auth-left">
          <div class="auth-brand"><div class="auth-brand-logo"><img src="assets/logo.svg" style="width:28px;height:28px;filter:brightness(0) invert(1);"></div><div class="auth-brand-name">Codeherence</div></div>
          <div class="auth-tagline">
            <h2>Account Recovery</h2>
            <p>We'll help you get back into your account quickly and securely.</p>
          </div>
          <div class="auth-features">
            <div class="auth-feature"><div class="auth-feature-icon"><i class="fa-solid fa-envelope-circle-check"></i></div><div class="auth-feature-text">Verify via email or SMS</div></div>
            <div class="auth-feature"><div class="auth-feature-icon"><i class="fa-solid fa-rotate"></i></div><div class="auth-feature-text">Secure, instant password reset</div></div>
            <div class="auth-feature"><div class="auth-feature-icon"><i class="fa-solid fa-shield-halved"></i></div><div class="auth-feature-text">Previous sessions automatically signed out</div></div>
          </div>
        </div>
        <div class="auth-right">
          <div class="auth-form-wrap">${content}</div>
        </div>
      </div>`;
  },

  fpStep1() {
    const e = document.getElementById('fp-email').value.trim();
    if (!e || !e.includes('@')) { App.toast('Please enter a valid email address', 'error'); return; }
    App.state.fpEmail = e;
    App.state.fpStep = 2;
    App.navigate('forgot-password');
    App.toast('Verification code sent to ' + e, 'success');
    setTimeout(() => { document.getElementById('fpotp0')?.focus(); }, 100);
  },

  fpOtpInput(i) {
    const val = document.getElementById('fpotp' + i).value;
    if (val && i < 5) document.getElementById('fpotp' + (i+1)).focus();
  },

  fpOtpKey(e, i) {
    if (e.key === 'Backspace' && !document.getElementById('fpotp'+i).value && i > 0)
      document.getElementById('fpotp'+(i-1)).focus();
  },

  fpStep2() {
    const entered = [0,1,2,3,4,5].map(i => document.getElementById('fpotp'+i)?.value||'').join('');
    if (entered === '123456') {
      App.state.fpStep = 3;
      App.navigate('forgot-password');
    } else {
      App.toast('Incorrect code. Demo code is 123456', 'error');
    }
  },

  checkPwdStrength() {
    const val = document.getElementById('fp-pwd1').value;
    const bar = document.getElementById('pwd-strength-bar');
    const lbl = document.getElementById('pwd-strength-label');
    const score = [val.length>=8, /[A-Z]/.test(val), /[0-9]/.test(val), /[^a-zA-Z0-9]/.test(val)].filter(Boolean).length;
    const opts = [{w:'20%',c:'#EF4444',l:'Too weak'},{w:'40%',c:'#F59E0B',l:'Weak'},{w:'70%',c:'#F59E0B',l:'Fair'},{w:'100%',c:'#22C55E',l:'Strong'}];
    const o = opts[Math.min(score,3)] || opts[0];
    bar.style.width = o.w; bar.style.background = o.c; lbl.textContent = o.l; lbl.style.color = o.c;
  },

  fpStep3() {
    const p1 = document.getElementById('fp-pwd1').value;
    const p2 = document.getElementById('fp-pwd2').value;
    if (p1.length < 8) { App.toast('Password must be at least 8 characters', 'error'); return; }
    if (p1 !== p2) { App.toast('Passwords do not match', 'error'); return; }
    App.state.fpStep = 1;
    App.toast('Password reset successfully! Please sign in.', 'success', 4000);
    App.navigate('login');
  },
};
