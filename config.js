/* =====================================================================
   Arribas Japan — Shared configuration & data layer
   ---------------------------------------------------------------------
   This one file holds everything that changes between the two stores,
   the live Google Sheet connection, and the small helpers both screens
   share. Edit values here once and every page updates.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1) LIVE BACKEND
   This is your Google Apps Script URL. To point at a new script, change
   only this line.
   --------------------------------------------------------------------- */
window.API_URL =
  "https://script.google.com/macros/s/AKfycbwTrQYGmmo5b326k77189R4DJwvBJ6-7y_YxW9Gibl3GXKIuiqFHfbL37cdGfB3-v_JMQ/exec";

/* ---------------------------------------------------------------------
   2) STORE SETTINGS
   Each store has its own name, theme colour and logo. The theme colours
   are applied through CSS using the data-store attribute on <body>.
   --------------------------------------------------------------------- */
window.STORES = {
  SIL: {
    code: "SIL",
    name: "Silhouette Studio",
    park: "Tokyo Disney Resort",
    tagline: "Hand-cut paper silhouettes",
    logo: "https://i.postimg.cc/4dwK2bRZ/Silhouette_studio_logo.png",
  },
  MER: {
    code: "MER",
    name: "Mermaid Lagoon",
    park: "Tokyo DisneySea",
    tagline: "Silhouettes & live caricatures",
    logo: "", // paste a Mermaid logo URL here when you have one
  },
};

/* Read the current store from <body data-store="SIL"> */
window.CURRENT_STORE = function () {
  const code = (document.body.getAttribute("data-store") || "SIL").toUpperCase();
  return window.STORES[code] || window.STORES.SIL;
};

/* ---------------------------------------------------------------------
   3) SAMPLE MENU  (used only when the live sheet can't be reached, so
   the app always shows something. Real data from the sheet always wins.)
   --------------------------------------------------------------------- */
window.DEMO_PRODUCTS = {
  SIL: [
    { id: "s1", category: "Silhouette", style: "Single Silhouette", description: "One person, hand-cut profile", price: 1800, barcode: "4900001", imageUrl: "" },
    { id: "s2", category: "Silhouette", style: "Double Silhouette", description: "Two people on one card", price: 3400, barcode: "4900002", imageUrl: "" },
    { id: "s3", category: "Silhouette", style: "Family (3)", description: "Three profiles, single mount", price: 4900, barcode: "4900003", imageUrl: "" },
    { id: "f1", category: "Frames", style: "Oval Frame", description: "Classic oval, gold edge", price: 2800, barcode: "4900010", imageUrl: "" },
    { id: "f2", category: "Frames", style: "Mat Frame", description: "White mat, standing frame", price: 2400, barcode: "4900011", imageUrl: "" },
    { id: "a1", category: "Add-ons", style: "Extra Copy", description: "Additional cut of the same profile", price: 900, barcode: "4900020", imageUrl: "" },
    { id: "a2", category: "Add-ons", style: "Gift Envelope", description: "Protective card envelope", price: 300, barcode: "4900021", imageUrl: "" },
  ],
  MER: [
    { id: "m1", category: "Silhouette", style: "Single Silhouette", description: "One person, hand-cut profile", price: 1800, barcode: "4910001", imageUrl: "" },
    { id: "m2", category: "Silhouette", style: "Double Silhouette", description: "Two people on one card", price: 3400, barcode: "4910002", imageUrl: "" },
    { id: "c1", category: "Caricature", style: "Caricature · 1 Person (Color)", description: "Full-colour drawing, ~10 min", price: 3500, barcode: "4910010", imageUrl: "" },
    { id: "c2", category: "Caricature", style: "Caricature · 2 People (Color)", description: "Two guests, full colour", price: 5500, barcode: "4910011", imageUrl: "" },
    { id: "c3", category: "Caricature", style: "Caricature · 1 Person (B/W)", description: "Black & white sketch", price: 2800, barcode: "4910012", imageUrl: "" },
    { id: "mf1", category: "Frames", style: "Oval Frame", description: "Classic oval, gold edge", price: 2800, barcode: "4910020", imageUrl: "" },
    { id: "ma1", category: "Add-ons", style: "Extra Copy", description: "Additional cut or print", price: 900, barcode: "4910030", imageUrl: "" },
  ],
};

/* ---------------------------------------------------------------------
   4) DATA LAYER
   loadProducts() / loadOrders() try the live sheet first. If that fails
   (no internet, preview mode, etc.) they fall back to the sample data
   and set window.IS_DEMO = true so the UI can show an honest banner.
   --------------------------------------------------------------------- */
window.IS_DEMO = false;

window.loadProducts = async function (storeCode) {
  try {
    const res = await fetch(
      `${window.API_URL}?mode=products&store=${encodeURIComponent(storeCode)}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Bad data");
    window.IS_DEMO = false;
    return data;
  } catch (err) {
    console.warn("Live products unavailable, using sample data.", err);
    window.IS_DEMO = true;
    return (window.DEMO_PRODUCTS[storeCode] || []).slice();
  }
};

window.loadOrders = async function () {
  try {
    const res = await fetch(`${window.API_URL}?mode=orders`, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error(data.error || "Bad data");
    window.IS_DEMO = false;
    return data;
  } catch (err) {
    console.warn("Live orders unavailable, using sample data.", err);
    window.IS_DEMO = true;
    return window.DEMO_ORDERS ? window.DEMO_ORDERS.slice() : [];
  }
};

/* Send a finished order to the sheet (same shape your script already
   expects, plus orderNo / total / time which the sheet can store too). */
window.sendOrder = async function (payload) {
  // In demo mode we can't reach the sheet — pretend success so the
  // confirmation screen still demonstrates the flow.
  if (window.IS_DEMO) {
    await new Promise((r) => setTimeout(r, 600));
    return true;
  }
  await fetch(window.API_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(payload),
  });
  return true;
};

/* ---------------------------------------------------------------------
   5) ORDER NUMBERS
   The order tablet keeps a simple daily counter so each guest gets a
   short, friendly number like SIL-014. It resets automatically each day.
   --------------------------------------------------------------------- */
window.nextOrderNo = function (storeCode) {
  const today = new Date().toISOString().slice(0, 10);
  const key = "arribas_orderno_" + storeCode;
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(key) || "{}");
  } catch (e) {
    data = {};
  }
  if (data.date !== today) data = { date: today, n: 0 };
  data.n += 1;
  localStorage.setItem(key, JSON.stringify(data));
  return storeCode + "-" + String(data.n).padStart(3, "0");
};

/* Short display code for the receiving screen.
   - New orders from the order tablet carry a friendly orderNo (e.g. SIL-014).
   - Older orders have none, so we derive a stable 4-digit code from the
     order id or, failing that, from the timestamp — so every order shows
     a usable number that never changes for that order. */
window.shortCode = function (order) {
  if (order.orderNo) return order.orderNo;
  const store = order.store || "";
  const fromId = String(order.orderId || order.id || "").replace(/\D/g, "");
  if (fromId.length >= 4) return store + "-" + fromId.slice(-4);
  const fromTime = String(order.time || "").replace(/\D/g, "");
  if (fromTime.length >= 4) return store + "-" + fromTime.slice(-4);
  return store || "—";
};

/* Sample orders for the receiving preview */
window.DEMO_ORDERS = [
  {
    orderId: "SIL-1718200000000", orderNo: "SIL-012", store: "SIL",
    guestName: "Tanaka", time: "11:42", total: 5200,
    items: [
      { style: "Double Silhouette", description: "Two people on one card", qty: 1, price: 3400, imageUrl: "" },
      { style: "Oval Frame", description: "Classic oval, gold edge", qty: 1, price: 1800, imageUrl: "" },
    ],
  },
  {
    orderId: "SIL-1718200600000", orderNo: "SIL-013", store: "SIL",
    guestName: "Garcia", time: "11:55", total: 1800,
    items: [{ style: "Single Silhouette", description: "One person, hand-cut profile", qty: 1, price: 1800, imageUrl: "" }],
  },
  {
    orderId: "MER-1718201000000", orderNo: "MER-008", store: "MER",
    guestName: "Lee", time: "12:03", total: 5500,
    items: [{ style: "Caricature · 2 People (Color)", description: "Two guests, full colour", qty: 1, price: 5500, imageUrl: "" }],
  },
];
