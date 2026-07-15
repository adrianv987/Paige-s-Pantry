/* ===================================================================
   PAIGE'S PANTRY — SCRIPT.JS
   Vanilla JS only. Handles:
     1. Menu data + rendering product cards
     2. Order state (add / remove / change qty) + live ticket render
     3. Category tab filtering
     4. Mobile nav toggle + smooth scroll
     5. Enquiry form validation + fake "submit" with order summary
   =================================================================== */

(() => {
  "use strict";

  /* -----------------------------------------------------------------
     0. FORM SUBMISSION CONFIG (FormSubmit — https://formsubmit.co)
     Replace this with Paige's real inbox address. The form posts here
     via fetch() so the page never reloads. NOTE: the first-ever
     submission to a brand-new address triggers a one-time "confirm
     this form" email from FormSubmit — click that link once and every
     submission after it lands straight in the inbox.
     ----------------------------------------------------------------- */
  const FORMSUBMIT_EMAIL = "paiges.pantry@outlook.com";
  const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`;

  /* -----------------------------------------------------------------
     1. MENU DATA
     Swap descriptions/prices here whenever the real menu changes —
     everything below (cards, order ticket, summary) reads from this.
     ----------------------------------------------------------------- */
  const MENU = [
    // ---- Standard Muffins ----
    // To add a new flavour: copy one line, change the id, name and desc. Prices update instantly everywhere.
    { id: "sm-double-choc",     category: "standard-muffins", name: "Double Choc",              desc: "Rich chocolate batter with dark choc and milk choc chips throughout.", packs: { halfDozen: { label: "Half Dozen (6)", price: 25.00 }, dozen: { label: "Dozen (12)", price: 45.00 } } },
    { id: "sm-blueberry",       category: "standard-muffins", name: "Blueberry",                desc: "Blueberries throughout a soft vanilla crumb, finished with a crumble top.", packs: { halfDozen: { label: "Half Dozen (6)", price: 25.00 }, dozen: { label: "Dozen (12)", price: 45.00 } } },
    { id: "sm-apple-cinnamon",  category: "standard-muffins", name: "Apple Cinnamon",           desc: "Chunks of apple and warm cinnamon spice, finished with a streusel crumble.", packs: { halfDozen: { label: "Half Dozen (6)", price: 25.00 }, dozen: { label: "Dozen (12)", price: 45.00 } } },
    { id: "sm-choc-chip",       category: "standard-muffins", name: "Choc Chip",                desc: "Buttery vanilla muffin loaded with milk chocolate chips.", packs: { halfDozen: { label: "Half Dozen (6)", price: 25.00 }, dozen: { label: "Dozen (12)", price: 45.00 } } },
    { id: "sm-crumb-cake",      category: "standard-muffins", name: "Crumb Cake",               desc: "Soft vanilla muffin topped with a thick cinnamon streusel crumb.", packs: { halfDozen: { label: "Half Dozen (6)", price: 25.00 }, dozen: { label: "Dozen (12)", price: 45.00 } } },
    { id: "sm-lemon-poppy",     category: "standard-muffins", name: "Lemon Poppyseed",          desc: "Zesty lemon zest with crunchy poppyseed and a light lemon drizzle.", packs: { halfDozen: { label: "Half Dozen (6)", price: 25.00 }, dozen: { label: "Dozen (12)", price: 45.00 } } },
    { id: "sm-rasp-white-choc", category: "standard-muffins", name: "Raspberry White Choc",     desc: "Tart raspberries and creamy white chocolate chunks in every bite.", packs: { halfDozen: { label: "Half Dozen (6)", price: 25.00 }, dozen: { label: "Dozen (12)", price: 45.00 } } },
    { id: "sm-strawberry-sc",   category: "standard-muffins", name: "Strawberry Shortcake",     desc: "Diced strawberry through a light vanilla crumb with a sugared top.", packs: { halfDozen: { label: "Half Dozen (6)", price: 25.00 }, dozen: { label: "Dozen (12)", price: 45.00 } } },
    { id: "sm-nutella",         category: "standard-muffins", name: "Nutella",                  desc: "Soft vanilla muffin with a hidden Nutella centre.", packs: { halfDozen: { label: "Half Dozen (6)", price: 25.00 }, dozen: { label: "Dozen (12)", price: 45.00 } } },
    { id: "sm-peach-cobbler",   category: "standard-muffins", name: "Peach Cobbler",            desc: "Juicy peach pieces in a spiced crumb with a buttery cobbler top.", packs: { halfDozen: { label: "Half Dozen (6)", price: 25.00 }, dozen: { label: "Dozen (12)", price: 45.00 } } },
    { id: "sm-orange-bp",       category: "standard-muffins", name: "Orange Blackberry Poppyseed", desc: "Fresh orange zest, whole blackberries and poppyseed in a light crumb.", packs: { halfDozen: { label: "Half Dozen (6)", price: 25.00 }, dozen: { label: "Dozen (12)", price: 45.00 } } },

    // ---- Gourmet Muffins ----
    { id: "gm-chai",         category: "gourmet-muffins", name: "Chai Spice",          desc: "Warmly spiced chai batter with cinnamon, cardamom and ginger, topped with a whipped ganache.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },
    { id: "gm-cookies-cream",category: "gourmet-muffins", name: "Cookies & Cream",     desc: "Oreo-studded vanilla batter with a cream filling and crumbled cookie top.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },
    { id: "gm-biscoff",     category: "gourmet-muffins", name: "Biscoff",              desc: "Vanilla muffin with a Biscoff filling inside, finished with a Biscoff biscuit on top.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },
    { id: "gm-kinder",      category: "gourmet-muffins", name: "Kinder Bueno",         desc: "Vanilla hazelnut batter with a Kinder Bueno centre and Kinder Bueno drizzle.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },
    { id: "gm-banoffee",    category: "gourmet-muffins", name: "Banoffee",             desc: "Banana muffin with a dulce de leche centre, whipped white chocolate ganache and a banana piece on top.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },
    { id: "gm-creme-brulee",category: "gourmet-muffins", name: "Crème Brûlée",        desc: "Vanilla muffin with a vanilla custard centre and a caramelised sugar top.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },
    { id: "gm-lemon-mer",   category: "gourmet-muffins", name: "Lemon Meringue",       desc: "Sharp lemon curd centre with toasted meringue piped on top.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },
    { id: "gm-pavlova",     category: "gourmet-muffins", name: "Pavlova",              desc: "Light vanilla muffin with whipped white chocolate ganache, passionfruit coulis and fresh fruit on top.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },
    { id: "gm-fairy-bread", category: "gourmet-muffins", name: "Fairy Bread",          desc: "Vanilla muffin with white chocolate ganache, hundreds & thousands, and a fairy bread biscuit on top.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },
    { id: "gm-iced-vovo",   category: "gourmet-muffins", name: "Iced Vovo",            desc: "Raspberry jam centre with coconut, a pink marshmallow fluff top and an Iced Vovo biscuit.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },
    { id: "gm-tim-tam",     category: "gourmet-muffins", name: "Tim Tam",              desc: "Milk chocolate muffin with a chocolate centre, whipped chocolate ganache and a Tim Tam on top.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },
    { id: "gm-lamington",   category: "gourmet-muffins", name: "Lamington",            desc: "Vanilla muffin with a jam filling, dipped in chocolate and finished in desiccated coconut.", packs: { halfDozen: { label: "Half Dozen (6)", price: 35.00 }, dozen: { label: "Dozen (12)", price: 65.00 } } },

    // ---- Slices ----
    { id: "s-caramel",      category: "slices", name: "Caramel Slice",        desc: "Biscuit base, slow-cooked caramel, milk chocolate top.", packs: { smallBox: { label: "Small Box (8)", price: 40.00 }, fullBox: { label: "Full Box (16)", price: 70.00 } } },
    { id: "s-nutella",      category: "slices", name: "Nutella Crumble Slice", desc: "Oat crumble base with a thick, fudgy Nutella top.", packs: { smallBox: { label: "Small Box (8)", price: 40.00 }, fullBox: { label: "Full Box (16)", price: 70.00 } } },
    { id: "s-vanilla",      category: "slices", name: "Vanilla Slice",        desc: "Set custard and cream between flaky pastry, topped with a zesty passionfruit icing.", packs: { smallBox: { label: "Small Box (8)", price: 40.00 }, fullBox: { label: "Full Box (16)", price: 70.00 } } },
    { id: "s-cookie-butter",category: "slices", name: "Cookie Butter Slice",  desc: "Biscuit base with a Biscoff cookie butter filling and crumb top.", packs: { smallBox: { label: "Small Box (8)", price: 40.00 }, fullBox: { label: "Full Box (16)", price: 70.00 } } },
    { id: "s-lemon-bar",    category: "slices", name: "Lemon Bar",            desc: "Buttery shortbread base with a sharp, set lemon curd topping.", packs: { smallBox: { label: "Small Box (8)", price: 40.00 }, fullBox: { label: "Full Box (16)", price: 70.00 } } },

    // ---- Cakesicles ----
    { id: "cs-red-velvet",  category: "cakesicles", name: "Red Velvet",       desc: "Red velvet cake coated in a smooth white chocolate shell.", packs: { halfDozen: { label: "Half Dozen (6)", price: 30.00 }, dozen: { label: "Dozen (12)", price: 55.00 } } },
    { id: "cs-choc-mud",    category: "cakesicles", name: "Chocolate Mud",    desc: "Dense chocolate mud cake dipped in milk chocolate.", packs: { halfDozen: { label: "Half Dozen (6)", price: 30.00 }, dozen: { label: "Dozen (12)", price: 55.00 } } },
    { id: "cs-french-van",  category: "cakesicles", name: "French Vanilla",   desc: "Vanilla bean cake in a white chocolate shell.", packs: { halfDozen: { label: "Half Dozen (6)", price: 30.00 }, dozen: { label: "Dozen (12)", price: 55.00 } } },
    { id: "cs-funfetti",    category: "cakesicles", name: "Hundreds & Thousands", desc: "Sprinkle-filled vanilla cake with a colourful white chocolate coat.", packs: { halfDozen: { label: "Half Dozen (6)", price: 30.00 }, dozen: { label: "Dozen (12)", price: 55.00 } } },
    { id: "cs-strawberry",  category: "cakesicles", name: "Strawberry",       desc: "Strawberry cake dipped in pink white chocolate.", packs: { halfDozen: { label: "Half Dozen (6)", price: 30.00 }, dozen: { label: "Dozen (12)", price: 55.00 } } },
    { id: "cs-lemon",       category: "cakesicles", name: "Lemon",            desc: "Zesty lemon cake in a white chocolate shell with a lemon drizzle.", packs: { halfDozen: { label: "Half Dozen (6)", price: 30.00 }, dozen: { label: "Dozen (12)", price: 55.00 } } },
    { id: "cs-caramel",     category: "cakesicles", name: "Caramel",          desc: "Caramel cake with a milk chocolate shell.", packs: { halfDozen: { label: "Half Dozen (6)", price: 30.00 }, dozen: { label: "Dozen (12)", price: 55.00 } } },
  ];

  const CATEGORY_LABELS = {
    "standard-muffins": "Standard Muffins",
    "gourmet-muffins":  "Gourmet Muffins",
    slices:             "Slices",
    cakesicles:         "Cakesicles",
    seasonal:           "Seasonal Specials",
  };

  /* -----------------------------------------------------------------
     2. ORDER STATE
     order = [{ id, packSize, qty }]  — qty here counts PACKS (half
     dozen or dozen), not individual treats, since nothing is sold
     individually online. Item/pack details are looked up from MENU
     by id + packSize so there's a single source of truth.
     ----------------------------------------------------------------- */
  let order = [];

  function findMenuItem(id) {
    return MENU.find((item) => item.id === id);
  }

  function getPackInfo(id, packSize) {
    const item = findMenuItem(id);
    if (!item) return null;
    return item.packs[packSize] || null;
  }

  function findOrderLine(id, packSize) {
    return order.find((line) => line.id === id && line.packSize === packSize);
  }

  function addToOrder(id, packSize) {
    const existing = findOrderLine(id, packSize);
    if (existing) {
      existing.qty += 1;
    } else {
      order.push({ id, packSize, qty: 1 });
    }
    renderOrder();
    updateCardOrderState(id);
    animateBadge();
    syncFloatingBtnState();
    const item = findMenuItem(id);
    const pack = getPackInfo(id, packSize);
    showToast(`Added ${item.name} — ${pack.label} to your order`);
  }

  function changeQty(id, packSize, delta) {
    const line = findOrderLine(id, packSize);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) {
      removeFromOrder(id, packSize);
      return;
    }
    renderOrder();
    updateCardOrderState(id);
  }

  function removeFromOrder(id, packSize) {
    order = order.filter((line) => !(line.id === id && line.packSize === packSize));
    renderOrder();
    updateCardOrderState(id);
    syncFloatingBtnState();
  }

  function getOrderTotals() {
    let count = 0;
    let price = 0;
    order.forEach((line) => {
      const pack = getPackInfo(line.id, line.packSize);
      if (!pack) return;
      count += line.qty;
      price += pack.price * line.qty;
    });
    return { count, price };
  }

  // total packs (any size) currently in the order for a given item —
  // used to show "2 packs in your order" on the menu card
  function getItemPackCount(id) {
    return order
      .filter((line) => line.id === id)
      .reduce((sum, line) => sum + line.qty, 0);
  }

  /* -----------------------------------------------------------------
     3. RENDER: MENU CARDS
     ----------------------------------------------------------------- */
  function renderMenu() {
    const groups = ["standard-muffins", "gourmet-muffins", "slices", "cakesicles", "seasonal"];
    groups.forEach((cat) => {
      const grid = document.getElementById(`grid-${cat}`);
      if (!grid) return;
      grid.innerHTML = "";
      MENU.filter((item) => item.category === cat).forEach((item) => {
        grid.appendChild(buildProductCard(item));
      });
    });
  }

  function buildProductCard(item) {
    const card = document.createElement("article");
    card.className = `product-card product-card--${item.category}`;
    card.dataset.itemId = item.id;

    const packCount = getItemPackCount(item.id);

    card.innerHTML = `
      ${item.badge ? `<span class="product-badge">${escapeHTML(item.badge)}</span>` : ""}
      <div class="product-card-top">
        <h4 class="product-name">${escapeHTML(item.name)}</h4>
      </div>
      <p class="product-desc">${escapeHTML(item.desc)}</p>
      <fieldset class="pack-options">
        <legend class="sr-only">Pack size for ${escapeHTML(item.name)}</legend>
        ${Object.entries(item.packs).map(([size, pack], i) => `
          <label class="pack-option">
            <input type="radio" name="pack-${item.id}" value="${size}" ${i === 0 ? "checked" : ""}>
            <span>${escapeHTML(pack.label)} — $${pack.price.toFixed(2)}</span>
          </label>
        `).join("")}
      </fieldset>
      <div class="product-foot">
        <span class="qty-tag" data-role="qty-tag">${packCount > 0 ? `${packCount} pack${packCount > 1 ? "s" : ""} in your order` : ""}</span>
        <button type="button" class="add-btn ${packCount > 0 ? "is-added" : ""}" data-add-id="${item.id}">
          <span aria-hidden="true">${packCount > 0 ? "✓" : "+"}</span> ${packCount > 0 ? "Add Another" : "Add to Order"}
        </button>
      </div>
    `;
    return card;
  }

  // Updates just the qty-tag + add button on an already-rendered card,
  // without touching the pack-size radios — so the person's pack
  // selection isn't reset every time they add something.
  function updateCardOrderState(id) {
    const card = document.querySelector(`.product-card[data-item-id="${id}"]`);
    if (!card) return;
    const packCount = getItemPackCount(id);
    const tag = card.querySelector('[data-role="qty-tag"]');
    const btn = card.querySelector("[data-add-id]");
    if (tag) tag.textContent = packCount > 0 ? `${packCount} pack${packCount > 1 ? "s" : ""} in your order` : "";
    if (btn) {
      btn.classList.toggle("is-added", packCount > 0);
      btn.innerHTML = `<span aria-hidden="true">${packCount > 0 ? "✓" : "+"}</span> ${packCount > 0 ? "Add Another" : "Add to Order"}`;
    }
  }

  /* -----------------------------------------------------------------
     4. RENDER: ORDER TICKET
     ----------------------------------------------------------------- */
  function renderOrder() {
    const list = document.getElementById("orderList");
    const empty = document.getElementById("orderEmpty");
    list.innerHTML = "";

    if (order.length === 0) {
      empty.style.display = "block";
    } else {
      empty.style.display = "none";
      order.forEach((line) => {
        const item = findMenuItem(line.id);
        const pack = getPackInfo(line.id, line.packSize);
        if (!item || !pack) return;
        const li = document.createElement("li");
        li.className = "order-line";
        const subtotal = (pack.price * line.qty).toFixed(2);
        li.innerHTML = `
          <span class="order-line-name">${escapeHTML(item.name)}<small>${escapeHTML(pack.label)} — $${pack.price.toFixed(2)}</small></span>
          <span class="order-line-qty">
            <button type="button" class="qty-btn" data-qty-id="${item.id}" data-pack-size="${line.packSize}" data-delta="-1" aria-label="Decrease quantity">−</button>
            <span aria-live="polite">${line.qty}</span>
            <button type="button" class="qty-btn" data-qty-id="${item.id}" data-pack-size="${line.packSize}" data-delta="1" aria-label="Increase quantity">+</button>
          </span>
          <span class="order-line-sub">$${subtotal}</span>
          <button type="button" class="remove-btn" data-remove-id="${item.id}" data-pack-size="${line.packSize}" aria-label="Remove ${escapeHTML(item.name)} (${escapeHTML(pack.label)}) from order">✕</button>
        `;
        list.appendChild(li);
      });
    }

    const { count, price } = getOrderTotals();
    document.getElementById("orderTotalCount").textContent = count;
    document.getElementById("orderTotalPrice").textContent = `$${price.toFixed(2)}`;
    document.getElementById("navOrderCount").textContent = count;
    document.getElementById("floatingOrderCount").textContent = count;

    updateOrderSummaryPreview();
  }

  /* -----------------------------------------------------------------
     5. ORDER SUMMARY STRING (used in the form + could be emailed)
     ----------------------------------------------------------------- */
  function buildOrderSummaryText() {
    if (order.length === 0) {
      return "No items added yet.";
    }
    const lines = order.map((line) => {
      const item = findMenuItem(line.id);
      const pack = getPackInfo(line.id, line.packSize);
      if (!item || !pack) return "";
      return `• ${item.name} — ${pack.label} x${line.qty} — $${(pack.price * line.qty).toFixed(2)}`;
    });
    const { count, price } = getOrderTotals();
    lines.push("");
    lines.push(`Total packs: ${count}`);
    lines.push(`Estimated total: $${price.toFixed(2)}`);
    return lines.join("\n");
  }

  function updateOrderSummaryPreview() {
    const preview = document.getElementById("orderSummaryPreview");
    if (!preview) return;
    preview.value = buildOrderSummaryText();
    preview.style.height = "auto";
    preview.style.height = preview.scrollHeight + "px";
  }

  /* -----------------------------------------------------------------
     6. CATEGORY TABS
     ----------------------------------------------------------------- */
  function initMenuTabs() {
    const tabs = document.querySelectorAll(".menu-tab");
    const groups = document.querySelectorAll(".menu-group");

    function applyCategory(cat) {
      tabs.forEach((t) => {
        const active = t.dataset.category === cat;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      groups.forEach((group) => {
        const show = group.dataset.group === cat;
        group.hidden = !show;
        if (show) {
          group.classList.add("tab-entering");
          group.addEventListener("animationend", () => group.classList.remove("tab-entering"), { once: true });
          staggerCards(group);
        }
      });
    }

    // set initial state to whichever tab is marked active in the HTML
    const activeTab = document.querySelector(".menu-tab.is-active");
    if (activeTab) applyCategory(activeTab.dataset.category);

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => applyCategory(tab.dataset.category));
    });

    // Scroll hint: show/hide arrows and gradients as user scrolls
    const tabsEl = document.getElementById("menuTabs");
    const scrollWrap = tabsEl && tabsEl.parentElement;
    if (tabsEl && scrollWrap) {

      // Custom easing scroll — smoother than browser's built-in on mobile
      function smoothScrollTo(el, target, duration) {
        const start = el.scrollLeft;
        const dist  = target - start;
        if (Math.abs(dist) < 1) return;
        const t0 = performance.now();
        function ease(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }
        function step(now) {
          const t = Math.min((now - t0) / duration, 1);
          el.scrollLeft = start + dist * ease(t);
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }

      function updateScrollHint() {
        const hasOverflow = tabsEl.scrollWidth > tabsEl.clientWidth + 4;
        const atEnd   = tabsEl.scrollLeft + tabsEl.clientWidth >= tabsEl.scrollWidth - 4;
        const atStart = tabsEl.scrollLeft <= 4;
        scrollWrap.classList.toggle("is-end",   !hasOverflow || atEnd);
        scrollWrap.classList.toggle("is-start", atStart);
      }

      tabsEl.addEventListener("scroll", updateScrollHint, { passive: true });
      window.addEventListener("resize",  updateScrollHint, { passive: true });
      updateScrollHint();

      const step      = () => tabsEl.clientWidth * 0.65;
      const maxScroll = () => tabsEl.scrollWidth - tabsEl.clientWidth;

      const arrowRight = document.getElementById("menuTabsArrow");
      const arrowLeft  = document.getElementById("menuTabsArrowLeft");

      // Clamp to true start/end so the last tab always sits flush at the right edge
      if (arrowRight) arrowRight.addEventListener("click", () => {
        smoothScrollTo(tabsEl, Math.min(tabsEl.scrollLeft + step(), maxScroll()), 420);
      });
      if (arrowLeft) arrowLeft.addEventListener("click", () => {
        smoothScrollTo(tabsEl, Math.max(tabsEl.scrollLeft - step(), 0), 420);
      });
    }
  }

  /* -----------------------------------------------------------------
     7. NAV: mobile toggle + smooth scroll + scroll-to-order shortcuts
     ----------------------------------------------------------------- */
  function initNav() {
    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");

    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // close mobile nav after a link is tapped
    mainNav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.getElementById("heroCta").addEventListener("click", () => {
      document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("navOrderPill").addEventListener("click", () => {
      document.getElementById("order-builder").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("floatingOrderBtn").addEventListener("click", () => {
      document.getElementById("order-builder").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* -----------------------------------------------------------------
     8. EVENT DELEGATION: add / qty / remove buttons (menu + ticket)
     ----------------------------------------------------------------- */
  function initOrderEvents() {
    document.addEventListener("click", (e) => {
      const addBtn = e.target.closest("[data-add-id]");
      if (addBtn) {
        const card = addBtn.closest(".product-card");
        const checkedRadio = card ? card.querySelector("input[type='radio']:checked") : null;
        const packSize = checkedRadio ? checkedRadio.value : null;
        if (packSize) addToOrder(addBtn.dataset.addId, packSize);
        return;
      }
      const qtyBtn = e.target.closest("[data-qty-id]");
      if (qtyBtn) {
        changeQty(qtyBtn.dataset.qtyId, qtyBtn.dataset.packSize, Number(qtyBtn.dataset.delta));
        return;
      }
      const removeBtn = e.target.closest("[data-remove-id]");
      if (removeBtn) {
        removeFromOrder(removeBtn.dataset.removeId, removeBtn.dataset.packSize);
        return;
      }
    });
  }

  /* -----------------------------------------------------------------
     9. TOAST NOTIFICATIONS
     ----------------------------------------------------------------- */
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  /* -----------------------------------------------------------------
     10. ENQUIRY FORM: validation + fake submit
     ----------------------------------------------------------------- */
  function initEnquiryForm() {
    const form = document.getElementById("enquiryForm");
    const nameInput = document.getElementById("custName");
    const emailInput = document.getElementById("custEmail");
    const phoneInput = document.getElementById("custPhone");
    const confirmation = document.getElementById("formConfirmation");

    // keep the read-only summary box fresh even before any items are added
    updateOrderSummaryPreview();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      confirmation.classList.remove("is-visible", "is-error", "is-sending");

      let isValid = true;

      // Name required
      if (!nameInput.value.trim()) {
        setFieldError(nameInput, "err-custName", "Please tell Paige your name.");
        isValid = false;
      } else {
        clearFieldError(nameInput, "err-custName");
      }

      // Email required + valid format
      const emailValue = emailInput.value.trim();
      if (!emailValue) {
        setFieldError(emailInput, "err-custEmail", "An email address is needed so Paige can reach you.");
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        setFieldError(emailInput, "err-custEmail", "That doesn't look like a valid email — double check it?");
        isValid = false;
      } else {
        clearFieldError(emailInput, "err-custEmail");
      }

      // Phone required + loosely valid
      const phoneValue = phoneInput.value.trim();
      if (!phoneValue) {
        setFieldError(phoneInput, "err-custPhone", "A phone number helps Paige confirm your order quickly.");
        isValid = false;
      } else if (!/^[+0-9()\-\s]{6,}$/.test(phoneValue)) {
        setFieldError(phoneInput, "err-custPhone", "That doesn't look like a valid phone number — double check it?");
        isValid = false;
      } else {
        clearFieldError(phoneInput, "err-custPhone");
      }

      if (!isValid) {
        const firstError = form.querySelector(".has-error");
        if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Make sure the hidden summary field reflects the current order
      // before it's gathered into the request.
      updateOrderSummaryPreview();

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      confirmation.textContent = "Sending your order to Paige…";
      confirmation.classList.add("is-visible", "is-sending");

      const formData = new FormData(form);
      // Give the email a subject line that actually identifies the customer
      formData.set("_subject", `New order enquiry from ${nameInput.value.trim()} — Paige's Pantry`);

      fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) throw new Error("Request failed");
          return response;
        })
        .then(() => {
          confirmation.classList.remove("is-sending", "is-error");
          confirmation.textContent = "Thanks! Paige will be in touch shortly to confirm your order.";
          confirmation.classList.add("is-visible");

          // reset the form + the order, since the enquiry has been sent
          form.reset();
          order = [];
          renderOrder();
          renderMenu();
          confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch((error) => {
          console.error("FormSubmit request failed:", error);
          confirmation.classList.remove("is-sending");
          confirmation.classList.add("is-visible", "is-error");
          confirmation.textContent =
            "Something went wrong sending that — please try again, or reach out directly while we sort it out.";
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit Order Enquiry";
        });
    });

    // live-clear errors as the person types
    nameInput.addEventListener("input", () => clearFieldError(nameInput, "err-custName"));
    emailInput.addEventListener("input", () => clearFieldError(emailInput, "err-custEmail"));
    phoneInput.addEventListener("input", () => clearFieldError(phoneInput, "err-custPhone"));
  }

  function setFieldError(input, errorId, message) {
    input.classList.add("has-error");
    document.getElementById(errorId).textContent = message;
  }
  function clearFieldError(input, errorId) {
    input.classList.remove("has-error");
    document.getElementById(errorId).textContent = "";
  }

  /* -----------------------------------------------------------------
     11. MISC HELPERS
     ----------------------------------------------------------------- */
  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* -----------------------------------------------------------------
     12. INIT
     ----------------------------------------------------------------- */
  /* -----------------------------------------------------------------
     13. ANIMATIONS
     ----------------------------------------------------------------- */

  // Badge pop — call whenever the order count changes
  function animateBadge() {
    ["navOrderCount", "floatingOrderCount"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove("is-popping");
      void el.offsetWidth; // force reflow so animation restarts
      el.classList.add("is-popping");
      el.addEventListener("animationend", () => el.classList.remove("is-popping"), { once: true });
    });
  }

  // Floating button glow when order has items
  function syncFloatingBtnState() {
    const btn = document.getElementById("floatingOrderBtn");
    if (!btn) return;
    btn.classList.toggle("has-items", order.length > 0);
  }

  // Card stagger — called by initMenuTabs when a category becomes active
  function staggerCards(groupEl) {
    const cards = groupEl.querySelectorAll(".product-card");
    cards.forEach((card, i) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(16px)";
      card.style.transition = "none";
      // Double rAF ensures the browser registers the reset before animating
      requestAnimationFrame(() => requestAnimationFrame(() => {
        card.style.transition = `opacity 0.38s ease ${i * 0.045}s, transform 0.38s ease ${i * 0.045}s`;
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }));
    });
  }

  // Scroll reveal — fade-up sections as they enter the viewport
  function initScrollReveal() {
    const targets = [
      ".about-inner",
      ".order-builder-inner",
      ".footer-top",
      ".footer-bottom",
      ".menu-group-title",
      ".menu-group-sub",
      ".order-builder-intro",
    ];
    const els = document.querySelectorAll(targets.join(","));
    els.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach((el) => observer.observe(el));
  }

  // Footer offering links — navigate to menu and switch to the right tab
  function initFooterMenuLinks() {
    document.querySelectorAll("[data-menu-category]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const cat = link.dataset.menuCategory;
        // Switch the tab
        const tab = document.querySelector(`.menu-tab[data-category="${cat}"]`);
        if (tab) tab.click();
        // Then scroll to the menu section
        document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // Nav scroll shadow
  function initNavScroll() {
    const header = document.getElementById("siteHeader");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // Nav active link — highlights which section the user is currently reading
  function initNavActiveOnScroll() {
    const sectionIds = ["home", "menu", "order-builder", "about"];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const navLinks = document.querySelectorAll(".nav-link");

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-20% 0px -60% 0px", threshold: 0 });

    sections.forEach(s => io.observe(s));
  }

  /* -----------------------------------------------------------------
     12. INIT
     ----------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("footerYear").textContent = new Date().getFullYear();
    renderMenu();
    renderOrder();
    initMenuTabs();
    initNav();
    initOrderEvents();
    initEnquiryForm();
    initScrollReveal();
    initNavScroll();
    initNavActiveOnScroll();
    initFooterMenuLinks();
  });
})();