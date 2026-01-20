// ===== TG PWA - Shared App Helpers =====
(() => {
  window.$ = (id) => document.getElementById(id);

  // ----- PWA SW register -----
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // ----- Optional install prompt -----
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = $('installBtn');
    if (btn) btn.classList.remove('hidden');
  });

  window.TGApp = {
    state: {
      apiBaseI: 'http://192.168.12.102/api/tp/online', // <-- apibase internal
      apiBaseE: 'http://tgjblad.dyndns.org:1975/api/tp/online', // <-- apibase external
      apiBase: null,
      apiMode: null,
      apiModeKey: 'tg_api_mode',
      apiBasePromise: null,
      themeKey: 'tg_theme',
      token: () => localStorage.getItem('userToken') || '',
    },

    toast(msg, type = 'info') {
      const el = $('toast');
      if (!el) return alert(msg);

      const colors = {
        info:  'border-slate-200 bg-white text-slate-800',
        ok:    'border-emerald-200 bg-emerald-50 text-emerald-900',
        warn:  'border-amber-200 bg-amber-50 text-amber-900',
        err:   'border-rose-200 bg-rose-50 text-rose-900'
      };

      el.className = `fixed left-1/2 -translate-x-1/2 bottom-6 z-50 max-w-[92vw] w-[520px] rounded-2xl border p-3 text-sm font-semibold shadow-xl ${colors[type] || colors.info}`;
      el.textContent = msg;
      el.classList.remove('hidden');

      clearTimeout(el.__t);
      el.__t = setTimeout(() => el.classList.add('hidden'), 2200);
    },

    ensureThemeStyles() {
      if (document.getElementById('tgThemeStyles')) return;
      const style = document.createElement('style');
      style.id = 'tgThemeStyles';
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        :root {
          color-scheme: light;
          --tg-bg: #f5f7f5;
          --tg-panel: #ffffff;
          --tg-text: #0b1220;
          --tg-muted: #5a6b60;
          --tg-border: #d9e2db;
          --tg-soft: #f0f4f1;
          --tg-hover: #e6ece8;
          --tg-accent: #1b7f45;
          --tg-accent-strong: #156437;
          --tg-chip-emerald-bg: #e7f2ec;
          --tg-chip-emerald-fg: #1b7f45;
          --tg-chip-blue-bg: #e8eef6;
          --tg-chip-blue-fg: #1e4f8f;
          --tg-chip-amber-bg: #f4eddc;
          --tg-chip-amber-fg: #a45f0e;
          --tg-chip-purple-bg: #efeaf3;
          --tg-chip-purple-fg: #4e3a89;
          --tg-chip-cyan-bg: #e4f1f4;
          --tg-chip-cyan-fg: #0c6b78;
          --tg-chip-rose-bg: #f3e6e6;
          --tg-chip-rose-fg: #a23d44;
          --tg-active-card: #e4f3ea;
        }
        html[data-theme="dark"] {
          color-scheme: dark;
          --tg-bg: #121821;
          --tg-panel: #171f29;
          --tg-text: #e6edf3;
          --tg-muted: #9aa7b4;
          --tg-border: #27303a;
          --tg-soft: #141c25;
          --tg-hover: #1f2a36;
          --tg-accent: #22c06a;
          --tg-accent-strong: #1a9a56;
          --tg-chip-emerald-bg: #0f2a1e;
          --tg-chip-emerald-fg: #22c06a;
          --tg-chip-blue-bg: #121f33;
          --tg-chip-blue-fg: #6ea6ff;
          --tg-chip-amber-bg: #2a2012;
          --tg-chip-amber-fg: #f0b34d;
          --tg-chip-purple-bg: #211a33;
          --tg-chip-purple-fg: #c2b3ff;
          --tg-chip-cyan-bg: #11242c;
          --tg-chip-cyan-fg: #3bc2cf;
          --tg-chip-rose-bg: #2a1517;
          --tg-chip-rose-fg: #ee868f;
          --tg-active-card: #1b2a25;
        }
        body { background: var(--tg-bg) !important; color: var(--tg-text); }
        body, button, input, select, textarea {
          font-family: 'Manrope', 'Segoe UI', Tahoma, sans-serif;
        }
        body {
          opacity: 0;
          transition: opacity 160ms ease-out;
        }
        body.tg-ready {
          opacity: 1;
        }
        .bg-white { background-color: var(--tg-panel) !important; }
        .bg-slate-50 { background-color: var(--tg-soft) !important; }
        .border-slate-200, .border-slate-100 { border-color: var(--tg-border) !important; }
        .text-slate-900, .text-slate-800, .text-slate-700 { color: var(--tg-text) !important; }
        .text-slate-600, .text-slate-500, .text-slate-400 { color: var(--tg-muted) !important; }
        .hover\\:bg-slate-50:hover { background-color: var(--tg-hover) !important; }
        .hover\\:bg-slate-100:hover { background-color: var(--tg-hover) !important; }
        .tile-shadow,
        .shadow,
        .shadow-lg,
        .shadow-xl,
        .shadow-2xl {
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.12) !important;
        }
        .focus\\:border-blue-500:focus { border-color: var(--tg-accent) !important; }
        .focus\\:ring-blue-500\\/15:focus {
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--tg-accent) 20%, transparent) !important;
        }
        .tg-chip-emerald { background: var(--tg-chip-emerald-bg) !important; color: var(--tg-chip-emerald-fg) !important; border-color: color-mix(in srgb, var(--tg-chip-emerald-fg) 28%, var(--tg-border)) !important; }
        .tg-chip-blue { background: var(--tg-chip-blue-bg) !important; color: var(--tg-chip-blue-fg) !important; border-color: color-mix(in srgb, var(--tg-chip-blue-fg) 28%, var(--tg-border)) !important; }
        .tg-chip-amber { background: var(--tg-chip-amber-bg) !important; color: var(--tg-chip-amber-fg) !important; border-color: color-mix(in srgb, var(--tg-chip-amber-fg) 28%, var(--tg-border)) !important; }
        .tg-chip-purple { background: var(--tg-chip-purple-bg) !important; color: var(--tg-chip-purple-fg) !important; border-color: color-mix(in srgb, var(--tg-chip-purple-fg) 28%, var(--tg-border)) !important; }
        .tg-chip-cyan { background: var(--tg-chip-cyan-bg) !important; color: var(--tg-chip-cyan-fg) !important; border-color: color-mix(in srgb, var(--tg-chip-cyan-fg) 28%, var(--tg-border)) !important; }
        .tg-chip-rose { background: var(--tg-chip-rose-bg) !important; color: var(--tg-chip-rose-fg) !important; border-color: color-mix(in srgb, var(--tg-chip-rose-fg) 28%, var(--tg-border)) !important; }
        .tg-active-card { background: var(--tg-active-card) !important; }
        .tg-menu-icon {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: 1px solid transparent;
          font-size: 12px;
          font-weight: 800;
          line-height: 1;
        }
        html[data-theme="dark"] .bg-white {
          background-image: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
          box-shadow: 0 14px 30px rgba(2, 6, 23, 0.6);
        }
        html[data-theme="dark"] .bg-\\[\\#d9ecff\\],
        html[data-theme="dark"] .bg-blue-50,
        html[data-theme="dark"] .bg-emerald-50,
        html[data-theme="dark"] .bg-amber-50,
        html[data-theme="dark"] .bg-rose-50 {
          background-color: #16223a !important;
        }
        html[data-theme="dark"] .bg-\\[\\#fbf2f4\\] {
          background-color: var(--tg-bg) !important;
        }
        html[data-theme="dark"] .text-emerald-900,
        html[data-theme="dark"] .text-amber-900,
        html[data-theme="dark"] .text-rose-900 {
          color: #e2e8f0 !important;
        }
        html[data-theme="dark"] .text-blue-700,
        html[data-theme="dark"] .text-blue-600 {
          color: var(--tg-accent) !important;
        }
        html[data-theme="dark"] .border-blue-200,
        html[data-theme="dark"] .border-emerald-200,
        html[data-theme="dark"] .border-amber-200,
        html[data-theme="dark"] .border-rose-200 {
          border-color: var(--tg-border) !important;
        }
        .bg-blue-600 { background-color: var(--tg-accent) !important; }
        .bg-blue-700 { background-color: var(--tg-accent-strong) !important; }
        .text-blue-600, .text-blue-700 { color: var(--tg-accent) !important; }
        .border-blue-200 { border-color: color-mix(in srgb, var(--tg-accent) 30%, var(--tg-border)) !important; }
        html[data-theme="dark"] .tile-shadow,
        html[data-theme="dark"] .shadow,
        html[data-theme="dark"] .shadow-lg,
        html[data-theme="dark"] .shadow-xl,
        html[data-theme="dark"] .shadow-2xl {
          box-shadow: 0 10px 24px rgba(2, 6, 23, 0.55) !important;
        }
        html[data-theme="dark"] .rounded-2xl,
        html[data-theme="dark"] .rounded-3xl,
        html[data-theme="dark"] .rounded-\\[28px\\] {
          outline: 1px solid rgba(148, 163, 184, 0.18);
          outline-offset: -1px;
        }
        .tg-theme-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 36px;
          padding: 0 10px;
          border-radius: 12px;
          border: 1px solid var(--tg-border);
          background: var(--tg-panel);
          color: var(--tg-text);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
        }
        .tg-theme-toggle svg { width: 16px; height: 16px; }
        .tg-theme-toggle .tg-theme-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
      `;
      document.head.appendChild(style);
    },

    getTheme() {
      return localStorage.getItem(this.state.themeKey) || 'light';
    },

    applyTheme(theme) {
      const value = (theme === 'dark') ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', value);
      localStorage.setItem(this.state.themeKey, value);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', value === 'dark' ? '#0b3d1f' : '#16a34a');
      this.updateThemeToggleLabels();
    },

    toggleTheme() {
      const next = this.getTheme() === 'dark' ? 'light' : 'dark';
      this.applyTheme(next);
    },

    initTheme() {
      this.ensureThemeStyles();
      this.applyTheme(this.getTheme());
    },

    updateThemeToggleLabels() {
      const nextLabel = this.getTheme() === 'dark' ? 'Light' : 'Dark';
      const icon = nextLabel === 'Light'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.5a8.5 8.5 0 1 1-9.5-9.5 7 7 0 0 0 9.5 9.5z"></path></svg>';
      document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
        btn.innerHTML = `${icon}<span class="tg-theme-label">${nextLabel}</span>`;
        btn.setAttribute('aria-label', `Switch to ${nextLabel} mode`);
        btn.setAttribute('title', `Switch to ${nextLabel} mode`);
      });
    },

    initThemeUI() {
      const makeButton = () => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tg-theme-toggle';
        btn.setAttribute('data-theme-toggle', '1');
        btn.addEventListener('click', () => this.toggleTheme());
        return btn;
      };

      const installs = document.querySelectorAll('#installBtn');
      if (installs.length) {
        installs.forEach(installBtn => {
          const parent = installBtn.parentElement;
          if (!parent || parent.querySelector('[data-theme-toggle]')) return;
          const btn = makeButton();
          if (installBtn.classList.contains('ml-auto')) btn.classList.add('ml-auto');
          parent.insertBefore(btn, installBtn);
        });
      } else if (!document.querySelector('[data-theme-toggle]')) {
        const btn = makeButton();
        btn.classList.add('fixed', 'bottom-5', 'right-5', 'z-40', 'shadow-lg');
        document.body.appendChild(btn);
      }

      this.updateThemeToggleLabels();
    },

        ensureShell() {
      const shellHost = document.getElementById('tgShell');
      const page = document.getElementById('tgPage');
      if (!shellHost || !page) return;

      const shellHtml = `
        <div id="drawerBackdrop" class="hidden fixed inset-0 bg-black/35 z-30"></div>
        <aside id="drawer" class="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-40 -translate-x-full transition-transform duration-200 tile-shadow overflow-y-auto">
          <div class="p-4 border-b">
            <div class="flex items-center justify-between">
              <div class="font-extrabold tracking-[0.14em] text-slate-800">TRANSGULF</div>
              <button id="btnCloseDrawer" class="w-10 h-10 rounded-xl hover:bg-slate-100">X</button>
            </div>
            <div class="mt-2 text-xs text-slate-500 font-bold" id="hdrMeta">-</div>
            <div class="text-sm font-extrabold text-slate-800" id="hdrUser">User</div>
          </div>
          <nav class="p-3 space-y-2">
            <a href="dashboard.html" data-nav="dashboard" class="w-full flex items-center gap-3 px-4 h-11 rounded-2xl font-extrabold text-slate-700 hover:bg-slate-100">
              <span class="tg-menu-icon tg-chip-blue"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M9 12l2 2 4-4"/></svg></span><span>Dashboard</span>
            </a>
            <a href="new-order.html" data-nav="neworder" class="w-full flex items-center gap-3 px-4 h-11 rounded-2xl font-extrabold text-slate-700 hover:bg-slate-100">
              <span class="tg-menu-icon tg-chip-emerald"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span><span>New Order</span>
            </a>
            <a href="orders.html" data-nav="orders" class="w-full flex items-center gap-3 px-4 h-11 rounded-2xl font-extrabold text-slate-700 hover:bg-slate-100">
              <span class="tg-menu-icon tg-chip-amber"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg></span><span>Orders</span>
            </a>
            <a href="calculator.html" data-nav="calculator" class="w-full flex items-center gap-3 px-4 h-11 rounded-2xl font-extrabold text-slate-700 hover:bg-slate-100">
              <span class="tg-menu-icon tg-chip-cyan"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h2M8 15h2M12 15h2M16 15h2"/></svg></span><span>Calculator</span>
            </a>
            <a href="profile.html" data-nav="profile" class="w-full flex items-center gap-3 px-4 h-11 rounded-2xl font-extrabold text-slate-700 hover:bg-slate-100">
              <span class="tg-menu-icon tg-chip-purple"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/></svg></span><span>Profile</span>
            </a>
          </nav>
          <div class="p-4 border-t mt-auto">
            <button id="btnLogout" class="w-full h-11 rounded-2xl bg-rose-600 text-white font-extrabold">Logout</button>
          </div>
        </aside>

        <div class="flex h-screen overflow-hidden">
          <aside class="hidden md:flex md:w-[270px] bg-white border-r h-screen overflow-y-auto">
            <div class="w-full flex flex-col min-h-full">
              <div class="p-5 border-b">
                <div class="font-extrabold tracking-[0.18em] text-slate-800">TRANSGULF</div>
                <div class="mt-2 text-xs text-slate-500 font-bold" id="hdrMeta">-</div>
                <div class="text-sm font-extrabold text-slate-800" id="hdrUser">User</div>

                <div class="mt-4 flex items-center gap-2">
                  <span id="netDot" class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span id="netText" class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Online</span>
                  <button id="installBtn" class="ml-auto hidden text-xs font-extrabold text-blue-600 hover:text-blue-700">Install</button>
                </div>
              </div>

              <nav class="p-3 space-y-2">
                <a href="dashboard.html" data-nav="dashboard" class="w-full flex items-center gap-3 px-4 h-11 rounded-2xl font-bold text-slate-700 hover:bg-slate-100">
                  <span class="tg-menu-icon tg-chip-blue"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M9 12l2 2 4-4"/></svg></span><span>Dashboard</span>
                </a>
                <a href="new-order.html" data-nav="neworder" class="w-full flex items-center gap-3 px-4 h-11 rounded-2xl font-bold text-slate-700 hover:bg-slate-100">
                  <span class="tg-menu-icon tg-chip-emerald"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span><span>New Order</span>
                </a>
                <a href="orders.html" data-nav="orders" class="w-full flex items-center gap-3 px-4 h-11 rounded-2xl font-bold text-slate-700 hover:bg-slate-100">
                  <span class="tg-menu-icon tg-chip-amber"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg></span><span>Orders</span>
                </a>
                <a href="calculator.html" data-nav="calculator" class="w-full flex items-center gap-3 px-4 h-11 rounded-2xl font-bold text-slate-700 hover:bg-slate-100">
                  <span class="tg-menu-icon tg-chip-cyan"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h2M8 15h2M12 15h2M16 15h2"/></svg></span><span>Calculator</span>
                </a>
                <a href="profile.html" data-nav="profile" class="w-full flex items-center gap-3 px-4 h-11 rounded-2xl font-bold text-slate-700 hover:bg-slate-100">
                  <span class="tg-menu-icon tg-chip-purple"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/></svg></span><span>Profile</span>
                </a>
              </nav>

              <div class="p-4 border-t mt-auto">
                <button id="btnLogout" class="w-full h-11 rounded-2xl bg-rose-600 text-white font-extrabold">Logout</button>
              </div>
            </div>
          </aside>

          <div class="flex-1 min-w-0 h-screen overflow-y-auto">
            <header class="md:hidden sticky top-0 z-20 bg-[#fbf2f4]">
              <div class="px-4 pt-4 pb-3">
                <div class="relative flex items-center justify-between">
                  <button id="btnMenu" class="w-10 h-10 rounded-xl flex items-center justify-center active:scale-95">
                    <span class="text-xs font-extrabold">MENU</span>
                  </button>
                  <div class="absolute left-1/2 -translate-x-1/2 text-center">
                    <div class="text-base font-extrabold tracking-[0.18em] text-slate-800">TRANSGULF</div>
                  </div>
                  <button id="installBtn" class="hidden w-10 h-10 rounded-xl flex items-center justify-center text-xs font-extrabold text-blue-700 border border-blue-200 bg-white">
                    Install
                  </button>
                </div>

                <div class="mt-3 flex items-center gap-2">
                  <span id="netDot" class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span id="netText" class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Online</span>
                  <div class="ml-auto text-xs text-slate-500 font-bold" id="hdrMeta">-</div>
                </div>
              </div>
            </header>

            <div id="tgPageSlot"></div>

            <nav class="md:hidden fixed bottom-3 left-3 right-3 z-20 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
              <div class="grid grid-cols-3 h-14">
                <a href="dashboard.html" data-nav="dashboard" class="flex flex-col items-center justify-center gap-1 text-xs font-bold text-slate-600">
                  <span class="tg-menu-icon tg-chip-blue"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M9 12l2 2 4-4"/></svg></span>
                  <span>Dashboard</span>
                </a>
                <a href="new-order.html" data-nav="neworder" class="flex flex-col items-center justify-center gap-1 text-xs font-bold text-slate-600">
                  <span class="tg-menu-icon tg-chip-emerald"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span>
                  <span>New Order</span>
                </a>
                <a href="orders.html" data-nav="orders" class="flex flex-col items-center justify-center gap-1 text-xs font-bold text-slate-600">
                  <span class="tg-menu-icon tg-chip-amber"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg></span>
                  <span>Orders</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      `;

      const pageNode = page;
      pageNode.remove();
      shellHost.innerHTML = shellHtml;
      const slot = document.getElementById('tgPageSlot');
      slot?.appendChild(pageNode);
      document.body.classList.add('h-screen', 'overflow-hidden');
    },

    setNetworkBadge() {
      const dot = $('netDot');
      const text = $('netText');
      if (!dot || !text) return;

      const online = navigator.onLine;
      dot.className = 'w-2.5 h-2.5 rounded-full ' + (online ? 'bg-emerald-500' : 'bg-rose-500');
      text.textContent = online ? 'Online' : 'Offline';
      text.className = 'text-xs font-extrabold uppercase tracking-wider ' + (online ? 'text-slate-500' : 'text-rose-600');
    },

    guard() {
      const token = localStorage.getItem('userToken');
      if (!token) window.location.href = 'index.html';
    },

    initShell(activeKey) {
      this.guard();
      this.ensureShell();
      document.querySelectorAll('[data-theme-toggle]').forEach((el) => el.remove());
      this.initThemeUI();
      this.setNetworkBadge();

      window.addEventListener('online', () => this.setNetworkBadge());
      window.addEventListener('offline', () => this.setNetworkBadge());

      // active nav highlight
      document.querySelectorAll('[data-nav]').forEach(a => {
        const k = a.getAttribute('data-nav');
        if (k === activeKey) a.classList.add('bg-blue-600', 'text-white', 'shadow');
        else a.classList.remove('bg-blue-600', 'text-white', 'shadow');
      });

      // mobile drawer
      const openBtn = $('btnMenu');
      const closeBtn = $('btnCloseDrawer');
      const backdrop = $('drawerBackdrop');
      const drawer = $('drawer');

      const open = () => {
        backdrop?.classList.remove('hidden');
        drawer?.classList.remove('-translate-x-full');
      };
      const close = () => {
        backdrop?.classList.add('hidden');
        drawer?.classList.add('-translate-x-full');
      };

      openBtn?.addEventListener('click', open);
      closeBtn?.addEventListener('click', close);
      backdrop?.addEventListener('click', close);

      // logout
      document.querySelectorAll('#btnLogout').forEach(btn => {
        btn.addEventListener('click', () => this.logout());
      });

      // install
      const installBtn = $('installBtn');
      if (installBtn) installBtn.classList.remove('hidden');
      installBtn?.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        installBtn.classList.add('hidden');
      });

      // header user
      const nm = localStorage.getItem('userName') || 'User';
      const em = localStorage.getItem('userEmail') || '-';
      const rl = localStorage.getItem('userRole') || 'USER';
      $('hdrUser') && ($('hdrUser').textContent = nm);
      $('hdrMeta') && ($('hdrMeta').textContent = `${em} > ${rl}`);
    },

    logout() {
      ['userToken','userEmail','userName','userRole'].forEach(k => localStorage.removeItem(k));
      window.location.href = 'index.html';
    },

    setBusy(isBusy) {
      const btn = $('btnLogin');
      const txt = $('btnText');
      if (btn) btn.disabled = isBusy;
      if (txt) txt.textContent = isBusy ? 'Signing in...' : 'Login';
    },

    persistRemembered(email) {
      if ($('remember').checked) {
        localStorage.setItem("rememberMe", "1");
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
      }
    },

    loadRemembered() {
      const remember = localStorage.getItem("rememberMe") === "1";
      $('remember').checked = remember;
      const savedEmail = localStorage.getItem("savedEmail") || "";
      if (remember && savedEmail) $('email').value = savedEmail;
    },

    async pingUrl(url, timeoutMs = 1500) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, { method: "GET", cache: "no-store", mode: "cors", signal: controller.signal });
        return res.ok;
      } catch (e) {
        return false;
      } finally {
        clearTimeout(timer);
      }
    },

    async isInternalNetwork() {
      const internalUrl = new URL(this.state.apiBaseI);
      internalUrl.pathname = internalUrl.pathname.replace(/\/$/, '') + '/ping';
      return this.pingUrl(internalUrl.toString());
    },

    async ensureApiBase() {
      if (this.state.apiBase) return this.state.apiBase;
      if (!this.state.apiBasePromise) {
        this.state.apiBasePromise = (async () => {
          const cached = localStorage.getItem(this.state.apiModeKey);
          if (cached === 'internal' || cached === 'external') {
            this.state.apiMode = cached;
            this.state.apiBase = cached === 'internal' ? this.state.apiBaseI : this.state.apiBaseE;
            return this.state.apiBase;
          }

          const internalOk = await this.isInternalNetwork();
          this.state.apiMode = internalOk ? 'internal' : 'external';
          this.state.apiBase = internalOk ? this.state.apiBaseI : this.state.apiBaseE;
          localStorage.setItem(this.state.apiModeKey, this.state.apiMode);
          return this.state.apiBase;
        })();
      }
      return this.state.apiBasePromise;
    },

    // ===== API wrappers =====
    async apiGet(path, mockFn) {
      const base = await this.ensureApiBase();
      const url = base + path;
      const headers = {};
      const t = this.state.token();
      if (t) headers['Authorization'] = 'Bearer ' + t;

      try {
        const res = await fetch(url, { headers, cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
      } catch (e) {
        return typeof mockFn === 'function' ? mockFn() : null;
      }
    },

    async apiPost(path, body, mockFn) {
      const base = await this.ensureApiBase();
      const url = base + path;
      const headers = { 'Content-Type': 'application/json' };
      const t = this.state.token();
      if (t) headers['Authorization'] = 'Bearer ' + t;

      try {
        const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
      } catch (e) {
        return typeof mockFn === 'function' ? mockFn(body) : null;
      }
    },

    // ===== Mock fallback data (localStorage DB) =====
    mock: {
      profile() {
        return {
          companyName: "ASGC CONSTRUCTION SINGLE OWNER LLC - BRANCH OF ABU DHABI",
          user: {
            name: localStorage.getItem('userName') || 'Demo User',
            email: localStorage.getItem('userEmail') || 'user@demo.com',
            role: localStorage.getItem('userRole') || 'CUSTOMER',
            phone: "+971 50 123 4567",
            lastLogin: new Date().toISOString(),
          },
          notifications: 2
        };
      },

      dashboard() {
        return {
          companyName: "ASGC CONSTRUCTION SINGLE OWNER LLC - BRANCH OF ABU DHABI",
          notifications: 2,
          tiles: [
            { id:"newOrder", title:"New Order", route:"new-order.html", icon:'<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>', active:true },
            { id:"orderReq", title:"Orders", route:"orders.html?tab=all", icon:'<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>' },
            { id:"inProcess", title:"Current Orders", route:"orders.html?tab=current", icon:'<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>' },
            { id:"deliveryNote", title:"My Delivery Note", route:"#", icon:'<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/></svg>' },
            { id:"trackGps", title:"Concrete calculator", route:"calculator.html", icon:'<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h2M8 15h2M12 15h2M16 15h2"/></svg>' },
            { id:"dnAccept", title:"My Delivery Note Accept", route:"#", icon:'<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M9 12l2 2 4-4"/></svg>' }
          ]
        };
      },

      orders() {
        const key = 'mockOrders';
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);

        const now = new Date();
        const fmt = (d) => d.toISOString().slice(0,10);

        const seed = [
          { orderNo: "ORD-10021", date: fmt(new Date(now.getTime()-86400000*2)), status: "Current",   site: "Abu Dhabi Site A", grade:"C40", qty: "12", reqTime:"10:30", remarks:"" },
          { orderNo: "ORD-10022", date: fmt(new Date(now.getTime()-86400000*1)), status: "Approved",  site: "Mussafah Plant", grade:"C30", qty: "8",  reqTime:"14:00", remarks:"Pump required" },
          { orderNo: "ORD-10023", date: fmt(now),                               status: "Rejected",  site: "Reem Island", grade:"C35", qty: "6",  reqTime:"09:00", remarks:"Credit limit" },
          { orderNo: "ORD-10024", date: fmt(new Date(now.getTime()-86400000*3)), status: "Rescheduled", site: "Airport Rd", grade:"C25", qty:"10", reqTime:"16:00", remarks:"Requested by customer" }
        ];
        localStorage.setItem(key, JSON.stringify(seed));
        return seed;
      },

      addOrder(payload) {
        const key = 'mockOrders';
        const list = this.orders();
        const n = 10000 + Math.floor(Math.random()*9000);
        const newRow = {
          orderNo: "ORD-" + n,
          date: payload.requiredDate || new Date().toISOString().slice(0,10),
          status: "Current",
          site: payload.siteName || "-",
          grade: payload.grade || "-",
          qty: String(payload.quantity || "-"),
          reqTime: payload.requiredTime || "-",
          remarks: payload.remarks || ""
        };
        list.unshift(newRow);
        localStorage.setItem(key, JSON.stringify(list));
        return { ok:true, message:"Order created (mock)", orderNo:newRow.orderNo };
      }
    }
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (!window.TGApp) return;
  window.TGApp.initTheme();
  window.TGApp.initThemeUI();
  document.body.classList.add('tg-ready');
});

window.addEventListener('beforeunload', () => {
  document.body.classList.remove('tg-ready');
});




