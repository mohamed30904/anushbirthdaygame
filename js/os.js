// ============================================================
// ANUSHOS — boot cutscene + fake desktop shown before the 3D game starts.
// Pure DOM/CSS, no Three.js — sits in front of everything else
// (#os-layer, z-index 500) until "Start Game" is double-clicked, at which
// point this whole layer hides and the game's existing #blocker/Start
// screen underneath (already rendering, just covered) takes over exactly
// as it did before this feature existed.
//
// All the actual personalized content (notes, photos, folder structure)
// lives in OS_CONFIG in config.js — this file just renders whatever's in
// there and doesn't need to change when you edit your own notes/photos.
// ============================================================

import { OS_CONFIG } from "./config.js";

const osLayer = document.getElementById("os-layer");
const osBoot = document.getElementById("os-boot");
const bootLogo = document.getElementById("os-boot-logo");
const bootBarTrack = document.getElementById("os-boot-bar-track");
const bootBarFill = document.getElementById("os-boot-bar-fill");

const osLogin = document.getElementById("os-login");
const loginCard = document.getElementById("os-login-card");
const loginAvatar = document.getElementById("os-login-avatar");
const loginGreeting = document.getElementById("os-login-greeting");
const loginForm = document.getElementById("os-login-form");
const loginUsername = document.getElementById("os-login-username");
const loginPassword = document.getElementById("os-login-password");
const loginError = document.getElementById("os-login-error");

const osDesktop = document.getElementById("os-desktop");
const menubarClock = document.getElementById("os-menubar-clock");
const iconsContainer = document.getElementById("os-icons");
const dockContainer = document.getElementById("os-dock");
const windowsContainer = document.getElementById("os-windows");

const LOGIN = OS_CONFIG.login || {};
if (LOGIN.avatarImage) {
  loginAvatar.innerHTML = `<img class="os-login-avatar-img" src="${LOGIN.avatarImage}" alt="" />`;
} else {
  loginAvatar.textContent = LOGIN.avatar || "🙂";
}
loginGreeting.textContent = LOGIN.greeting || "Welcome back";

// ------------------------------------------------------------
// Boot sequence — just the "AnushOS" name and the progress bar, nothing
// else on screen.
// ------------------------------------------------------------
function runBootSequence() {
  requestAnimationFrame(() => {
    bootLogo.classList.add("show");
    bootBarTrack.classList.add("show");
  });

  const totalDuration = 2200; // ms for the bar to fill
  const startTime = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - startTime) / totalDuration);
    bootBarFill.style.width = `${t * 100}%`;
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      goToLogin();
    }
  }
  requestAnimationFrame(tick);
}

function goToLogin() {
  bootLogo.classList.remove("show");
  bootBarTrack.classList.remove("show");

  setTimeout(() => {
    osBoot.classList.add("fading");
    setTimeout(() => {
      osBoot.classList.add("hidden");
      osLogin.classList.remove("hidden");
      requestAnimationFrame(() => osLogin.classList.add("show"));
      loginUsername.focus();
    }, 800); // matches #os-boot's opacity transition duration
  }, 300);
}

// ------------------------------------------------------------
// Login screen — checked against OS_CONFIG.login (plain text, just for
// fun, not real security). Correct credentials fade into the desktop;
// wrong ones shake the card and show an error instead.
// ------------------------------------------------------------
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const enteredUser = loginUsername.value.trim().toLowerCase();
  const enteredPass = loginPassword.value;
  const expectedUser = (LOGIN.username || "").toLowerCase();
  const expectedPass = LOGIN.password || "";

  if (enteredUser === expectedUser && enteredPass === expectedPass) {
    loginError.textContent = "";
    revealDesktopFromLogin();
  } else {
    loginError.textContent = LOGIN.wrongPasswordMessage || "Incorrect username or password.";
    loginPassword.value = "";
    loginPassword.focus();
    loginCard.classList.remove("shake");
    void loginCard.offsetWidth; // restart the shake animation if triggered again
    loginCard.classList.add("shake");
  }
});

function revealDesktopFromLogin() {
  osLogin.classList.remove("show");
  setTimeout(() => {
    osLogin.classList.add("hidden");
    osDesktop.classList.remove("hidden");
    requestAnimationFrame(() => osDesktop.classList.add("show"));
  }, 700); // matches #os-login's opacity transition duration
}

// ------------------------------------------------------------
// Menu bar clock
// ------------------------------------------------------------
function updateClock() {
  const now = new Date();
  const montreal = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Montreal",
  });
  const yerevan = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Yerevan",
  });
  menubarClock.textContent = `MTL ${montreal}  ·  YEV ${yerevan}`;
}
updateClock();
setInterval(updateClock, 1000 * 15);

// ------------------------------------------------------------
// Icon rendering (desktop grid, dock, and inside folder windows)
// ------------------------------------------------------------
function createIconEl(cfg, { small } = {}) {
  const el = document.createElement("div");
  el.className = "os-icon";
  // Icons are normally just an emoji glyph, but some (like the desktop's
  // "Browser" icon) use an actual photo instead — cfg.iconImage takes
  // priority over cfg.icon when both/either are set.
  const glyphHtml = cfg.iconImage
    ? `<img class="os-icon-img" src="${cfg.iconImage}" alt="${cfg.label}" />`
    : cfg.icon;
  el.innerHTML = `
    <div class="os-icon-glyph"${small ? ' style="font-size:1.6em"' : ""}>${glyphHtml}</div>
    <div class="os-icon-label">${cfg.label}</div>
  `;
  // Unified double-click/double-tap detection via Pointer Events — native
  // "dblclick" is mouse-only and doesn't fire reliably (or at all) on
  // touch devices, so this handles mouse, touch, and pen the same way.
  let lastTap = 0;
  el.addEventListener("pointerup", () => {
    document.querySelectorAll(".os-icon.selected").forEach((n) => n.classList.remove("selected"));
    el.classList.add("selected");

    const now = Date.now();
    if (now - lastTap < 400) {
      lastTap = 0;
      activateIcon(cfg);
    } else {
      lastTap = now;
    }
  });
  return el;
}

function activateIcon(cfg) {
  if (cfg.type === "app" && cfg.action === "start-game") {
    launchGame();
    return;
  }
  openWindow(cfg);
}

function launchGame() {
  osLayer.classList.add("hidden");
}

// ------------------------------------------------------------
// Windows — draggable, closable, one per icon id (re-opening the same
// icon just brings its existing window to the front instead of stacking
// duplicates).
// ------------------------------------------------------------
const openWindows = new Map(); // id -> element
let zCounter = 10;
let cascadeCount = 0;

function bringToFront(win) {
  zCounter += 1;
  win.style.zIndex = zCounter;
}

// Pointer Events (not mouse/touch separately) so dragging works the same
// with a mouse, a trackpad, or a finger. setPointerCapture keeps the drag
// tracking this handle even if the finger moves faster than the window
// resizes, instead of "losing" the drag.
function makeDraggable(win, handle) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  handle.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains("os-window-dot")) return;
    dragging = true;
    bringToFront(win);
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  handle.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const maxX = window.innerWidth - win.offsetWidth;
    const maxY = window.innerHeight - 90;
    const x = Math.max(0, Math.min(maxX, e.clientX - offsetX));
    const y = Math.max(34, Math.min(maxY, e.clientY - offsetY));
    win.style.left = `${x}px`;
    win.style.top = `${y}px`;
  });

  const stopDragging = () => {
    dragging = false;
  };
  handle.addEventListener("pointerup", stopDragging);
  handle.addEventListener("pointercancel", stopDragging);
  handle.addEventListener("lostpointercapture", stopDragging);
}

function buildWindowContent(cfg) {
  const content = document.createElement("div");
  content.className = "os-window-content";

  if (cfg.type === "note") {
    content.textContent = cfg.content || "";
  } else if (cfg.type === "image") {
    const img = document.createElement("img");
    img.src = cfg.src;
    img.alt = cfg.label;
    content.appendChild(img);
  } else if (cfg.type === "folder") {
    content.classList.add("os-window-folder-grid");
    (cfg.children || []).forEach((child) => {
      content.appendChild(createIconEl(child, { small: false }));
    });
    if (!cfg.children || !cfg.children.length) {
      content.textContent = "Empty.";
      content.classList.remove("os-window-folder-grid");
    }
  }

  return content;
}

function openWindow(cfg) {
  const existing = openWindows.get(cfg.id);
  if (existing) {
    bringToFront(existing);
    return;
  }

  const win = document.createElement("div");
  win.className = "os-window" + (cfg.type === "note" ? " os-window-note" : "");

  const titlebar = document.createElement("div");
  titlebar.className = "os-window-titlebar";
  titlebar.innerHTML = `
    <div class="os-window-dot close" title="Close"></div>
    <div class="os-window-dot min"></div>
    <div class="os-window-dot zoom"></div>
    <div class="os-window-title">${cfg.icon || ""} ${cfg.label}</div>
  `;

  titlebar.querySelector(".os-window-dot.close").addEventListener("click", (e) => {
    e.stopPropagation();
    win.remove();
    openWindows.delete(cfg.id);
  });

  win.appendChild(titlebar);
  win.appendChild(buildWindowContent(cfg));
  windowsContainer.appendChild(win);

  // Cascade new windows diagonally from a starting point that scales down
  // on narrow (phone-width) screens instead of a fixed 140px offset that
  // could push a window mostly off-screen on a small viewport.
  const offset = (cascadeCount % 6) * 26;
  const baseLeft = Math.min(140, window.innerWidth * 0.12);
  const baseTop = Math.min(90, window.innerHeight * 0.1);
  const maxLeft = Math.max(0, window.innerWidth - 300);
  win.style.left = `${Math.min(baseLeft + offset, maxLeft)}px`;
  win.style.top = `${Math.min(baseTop + offset, window.innerHeight - 200)}px`;
  cascadeCount += 1;

  win.addEventListener("pointerdown", () => bringToFront(win));
  makeDraggable(win, titlebar);
  bringToFront(win);

  openWindows.set(cfg.id, win);
}

// ------------------------------------------------------------
// Populate the desktop icon grid + dock from OS_CONFIG
// ------------------------------------------------------------
(OS_CONFIG.desktopIcons || []).forEach((cfg) => {
  iconsContainer.appendChild(createIconEl(cfg));
});

const iconsById = new Map((OS_CONFIG.desktopIcons || []).map((cfg) => [cfg.id, cfg]));
(OS_CONFIG.dockIconIds || []).forEach((id) => {
  const cfg = iconsById.get(id);
  if (!cfg) return;
  const el = document.createElement("div");
  el.className = "os-dock-icon" + (cfg.id === "start-game" ? " is-start-game" : "");
  if (cfg.iconImage) {
    el.innerHTML = `<img class="os-dock-icon-img" src="${cfg.iconImage}" alt="${cfg.label}" />`;
  } else {
    el.textContent = cfg.icon;
  }
  el.title = cfg.label;
  el.addEventListener("click", () => activateIcon(cfg));
  dockContainer.appendChild(el);
});

runBootSequence();
