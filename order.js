/* =====================================================================
   Arribas Japan — Guest Order screen
   Builds the menu, cart review, confirmation and printable ticket.
   Reads which store it is from <body data-store="…">.
   ===================================================================== */
(function () {
  const store = window.CURRENT_STORE();
  const STORE = store.code;

  // ---- language (remembered per device) ----
  window.APP_LANG = localStorage.getItem("arribas_lang") || "EN";

  // ---- state ----
  let products = [];
  let currentCategory = null;
  let searchTerm = "";
  let cart = {};            // { id: {product, qty} }
  let lastOrder = null;     // for the ticket

  const yen = (n) => "¥" + Number(n || 0).toLocaleString();

  /* ---------- build the static chrome ---------- */
  const logoHtml = store.logo
    ? `<img class="logo" src="${store.logo}" alt="${store.name}">`
    : `<div class="logo-fallback">${store.name.charAt(0)}</div>`;

  document.getElementById("app").innerHTML = `
    <div class="order-app">
      <div class="notice" id="notice">
        <span class="dot"></span><span data-i18n="notConnected"></span>
      </div>

      <header class="app-header">
        ${logoHtml}
        <div class="brand-block">
          <span class="brand-kicker">Arribas Japan</span>
          <span class="brand-name">${store.name}</span>
          <span class="brand-sub">${store.tagline}</span>
        </div>
        <div class="header-spacer"></div>
        <div class="lang-switch" id="langSwitch"></div>
      </header>

      <div class="controls">
        <div class="field" style="flex:1 1 240px;">
          <label data-i18n="guestName"></label>
          <input class="control" id="guestName" data-i18n-ph="guestNamePh" autocomplete="off">
        </div>
        <div class="field search">
          <label data-i18n="search"></label>
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path>
          </svg>
          <input class="control" id="searchInput" data-i18n-ph="search" autocomplete="off">
        </div>
      </div>

      <nav class="cat-bar"><div class="cat-row" id="catRow"></div></nav>

      <main class="grid" id="grid"></main>

      <div class="cart-bar" id="cartBar">
        <div class="cart-summary">
          <span class="cart-count" id="cartCount"></span>
          <span class="cart-total" id="cartTotal">¥0</span>
        </div>
        <button class="cart-cta" id="reviewBtn">
          <span data-i18n="reviewOrder"></span>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
    </div>

    <!-- Cart review sheet -->
    <div class="overlay" id="reviewOverlay">
      <div class="sheet">
        <div class="sheet-head">
          <span class="sheet-title" data-i18n="yourOrder"></span>
          <button class="sheet-close" id="reviewClose">×</button>
        </div>
        <div class="sheet-guest" id="sheetGuest"></div>
        <div class="sheet-body" id="sheetBody"></div>
        <div class="sheet-foot">
          <div class="sheet-total">
            <span class="lbl" data-i18n="total"></span>
            <span class="amt" id="sheetTotal">¥0</span>
          </div>
          <button class="btn-primary" id="confirmBtn">
            <span data-i18n="confirmSend"></span>
          </button>
          <button class="btn-ghost" id="backBtn" data-i18n="back"></button>
        </div>
      </div>
    </div>

    <!-- Confirmation -->
    <div class="overlay" id="confirmOverlay">
      <div class="confirm">
        <div class="tick">✓</div>
        <div class="confirm-label" data-i18n="orderReceived"></div>
        <div class="confirm-number-label" data-i18n="orderNumber"></div>
        <div class="confirm-number" id="confNumber">—</div>
        <div class="confirm-guest"><span data-i18n="forGuest"></span> <b id="confGuest"></b></div>
        <div class="confirm-hint" data-i18n="confirmHint"></div>
        <div class="confirm-actions">
          <button class="btn-primary" id="printBtn"><span data-i18n="printTicket"></span></button>
          <button class="btn-ghost" id="newOrderBtn" data-i18n="newOrder"></button>
        </div>
      </div>
    </div>

    <!-- Printable guest ticket -->
    <div class="ticket" id="ticket"></div>
  `;

  /* ---------- element refs ---------- */
  const el = (id) => document.getElementById(id);
  const grid = el("grid");
  const catRow = el("catRow");
  const cartBar = el("cartBar");

  /* ---------- click-and-drag to scroll the category bar ---------- */
  (function enableCatDrag() {
    const bar = document.querySelector(".cat-bar");
    if (!bar) return;
    let down = false, startX = 0, startLeft = 0, moved = false;
    bar.addEventListener("pointerdown", (e) => {
      down = true; moved = false;
      startX = e.clientX; startLeft = bar.scrollLeft;
      bar.classList.add("dragging");
      try { bar.setPointerCapture(e.pointerId); } catch (_) {}
    });
    bar.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      bar.scrollLeft = startLeft - dx;
    });
    const end = () => { down = false; bar.classList.remove("dragging"); };
    bar.addEventListener("pointerup", end);
    bar.addEventListener("pointercancel", end);
    bar.addEventListener("pointerleave", end);
    // if the press turned into a drag, swallow the click so it doesn't switch category
    bar.addEventListener("click", (e) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  })();

  /* ---------- language switcher ---------- */
  function buildLangSwitch() {
    el("langSwitch").innerHTML = window.I18N_ORDER.map(
      (l) =>
        `<button data-lang="${l}" class="${l === window.APP_LANG ? "active" : ""}">${window.I18N[l].langName === "English" ? "EN" : window.I18N[l].langName}</button>`
    ).join("");
    el("langSwitch").querySelectorAll("button").forEach((b) => {
      b.onclick = () => setLang(b.dataset.lang);
    });
  }
  function setLang(lang) {
    window.APP_LANG = lang;
    localStorage.setItem("arribas_lang", lang);
    buildLangSwitch();
    window.applyI18n(document);
    renderCategories();
    renderProducts();
    renderCart();
  }

  /* ---------- load + categories ---------- */
  async function init() {
    buildLangSwitch();
    window.applyI18n(document);
    grid.innerHTML = `<div class="state">${window.t("loading")}</div>`;
    products = await window.loadProducts(STORE);
    el("notice").classList.toggle("show", window.IS_DEMO);
    renderCategories();
    renderProducts();
    renderCart();
  }

  function categories() {
    const set = [];
    products.forEach((p) => { if (p.category && !set.includes(p.category)) set.push(p.category); });
    return set;
  }

  function renderCategories() {
    const cats = categories();
    if (!cats.length) { catRow.innerHTML = ""; return; }
    if (!currentCategory || !cats.includes(currentCategory)) currentCategory = cats[0];
    catRow.innerHTML = cats
      .map((c) => `<button class="cat-pill ${c === currentCategory ? "active" : ""}" data-cat="${c}">${c}</button>`)
      .join("");
    catRow.querySelectorAll(".cat-pill").forEach((b) => {
      b.onclick = () => { currentCategory = b.dataset.cat; renderCategories(); renderProducts(); };
    });
  }

  /* ---------- product grid ---------- */
  function visibleProducts() {
    let list = products;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((p) =>
        (p.style || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
      );
    } else if (currentCategory) {
      list = list.filter((p) => p.category === currentCategory);
    }
    return list;
  }

  function renderProducts() {
    // hide category bar while searching
    document.querySelector(".cat-bar").style.display = searchTerm ? "none" : "";
    const list = visibleProducts();
    if (!products.length) { grid.innerHTML = `<div class="state">${window.t("noItems")}</div>`; return; }
    if (!list.length) { grid.innerHTML = `<div class="state">${window.t("noItemsCat")}</div>`; return; }

    grid.innerHTML = list.map((p) => {
      const qty = cart[p.id]?.qty || 0;
      const media = p.imageUrl
        ? `<img src="${p.imageUrl}" alt="${escapeHtml(p.style)}">`
        : `<span class="ph">${escapeHtml(p.category || store.name)}</span>`;
      const control = qty > 0
        ? stepperHtml(p.id, qty)
        : `<button class="add-btn" data-add="${p.id}">+ <span data-i18n="add">${window.t("add")}</span></button>`;
      return `
        <div class="card ${qty > 0 ? "in-cart" : ""}" data-card="${p.id}">
          <div class="card-media">${media}<span class="card-qty-badge">${qty}</span></div>
          <div class="card-body">
            <div class="card-title">${escapeHtml(p.style || "")}</div>
            <div class="card-desc">${escapeHtml(p.description || "")}</div>
            <div class="card-foot">
              <span class="card-price">${yen(p.price)}</span>
              ${control}
            </div>
          </div>
        </div>`;
    }).join("");
    bindGridEvents();
  }

  function stepperHtml(id, qty) {
    return `
      <div class="stepper" data-stepper="${id}">
        <button data-dec="${id}">−</button>
        <span class="val">${qty}</span>
        <button data-inc="${id}">+</button>
      </div>`;
  }

  function bindGridEvents() {
    grid.querySelectorAll("[data-add]").forEach((b) => (b.onclick = () => changeQty(b.dataset.add, 1)));
    grid.querySelectorAll("[data-inc]").forEach((b) => (b.onclick = () => changeQty(b.dataset.inc, 1)));
    grid.querySelectorAll("[data-dec]").forEach((b) => (b.onclick = () => changeQty(b.dataset.dec, -1)));
  }

  /* ---------- cart ---------- */
  function changeQty(id, delta) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const cur = cart[id]?.qty || 0;
    const next = Math.max(0, cur + delta);
    if (next === 0) delete cart[id];
    else cart[id] = { product: p, qty: next };
    // update just this card without full re-render (keeps scroll position)
    updateCard(id);
    renderCart();
  }

  function updateCard(id) {
    const card = grid.querySelector(`[data-card="${id}"]`);
    if (!card) return;
    const qty = cart[id]?.qty || 0;
    card.classList.toggle("in-cart", qty > 0);
    card.querySelector(".card-qty-badge").textContent = qty;
    const foot = card.querySelector(".card-foot");
    const priceHtml = foot.querySelector(".card-price").outerHTML;
    foot.innerHTML = priceHtml + (qty > 0
      ? stepperHtml(id, qty)
      : `<button class="add-btn" data-add="${id}">+ ${window.t("add")}</button>`);
    bindGridEvents();
  }

  function cartArray() { return Object.values(cart); }
  function cartTotals() {
    let pcs = 0, total = 0;
    cartArray().forEach(({ product, qty }) => { pcs += qty; total += qty * Number(product.price || 0); });
    return { count: cartArray().length, pcs, total };
  }

  function renderCart() {
    const { count, pcs, total } = cartTotals();
    cartBar.classList.toggle("show", count > 0);
    el("cartCount").textContent = `${count} ${window.t("items")} · ${pcs} ${window.t("pcs")}`;
    el("cartTotal").textContent = yen(total);
  }

  /* ---------- review sheet ---------- */
  function openReview() {
    const guest = el("guestName").value.trim();
    el("sheetGuest").innerHTML = guest ? `${window.t("forGuest")}: <b>${escapeHtml(guest)}</b>` : "";
    renderSheetItems();
    el("reviewOverlay").classList.add("show");
  }
  function renderSheetItems() {
    const body = el("sheetBody");
    const items = cartArray();
    if (!items.length) {
      body.innerHTML = `<div class="state">${window.t("emptyCart")}<br><small>${window.t("emptyCartHint")}</small></div>`;
    } else {
      body.innerHTML = items.map(({ product, qty }) => {
        const media = product.imageUrl ? `<img src="${product.imageUrl}">` : "";
        return `
          <div class="line-item">
            <div class="line-thumb">${media}</div>
            <div class="line-info">
              <div class="line-name">${escapeHtml(product.style || "")}</div>
              <div class="line-price">${yen(product.price)} × ${qty}</div>
            </div>
            <div class="line-stepper">${stepperHtml(product.id, qty)}</div>
            <div class="line-amount">${yen(product.price * qty)}</div>
          </div>`;
      }).join("");
      body.querySelectorAll("[data-inc]").forEach((b) => (b.onclick = () => { changeQty(b.dataset.inc, 1); refreshSheet(); }));
      body.querySelectorAll("[data-dec]").forEach((b) => (b.onclick = () => { changeQty(b.dataset.dec, -1); refreshSheet(); }));
    }
    el("sheetTotal").textContent = yen(cartTotals().total);
  }
  function refreshSheet() {
    if (!cartArray().length) { closeReview(); return; }
    renderSheetItems();
  }
  function closeReview() { el("reviewOverlay").classList.remove("show"); }

  /* ---------- send order ---------- */
  async function confirmOrder() {
    const guest = el("guestName").value.trim();
    if (!guest) { alert(window.t("needName")); closeReview(); el("guestName").focus(); return; }
    if (!cartArray().length) { alert(window.t("needItem")); return; }

    const btn = el("confirmBtn");
    btn.disabled = true;
    btn.innerHTML = window.t("sending");

    const orderNo = window.nextOrderNo(STORE);
    const items = cartArray().map(({ product, qty }) => ({
      id: product.id, style: product.style, description: product.description,
      qty, price: Number(product.price || 0), imageUrl: product.imageUrl || "",
    }));
    const { total } = cartTotals();
    const now = new Date();
    const payload = {
      orderId: STORE + "-" + Date.now(),
      orderNo, store: STORE, guestName: guest, items, total,
      time: now.toTimeString().slice(0, 5),
    };

    try {
      await window.sendOrder(payload);
      lastOrder = { ...payload, dateStr: now.toLocaleString() };
      showConfirmation();
    } catch (err) {
      console.error(err);
      alert(window.t("errorSending"));
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span>${window.t("confirmSend")}</span>`;
    }
  }

  function showConfirmation() {
    closeReview();
    el("confNumber").textContent = lastOrder.orderNo;
    el("confGuest").textContent = lastOrder.guestName;
    el("confirmOverlay").classList.add("show");
  }

  function newOrder() {
    cart = {};
    el("guestName").value = "";
    searchTerm = "";
    el("searchInput").value = "";
    el("confirmOverlay").classList.remove("show");
    renderCategories();
    renderProducts();
    renderCart();
  }

  /* ---------- printable ticket ---------- */
  function printTicket() {
    if (!lastOrder) return;
    const itemsHtml = lastOrder.items.map(
      (it) => `<div class="ticket-line"><span>${escapeHtml(it.style)} × ${it.qty}</span><span>${yen(it.price * it.qty)}</span></div>`
    ).join("");
    el("ticket").innerHTML = `
      <div class="ticket-logo">Arribas Japan</div>
      <div class="ticket-store">${store.name} · ${store.park}</div>
      <div class="ticket-rule"></div>
      <div class="ticket-numlabel">${window.t("orderNumber")}</div>
      <div class="ticket-num">${lastOrder.orderNo}</div>
      <div class="ticket-guest">${escapeHtml(lastOrder.guestName)}</div>
      <div class="ticket-rule"></div>
      ${itemsHtml}
      <div class="ticket-total"><span>${window.t("total")}</span><span>${yen(lastOrder.total)}</span></div>
      <div class="ticket-rule"></div>
      <div class="ticket-line"><span>${window.t("time")}</span><span>${lastOrder.dateStr}</span></div>
      <div class="ticket-foot">${window.t("ticketThanks")}<br>${window.t("ticketWait")}</div>
    `;
    document.body.classList.add("printing-ticket");
    window.print();
    setTimeout(() => document.body.classList.remove("printing-ticket"), 300);
  }

  /* ---------- helpers ---------- */
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- wire events ---------- */
  el("searchInput").addEventListener("input", (e) => { searchTerm = e.target.value.trim(); renderProducts(); });
  el("reviewBtn").onclick = openReview;
  el("reviewClose").onclick = closeReview;
  el("backBtn").onclick = closeReview;
  el("reviewOverlay").addEventListener("click", (e) => { if (e.target === el("reviewOverlay")) closeReview(); });
  el("confirmBtn").onclick = confirmOrder;
  el("printBtn").onclick = printTicket;
  el("newOrderBtn").onclick = newOrder;
  el("notice").onclick = init;

  init();
})();
