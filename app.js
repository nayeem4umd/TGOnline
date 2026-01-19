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
      apiBase: 'http://192.168.12.1022/api/tp/online', // <-- replace with real base later
      //apiBase:'http://localhost:5195/online', // <-- dev local
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
      const btnLogout = $('btnLogout');
      btnLogout?.addEventListener('click', () => this.logout());

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
      $('hdrMeta') && ($('hdrMeta').textContent = `${em} • ${rl}`);
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

    // ===== API wrappers =====
    async apiGet(path, mockFn) {
      const url = this.state.apiBase + path;
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
      const url = this.state.apiBase + path;
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
            { id:"newOrder", title:"New Order", route:"new-order.html", icon:"➕", active:true },
            { id:"orderReq", title:"Orders", route:"orders.html?tab=all", icon:"dY" },
            { id:"inProcess", title:"Current Orders", route:"orders.html?tab=current", icon:"⏳" },
            { id:"deliveryNote", title:"My Delivery Note", route:"#", icon:"🧾" },
            { id:"trackGps", title:"Concrete calculator", route:"calculator.html", icon:"🧮" },
            { id:"dnAccept", title:"My Delivery Note Accept", route:"#", icon:"✅" }
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
