/* =====================================================================
   Arribas Japan — Shared design system
   Sections:  1 Tokens & themes · 2 Base · 3 Order screen ·
              4 Receiving screen · 5 Guest ticket (print) · 6 Print
   ===================================================================== */

/* ---------- 1. TOKENS & THEMES ------------------------------------- */
:root {
  --font-display: "Marcellus", "Hiragino Mincho ProN", "Yu Mincho", serif;
  --font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans",
    "Noto Sans JP", system-ui, sans-serif;

  --r-sm: 10px;
  --r-md: 16px;
  --r-lg: 24px;
  --r-pill: 999px;

  --shadow-card: 0 1px 2px rgba(40, 30, 25, 0.06), 0 6px 18px rgba(40, 30, 25, 0.08);
  --shadow-pop: 0 20px 60px rgba(30, 20, 16, 0.28);

  --ok: #2f7d57;
  --warn: #b06a1a;
  --danger: #b3413c;
}

/* Silhouette Studio — cream paper + maroon */
body[data-store="SIL"] {
  --paper: #f3e3cd;
  --surface: #fdf7ee;
  --surface-2: #fbf0e0;
  --brand: #8a4745;
  --brand-deep: #6c3634;
  --brand-soft: #efd9cf;
  --ink: #312420;
  --muted: #8c7a70;
  --line: rgba(108, 54, 52, 0.16);
  --accent: #8a4745;
  --accent-ink: #ffffff;
  --header-grad: linear-gradient(135deg, #8a4745, #6c3634);
}

/* Mermaid Lagoon — cream + warm gold */
body[data-store="MER"] {
  --paper: #f4ead2;
  --surface: #fdf8ee;
  --surface-2: #faf1dd;
  --brand: #9a7322;
  --brand-deep: #7c5c19;
  --brand-soft: #ecdcb4;
  --ink: #2c2820;
  --muted: #8a7c63;
  --line: rgba(154, 115, 34, 0.18);
  --accent: #b6802f;
  --accent-ink: #ffffff;
  --header-grad: linear-gradient(135deg, #b6802f, #8a6320);
}

/* ---------- 2. BASE ------------------------------------------------ */
* { box-sizing: border-box; margin: 0; padding: 0; }

html, body { height: 100%; }

body {
  font-family: var(--font-ui);
  color: var(--ink);
  background: var(--paper);
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

button { font-family: inherit; cursor: pointer; }
input, textarea, select { font-family: inherit; }

.serif { font-family: var(--font-display); font-weight: 400; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }

/* Background paper texture (very subtle) */
body::before {
  content: "";
  position: fixed; inset: 0; z-index: -1;
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.6), transparent 60%),
    var(--paper);
}

/* =====================================================================
   3. GUEST ORDER SCREEN
   ===================================================================== */
.order-app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 1180px;
  margin: 0 auto;
}

/* --- Top banner (demo/offline notice) --- */
.notice {
  display: none;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  background: #fbe9cf;
  color: var(--warn);
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid rgba(176, 106, 26, 0.25);
  cursor: pointer;
}
.notice.show { display: flex; }
.notice .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--warn); }

/* --- Header --- */
.app-header {
  position: sticky; top: 0; z-index: 30;
  background: var(--header-grad);
  color: #fff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 14px rgba(40, 25, 20, 0.18);
}
.app-header .logo {
  height: 54px; width: auto; max-width: 120px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25));
}
.app-header .logo-fallback {
  height: 52px; width: 52px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.16);
  font-family: var(--font-display);
  font-size: 24px; color: #fff;
}
.brand-block { display: flex; flex-direction: column; gap: 2px; line-height: 1.1; }
.brand-kicker { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; opacity: 0.8; }
.brand-name { font-family: var(--font-display); font-size: 26px; letter-spacing: 0.01em; }
.brand-sub { font-size: 12px; opacity: 0.85; }

.header-spacer { flex: 1; }

/* Language switcher */
.lang-switch {
  display: inline-flex;
  background: rgba(255,255,255,0.14);
  border-radius: var(--r-pill);
  padding: 4px;
  gap: 2px;
}
.lang-switch button {
  border: none; background: transparent; color: #fff;
  font-size: 14px; font-weight: 600;
  padding: 8px 14px; border-radius: var(--r-pill);
  min-height: 40px;
  transition: background 0.15s;
}
.lang-switch button.active { background: #fff; color: var(--brand-deep); }

/* --- Guest info + search row --- */
.controls {
  padding: 16px 20px 8px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: stretch;
}
.field {
  display: flex; flex-direction: column; gap: 5px;
  flex: 1 1 220px;
}
.field label {
  font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--muted);
}
.field .control {
  height: 52px;
  border: 1.5px solid var(--line);
  background: var(--surface);
  border-radius: var(--r-md);
  padding: 0 16px;
  font-size: 17px;
  color: var(--ink);
  display: flex; align-items: center;
}
.field .control:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-soft);
}
.field.search { flex: 2 1 300px; }
.field.search .control { padding-left: 44px; }
.field.search { position: relative; }
.field.search .search-icon {
  position: absolute; left: 15px; bottom: 15px;
  width: 20px; height: 20px; opacity: 0.45; pointer-events: none;
}

/* --- Category pills --- */
.cat-bar {
  position: sticky; top: 88px; z-index: 20;
  background: linear-gradient(var(--paper), var(--paper) 70%, transparent);
  padding: 8px 20px 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.cat-bar::-webkit-scrollbar { display: none; }
.cat-row { display: inline-flex; gap: 10px; min-width: 100%; }
.cat-pill {
  white-space: nowrap;
  border: 1.5px solid var(--line);
  background: var(--surface);
  color: var(--brand-deep);
  font-size: 16px; font-weight: 600;
  padding: 0 22px; height: 48px;
  border-radius: var(--r-pill);
  transition: transform 0.1s, background 0.15s;
}
.cat-pill:active { transform: scale(0.96); }
.cat-pill.active {
  background: var(--accent); color: var(--accent-ink);
  border-color: var(--accent);
  box-shadow: 0 4px 12px rgba(40,25,20,0.18);
}

/* --- Product grid --- */
.grid {
  flex: 1;
  padding: 10px 20px 140px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  align-content: start;
}

.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.12s, box-shadow 0.12s;
}
.card.in-cart { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent), var(--shadow-card); }

.card-media {
  height: 140px;
  background:
    repeating-linear-gradient(135deg, var(--surface-2) 0 12px, var(--brand-soft) 12px 24px);
  display: flex; align-items: center; justify-content: center;
  position: relative;
  overflow: hidden;
}
.card-media img { width: 100%; height: 100%; object-fit: cover; }
.card-media .ph {
  font-family: var(--font-display);
  font-size: 15px; letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--brand-deep); opacity: 0.65;
}
.card-qty-badge {
  position: absolute; top: 10px; right: 10px;
  min-width: 30px; height: 30px; padding: 0 9px;
  border-radius: var(--r-pill);
  background: var(--accent); color: var(--accent-ink);
  font-size: 15px; font-weight: 700;
  display: none; align-items: center; justify-content: center;
  box-shadow: 0 3px 8px rgba(0,0,0,0.25);
}
.card.in-cart .card-qty-badge { display: flex; }

.card-body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
.card-title { font-size: 18px; font-weight: 700; line-height: 1.25; }
.card-desc { font-size: 14px; color: var(--muted); line-height: 1.35; flex: 1; }
.card-meta { font-size: 12px; color: var(--muted); opacity: 0.8; }
.card-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; gap: 10px; }
.card-price { font-size: 20px; font-weight: 700; font-variant-numeric: tabular-nums; }

/* Quantity stepper */
.stepper {
  display: inline-flex; align-items: center;
  background: var(--surface-2);
  border: 1.5px solid var(--line);
  border-radius: var(--r-pill);
  overflow: hidden;
}
.stepper button {
  width: 46px; height: 46px; border: none; background: transparent;
  font-size: 24px; line-height: 1; color: var(--brand-deep);
  display: flex; align-items: center; justify-content: center;
}
.stepper button:active { background: var(--brand-soft); }
.stepper .val {
  min-width: 38px; text-align: center;
  font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums;
}
/* "Add" button shown when qty is 0 */
.add-btn {
  height: 46px; padding: 0 22px;
  border: none; border-radius: var(--r-pill);
  background: var(--accent); color: var(--accent-ink);
  font-size: 16px; font-weight: 700;
  display: inline-flex; align-items: center; gap: 6px;
}
.add-btn:active { transform: scale(0.96); }

/* Empty / loading states */
.state {
  grid-column: 1 / -1;
  text-align: center; color: var(--muted);
  padding: 60px 20px; font-size: 17px;
}

/* --- Sticky cart bar --- */
.cart-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 40;
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
  background: var(--surface);
  border-top: 1px solid var(--line);
  box-shadow: 0 -6px 24px rgba(30,20,16,0.12);
  display: flex; align-items: center; gap: 16px;
  transform: translateY(120%);
  transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.cart-bar.show { transform: translateY(0); }
.cart-summary { display: flex; flex-direction: column; line-height: 1.2; }
.cart-count { font-size: 13px; color: var(--muted); font-weight: 600; }
.cart-total { font-size: 24px; font-weight: 700; font-variant-numeric: tabular-nums; }
.cart-cta {
  margin-left: auto;
  height: 58px; padding: 0 30px;
  border: none; border-radius: var(--r-pill);
  background: var(--header-grad); color: #fff;
  font-size: 18px; font-weight: 700;
  display: inline-flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 20px rgba(40,25,20,0.3);
}
.cart-cta:active { transform: scale(0.98); }

/* =====================================================================
   OVERLAYS — cart review + confirmation
   ===================================================================== */
.overlay {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(30, 20, 16, 0.5);
  backdrop-filter: blur(3px);
  display: none;
  align-items: flex-end;
}
.overlay.show { display: flex; }
@media (min-width: 760px) { .overlay { align-items: center; justify-content: center; } }

.sheet {
  background: var(--surface);
  width: 100%;
  max-width: 620px;
  max-height: 92vh;
  border-radius: var(--r-lg) var(--r-lg) 0 0;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow-pop);
  animation: rise 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
@media (min-width: 760px) { .sheet { border-radius: var(--r-lg); } }
@keyframes rise { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.sheet-head {
  padding: 22px 24px 14px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--line);
}
.sheet-title { font-family: var(--font-display); font-size: 26px; }
.sheet-close {
  width: 44px; height: 44px; border-radius: 50%;
  border: 1.5px solid var(--line); background: var(--surface-2);
  font-size: 22px; color: var(--ink); line-height: 1;
}
.sheet-body { padding: 8px 24px; overflow-y: auto; flex: 1; }
.sheet-guest {
  font-size: 15px; color: var(--muted); padding: 12px 0 4px;
}
.sheet-guest b { color: var(--ink); font-size: 17px; }

.line-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 0; border-bottom: 1px solid var(--line);
}
.line-thumb {
  width: 56px; height: 56px; border-radius: var(--r-sm); flex-shrink: 0;
  background: repeating-linear-gradient(135deg, var(--surface-2) 0 8px, var(--brand-soft) 8px 16px);
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.line-thumb img { width: 100%; height: 100%; object-fit: cover; }
.line-info { flex: 1; min-width: 0; }
.line-name { font-size: 16px; font-weight: 700; }
.line-price { font-size: 13px; color: var(--muted); }
.line-amount { font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
.line-stepper { transform: scale(0.9); }

.sheet-foot {
  padding: 16px 24px calc(20px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--line);
  display: flex; flex-direction: column; gap: 12px;
}
.sheet-total { display: flex; align-items: baseline; justify-content: space-between; }
.sheet-total .lbl { font-size: 16px; color: var(--muted); }
.sheet-total .amt { font-size: 30px; font-weight: 700; font-variant-numeric: tabular-nums; }
.btn-primary {
  height: 60px; border: none; border-radius: var(--r-pill);
  background: var(--header-grad); color: #fff;
  font-size: 19px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
}
.btn-primary:disabled { opacity: 0.6; }
.btn-ghost {
  height: 50px; border: 1.5px solid var(--line); border-radius: var(--r-pill);
  background: transparent; color: var(--muted);
  font-size: 16px; font-weight: 600;
}

/* --- Confirmation --- */
.confirm {
  background: var(--surface);
  width: 100%; max-width: 560px;
  border-radius: var(--r-lg);
  padding: 40px 32px calc(32px + env(safe-area-inset-bottom));
  text-align: center;
  box-shadow: var(--shadow-pop);
  animation: rise 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.confirm .tick {
  width: 76px; height: 76px; border-radius: 50%;
  margin: 0 auto 18px;
  background: var(--ok); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 40px;
}
.confirm-label { font-size: 14px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
.confirm-title { font-family: var(--font-display); font-size: 30px; margin: 4px 0 22px; }
.confirm-number-label { font-size: 14px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em; }
.confirm-number {
  font-family: var(--font-display);
  font-size: 72px; line-height: 1; color: var(--brand);
  margin: 6px 0 10px; font-variant-numeric: tabular-nums;
}
.confirm-guest { font-size: 19px; margin-bottom: 6px; }
.confirm-guest b { font-weight: 700; }
.confirm-hint { font-size: 14px; color: var(--muted); margin-bottom: 26px; }
.confirm-actions { display: flex; flex-direction: column; gap: 12px; }

/* =====================================================================
   4. ORDER RECEIVING SCREEN
   ===================================================================== */
.recv-app { min-height: 100%; }

.recv-header {
  position: sticky; top: 0; z-index: 30;
  background: var(--header-grad); color: #fff;
  padding: 14px 20px;
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  box-shadow: 0 2px 14px rgba(40,25,20,0.18);
}
.recv-header .title { display: flex; flex-direction: column; line-height: 1.1; }
.recv-header .title .name { font-family: var(--font-display); font-size: 22px; }
.recv-header .title .sub { font-size: 12px; opacity: 0.85; }

.tabs { display: inline-flex; background: rgba(255,255,255,0.14); border-radius: var(--r-pill); padding: 4px; }
.tab {
  border: none; background: transparent; color: #fff;
  font-size: 15px; font-weight: 700; padding: 10px 20px;
  border-radius: var(--r-pill); min-height: 44px;
  display: inline-flex; align-items: center; gap: 8px;
}
.tab.active { background: #fff; color: var(--brand-deep); }
.tab .badge {
  min-width: 24px; height: 24px; padding: 0 7px; border-radius: var(--r-pill);
  background: rgba(0,0,0,0.18); color: #fff;
  font-size: 13px; display: inline-flex; align-items: center; justify-content: center;
}
.tab.active .badge { background: var(--accent); }

.recv-tools { margin-left: auto; display: flex; gap: 8px; flex-wrap: wrap; }
.tool-btn {
  border: 1.5px solid rgba(255,255,255,0.35); background: rgba(255,255,255,0.1);
  color: #fff; font-size: 14px; font-weight: 600;
  padding: 0 16px; height: 44px; border-radius: var(--r-pill);
  display: inline-flex; align-items: center; gap: 7px;
}
.tool-btn.on { background: #fff; color: var(--brand-deep); border-color: #fff; }

.recv-main { padding: 16px 20px 60px; max-width: 1280px; margin: 0 auto; }
.recv-info { font-size: 14px; color: var(--muted); margin-bottom: 14px; font-weight: 600; }

.orders-grid {
  display: grid; gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
}

.order-card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-md); box-shadow: var(--shadow-card);
  overflow: hidden; page-break-inside: avoid;
  display: flex; flex-direction: column;
}
.oc-top {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 16px 18px 12px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--line);
}
.oc-num {
  font-family: var(--font-display);
  font-size: 21px; line-height: 1.1; color: var(--brand);
  font-variant-numeric: tabular-nums; white-space: nowrap;
  padding-right: 14px; border-right: 1px solid var(--line);
  align-self: stretch; display: flex; align-items: center;
}
.oc-headinfo { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.oc-guest { font-size: 19px; font-weight: 700; line-height: 1.15; }
.oc-meta { font-size: 13px; color: var(--muted); }
.oc-total { font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums; white-space: nowrap; }
.status-chip {
  align-self: flex-start;
  font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
  padding: 5px 10px; border-radius: var(--r-pill);
  background: #fce6d8; color: var(--danger);
  text-transform: uppercase;
}
.status-chip.finished { background: #d9efe1; color: var(--ok); }

.oc-items { padding: 8px 18px; display: flex; flex-direction: column; }
.oc-item {
  display: grid; grid-template-columns: 50px 1fr auto;
  gap: 12px; align-items: center;
  padding: 10px 0; border-bottom: 1px solid var(--line);
}
.oc-item:last-child { border-bottom: none; }
.oc-thumb {
  width: 50px; height: 50px; border-radius: var(--r-sm); overflow: hidden;
  background: repeating-linear-gradient(135deg, var(--surface-2) 0 8px, var(--brand-soft) 8px 16px);
  display: flex; align-items: center; justify-content: center;
}
.oc-thumb img { width: 100%; height: 100%; object-fit: cover; }
.oc-item-name { font-size: 15px; font-weight: 700; }
.oc-item-desc { font-size: 13px; color: var(--muted); }
.oc-item-qty { font-size: 13px; color: var(--brand-deep); font-weight: 700; }
.oc-item-amt { text-align: right; font-size: 14px; font-variant-numeric: tabular-nums; }
.oc-item-amt b { display: block; font-size: 15px; }

/* editable fields (Mermaid) */
.oc-edit { margin-top: 6px; display: none; flex-direction: column; gap: 6px; }
.order-card.editing .oc-edit { display: flex; }
.oc-edit input {
  width: 100%; height: 38px; border: 1.5px solid var(--line);
  border-radius: var(--r-sm); padding: 0 10px; font-size: 14px; background: var(--surface);
}
.oc-edit .qtywrap { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); }
.oc-edit .qtywrap input { width: 80px; }

.revision {
  padding: 12px 18px;
  border-top: 1px dashed var(--line);
}
.revision label { display: block; font-size: 12px; font-weight: 700; color: var(--muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.03em; }
.revision textarea {
  width: 100%; min-height: 46px; resize: vertical;
  border: 1.5px solid var(--line); border-radius: var(--r-sm);
  padding: 8px 10px; font-size: 14px; background: var(--surface);
}
.revision textarea:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-soft); }

.oc-actions {
  padding: 12px 18px 16px;
  display: flex; gap: 10px; flex-wrap: wrap;
}
.oc-actions button {
  flex: 1; min-width: 120px; height: 48px;
  border-radius: var(--r-pill); border: none;
  font-size: 15px; font-weight: 700;
}
.btn-finish { background: var(--header-grad); color: #fff; }
.btn-reopen { background: var(--surface-2); color: var(--brand-deep); border: 1.5px solid var(--line); }
.btn-edit { background: transparent; color: var(--muted); border: 1.5px solid var(--line); flex: 0 0 auto; min-width: 96px; }
.btn-print-one { background: transparent; color: var(--muted); border: 1.5px solid var(--line); flex: 0 0 auto; min-width: 96px; }

.recv-empty { text-align: center; color: var(--muted); padding: 80px 20px; font-size: 18px; }

/* =====================================================================
   5. GUEST TICKET  (hidden on screen, shown only when printing a slip)
   ===================================================================== */
.ticket { display: none; }

@media print {
  /* default: hide everything, screens opt-in below */
  body * { visibility: hidden; }

  /* ----- Guest ticket slip ----- */
  body.printing-ticket .ticket,
  body.printing-ticket .ticket * { visibility: visible; }
  body.printing-ticket .ticket {
    display: block; position: absolute; top: 0; left: 0;
    width: 72mm; padding: 6mm 5mm; color: #000; font-family: var(--font-ui);
  }
  .ticket-logo { text-align: center; font-family: var(--font-display); font-size: 16pt; margin-bottom: 2mm; }
  .ticket-store { text-align: center; font-size: 10pt; margin-bottom: 4mm; letter-spacing: 0.04em; }
  .ticket-rule { border-top: 1px dashed #000; margin: 3mm 0; }
  .ticket-numlabel { text-align: center; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.12em; }
  .ticket-num { text-align: center; font-family: var(--font-display); font-size: 40pt; line-height: 1; margin: 1mm 0 3mm; }
  .ticket-guest { text-align: center; font-size: 12pt; margin-bottom: 3mm; }
  .ticket-line { display: flex; justify-content: space-between; font-size: 10pt; margin: 1mm 0; }
  .ticket-total { display: flex; justify-content: space-between; font-size: 12pt; font-weight: 700; margin-top: 2mm; }
  .ticket-foot { text-align: center; font-size: 9pt; margin-top: 4mm; }

  @page { margin: 0; }
}

/* =====================================================================
   6. PRINT — receiving sheet (full order list on A4)
   ===================================================================== */
@media print {
  body.printing-orders .recv-app,
  body.printing-orders .recv-app * { visibility: visible; }
  body.printing-orders .recv-header,
  body.printing-orders .recv-info,
  body.printing-orders .oc-actions,
  body.printing-orders .revision textarea,
  body.printing-orders .notice { display: none !important; }
  body.printing-orders .orders-grid { grid-template-columns: 1fr 1fr; }
  body.printing-orders .order-card { box-shadow: none; border: 1px solid #ccc; }
  body.printing-orders { background: #fff; }
}

/* =====================================================================
   RESPONSIVE — portrait tablets & phones
   ===================================================================== */
@media (max-width: 720px) {
  .brand-sub { display: none; }
  .brand-name { font-size: 22px; }
  .app-header { gap: 12px; padding: 12px 14px; }
  .lang-switch button { padding: 8px 11px; font-size: 13px; }
  .controls { padding: 12px 14px 6px; }
  .cat-bar { top: 80px; padding: 8px 14px 10px; }
  .grid { grid-template-columns: 1fr; padding: 10px 14px 140px; }
  .card { flex-direction: row; }
  .card-media { width: 116px; height: auto; flex-shrink: 0; }
  .card-body { padding: 12px 14px; }
  .recv-header { gap: 10px; }
  .recv-tools { width: 100%; margin-left: 0; }
  .orders-grid { grid-template-columns: 1fr; }
}

@media (max-width: 420px) {
  .cart-cta { padding: 0 20px; font-size: 16px; }
  .confirm-number { font-size: 60px; }
}
