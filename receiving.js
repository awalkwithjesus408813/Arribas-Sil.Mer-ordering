/* =====================================================================
   Arribas Japan — Order Receiving screen (back of house)
   Pending / Finished workflow, order # + guest name, revision notes,
   item editing, reprint guest ticket. Reads store from <body data-store>.
   ===================================================================== */

/* Extra translations only the receiving screen needs */
const EXTRA = {
  EN: { pending: "Pending", finished: "Finished", refresh: "Refresh", auto: "Auto", print: "Print",
    noOrders: "No orders here yet.", markFinished: "Mark Finished", reopen: "Reopen", revision: "Revision / note",
    saveEdits: "Save", reprint: "Reprint", ordersIn: "orders ·", itemsShort: "item(s)" },
  JA: { pending: "対応中", finished: "完了", refresh: "更新", auto: "自動", print: "印刷",
    noOrders: "注文はありません。", markFinished: "完了にする", reopen: "対応中に戻す", revision: "修正 / メモ",
    saveEdits: "保存", reprint: "再印刷", ordersIn: "件 ·", itemsShort: "点" },
  ES: { pending: "Pendiente", finished: "Completado", refresh: "Actualizar", auto: "Auto", print: "Imprimir",
    noOrders: "No hay pedidos aquí.", markFinished: "Completar", reopen: "Reabrir", revision: "Revisión / nota",
    saveEdits: "Guardar", reprint: "Reimprimir", ordersIn: "pedidos ·", itemsShort: "art." },
  ZH: { pending: "处理中", finished: "已完成", refresh: "刷新", auto: "自动", print: "打印",
    noOrders: "暂无订单。", markFinished: "标记完成", reopen: "重新打开", revision: "修改 / 备注",
    saveEdits: "保存", reprint: "重新打印", ordersIn: "个订单 ·", itemsShort: "项" },
};

(function () {
  const store = window.CURRENT_STORE();
  const STORE = store.code;
  window.APP_LANG = localStorage.getItem("arribas_lang") || "EN";

  const yen = (n) => "¥" + Number(n || 0).toLocaleString();
  const LS_KEY = "arribas_order_status_" + STORE; // { key: {status, revision, itemsOverride} }

  let allOrders = [];
  let catalog = [];
  let currentView = "pending";
  let autoTimer = null;

  /* ---------- chrome ---------- */
  document.getElementById("app").innerHTML = `
    <div class="recv-app">
      <div class="notice" id="notice"><span class="dot"></span><span data-i18n="notConnected"></span></div>
      <header class="recv-header">
        <div class="title">
          <span class="name">${store.name}</span>
          <span class="sub">Arribas Japan · ${store.park}</span>
        </div>
        <div class="tabs">
          <button class="tab active" id="tabPending"><span data-i18n="pending">Pending</span><span class="badge" id="cntPending">0</span></button>
          <button class="tab" id="tabFinished"><span data-i18n="finished">Finished</span><span class="badge" id="cntFinished">0</span></button>
        </div>
        <div class="recv-tools">
          <button class="tool-btn" id="btnRefresh">↻ <span data-i18n="refresh">Refresh</span></button>
          <button class="tool-btn" id="btnAuto"><span data-i18n="auto">Auto</span> 30s</button>
          <button class="tool-btn" id="btnPrint">🖶 <span data-i18n="print">Print</span></button>
        </div>
      </header>
      <main class="recv-main">
        <div class="recv-info" id="info"></div>
        <div class="orders-grid" id="grid"></div>
        <div class="recv-empty" id="empty" style="display:none;" data-i18n="noOrders">No orders here yet.</div>
      </main>
    </div>
    <datalist id="catalog"></datalist>
    <div class="ticket" id="ticket"></div>
  `;

  // extra i18n strings used only here
  Object.keys(window.I18N).forEach((l) => Object.assign(window.I18N[l], EXTRA[l]));

  const el = (id) => document.getElementById(id);
  const grid = el("grid");

  /* ---------- status storage ---------- */
  function loadMap() { try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}") || {}; } catch { return {}; } }
  function saveMap(m) { localStorage.setItem(LS_KEY, JSON.stringify(m)); }
  function orderKey(o, i) { return o.orderId || o.id || `${o.store || ""}-${o.time || ""}-${i}`; }

  /* ---------- data ---------- */
  async function refresh() {
    el("info").textContent = window.t("loading");
    catalog = await window.loadProducts(STORE);
    buildCatalog();
    allOrders = await window.loadOrders();
    el("notice").classList.toggle("show", window.IS_DEMO);
    render();
  }

  function buildCatalog() {
    el("catalog").innerHTML = catalog.map((p) => {
      const label = p.description ? `${p.style} | ${p.description}` : (p.style || "");
      return `<option value="${escapeAttr(label)}"></option>`;
    }).join("");
  }

  /* ---------- render ---------- */
  function storeOrders() {
    const map = loadMap();
    const list = allOrders.filter((o) => (o.store || "").toUpperCase() === STORE);
    list.forEach((o, i) => {
      const k = orderKey(o, i);
      if (!map[k]) map[k] = { status: "pending", revision: "", itemsOverride: null };
    });
    saveMap(map);
    return list;
  }

  function itemsFor(o, statusObj) {
    const base = Array.isArray(o.items) ? o.items : [];
    return Array.isArray(statusObj.itemsOverride) && statusObj.itemsOverride.length
      ? statusObj.itemsOverride : base;
  }

  function render() {
    const map = loadMap();
    const list = storeOrders();

    const pending = list.filter((o, i) => (map[orderKey(o, i)]?.status || "pending") === "pending");
    const finished = list.filter((o, i) => (map[orderKey(o, i)]?.status || "pending") === "finished");
    el("cntPending").textContent = pending.length;
    el("cntFinished").textContent = finished.length;

    const shown = currentView === "pending" ? pending : finished;
    grid.innerHTML = "";
    el("empty").style.display = shown.length ? "none" : "block";
    el("info").textContent = `${shown.length} ${window.t("ordersIn")} ${window.t(currentView)}`;

    shown.forEach((o) => {
      const idx = list.indexOf(o);
      const key = orderKey(o, idx);
      const statusObj = map[key] || {};
      const st = statusObj.status || "pending";
      const items = itemsFor(o, statusObj);
      const total = items.reduce((s, it) => s + Number(it.qty || 0) * Number(it.price || 0), 0);
      const num = window.shortCode({ ...o, orderNo: o.orderNo });

      const card = document.createElement("div");
      card.className = "order-card";
      card.dataset.key = key;
      card.innerHTML = `
        <div class="oc-top">
          <div class="oc-num">${escapeHtml(num)}</div>
          <div class="oc-headinfo">
            <span class="oc-guest">${escapeHtml(o.guestName || "—")}</span>
            <span class="oc-meta">${escapeHtml(o.time || "")} · ${items.length} ${window.t("itemsShort")}</span>
            <span class="status-chip ${st === "finished" ? "finished" : ""}">${st === "finished" ? window.t("finished") : window.t("pending")}</span>
          </div>
          <div class="oc-total">${yen(total)}</div>
        </div>
        <div class="oc-items">${items.map((it, i) => itemRow(it, key, i)).join("")}</div>
        <div class="revision">
          <label>${window.t("revision")}</label>
          <textarea data-role="revision" data-key="${key}">${escapeHtml(statusObj.revision || "")}</textarea>
        </div>
        <div class="oc-actions">
          <button class="${st === "finished" ? "btn-reopen" : "btn-finish"}" data-action="toggle" data-key="${key}">
            ${st === "finished" ? window.t("reopen") : window.t("markFinished")}
          </button>
          <button class="btn-edit" data-action="edit" data-key="${key}">${window.t("edit")}</button>
          <button class="btn-print-one" data-action="reprint" data-key="${key}">${window.t("reprint")}</button>
        </div>`;
      grid.appendChild(card);
    });
  }

  function itemRow(it, key, i) {
    const style = it.style || it.id || "";
    const desc = it.description || "";
    const qty = Number(it.qty || 0);
    const price = Number(it.price || 0);
    const media = it.imageUrl ? `<img src="${escapeAttr(it.imageUrl)}" alt="">` : `<span class="ph"></span>`;
    const label = desc ? `${style} | ${desc}` : style;
    return `
      <div class="oc-item" data-role="row" data-key="${key}" data-index="${i}" data-price="${price}">
        <div class="oc-thumb">${media}</div>
        <div>
          <div class="oc-item-name">${escapeHtml(style)}</div>
          <div class="oc-item-desc">${escapeHtml(desc)}</div>
          <div class="oc-item-qty">${window.t("qty")}: ${qty}</div>
          <div class="oc-edit">
            <input list="catalog" data-field="search" placeholder="${escapeAttr(label)}">
            <div class="qtywrap">${window.t("qty")}:
              <input type="number" min="0" data-field="qty" value="${qty}">
            </div>
          </div>
        </div>
        <div class="oc-item-amt">${yen(price)}<b>${yen(price * qty)}</b></div>
      </div>`;
  }

  /* ---------- editing ---------- */
  function findProduct(text) {
    if (!text || !catalog.length) return null;
    const lower = text.toLowerCase();
    const stylePart = text.split("|")[0].trim().toLowerCase();
    return (
      catalog.find((p) => (p.style || "").toLowerCase() === stylePart) ||
      catalog.find((p) => (p.style || "").toLowerCase() === lower) ||
      catalog.find((p) => (p.style || "").toLowerCase().includes(lower) || (p.description || "").toLowerCase().includes(lower)) ||
      null
    );
  }
  function saveEdits(key) {
    const map = loadMap();
    const card = grid.querySelector(`.order-card[data-key="${CSS.escape(key)}"]`);
    if (!card) return;
    const newItems = [];
    card.querySelectorAll('[data-role="row"]').forEach((row) => {
      const name = row.querySelector(".oc-item-name").textContent.trim();
      const desc = row.querySelector(".oc-item-desc").textContent.trim();
      const search = (row.querySelector('[data-field="search"]').value || "").trim();
      const qty = Number(row.querySelector('[data-field="qty"]').value || 0);
      const origPrice = Number(row.dataset.price || 0);
      if (qty <= 0) return;
      const chosen = findProduct(search);
      newItems.push({
        style: chosen ? chosen.style : name,
        description: chosen ? chosen.description : desc,
        qty, price: chosen ? Number(chosen.price || 0) : origPrice,
        imageUrl: chosen ? chosen.imageUrl || "" : "",
      });
    });
    map[key] = { ...(map[key] || { status: "pending", revision: "" }), itemsOverride: newItems };
    saveMap(map);
    render();
  }

  /* ---------- reprint ticket ---------- */
  function reprint(key) {
    const list = storeOrders();
    const idx = list.findIndex((o, i) => orderKey(o, i) === key);
    if (idx < 0) return;
    const o = list[idx];
    const statusObj = loadMap()[key] || {};
    const items = itemsFor(o, statusObj);
    const total = items.reduce((s, it) => s + Number(it.qty || 0) * Number(it.price || 0), 0);
    el("ticket").innerHTML = `
      <div class="ticket-logo">Arribas Japan</div>
      <div class="ticket-store">${store.name} · ${store.park}</div>
      <div class="ticket-rule"></div>
      <div class="ticket-numlabel">${window.t("orderNumber")}</div>
      <div class="ticket-num">${escapeHtml(window.shortCode(o))}</div>
      <div class="ticket-guest">${escapeHtml(o.guestName || "")}</div>
      <div class="ticket-rule"></div>
      ${items.map((it) => `<div class="ticket-line"><span>${escapeHtml(it.style)} × ${it.qty}</span><span>${yen(it.price * it.qty)}</span></div>`).join("")}
      <div class="ticket-total"><span>${window.t("total")}</span><span>${yen(total)}</span></div>
      <div class="ticket-foot">${window.t("ticketThanks")}</div>`;
    document.body.classList.add("printing-ticket");
    window.print();
    setTimeout(() => document.body.classList.remove("printing-ticket"), 300);
  }

  /* ---------- events ---------- */
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const key = btn.dataset.key;
    const action = btn.dataset.action;
    if (action === "toggle") {
      const map = loadMap();
      const cur = map[key]?.status || "pending";
      map[key] = { ...(map[key] || {}), status: cur === "finished" ? "pending" : "finished" };
      saveMap(map);
      render();
    } else if (action === "edit") {
      const card = btn.closest(".order-card");
      const editing = card.classList.toggle("editing");
      btn.textContent = editing ? window.t("saveEdits") : window.t("edit");
      if (!editing) saveEdits(key);
    } else if (action === "reprint") {
      reprint(key);
    }
  });

  grid.addEventListener("input", (e) => {
    const ta = e.target.closest('textarea[data-role="revision"]');
    if (!ta) return;
    const map = loadMap();
    const key = ta.dataset.key;
    map[key] = { ...(map[key] || { status: "pending" }), revision: ta.value };
    saveMap(map);
  });

  el("tabPending").onclick = () => { currentView = "pending"; el("tabPending").classList.add("active"); el("tabFinished").classList.remove("active"); render(); };
  el("tabFinished").onclick = () => { currentView = "finished"; el("tabFinished").classList.add("active"); el("tabPending").classList.remove("active"); render(); };
  el("btnRefresh").onclick = refresh;
  el("btnPrint").onclick = () => { document.body.classList.add("printing-orders"); window.print(); setTimeout(() => document.body.classList.remove("printing-orders"), 300); };
  el("btnAuto").onclick = () => {
    const b = el("btnAuto");
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; b.classList.remove("on"); b.innerHTML = `${window.t("auto")} 30s`; }
    else { refresh(); autoTimer = setInterval(refresh, 30000); b.classList.add("on"); b.innerHTML = `${window.t("auto")} ✓`; }
  };

  /* ---------- helpers ---------- */
  function escapeHtml(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function escapeAttr(s) { return escapeHtml(s); }

  window.applyI18n(document);
  refresh();
})();
