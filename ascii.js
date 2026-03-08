const pre = document.getElementById("ascii-logo");
let i = 0;
let max = frames.length;
let fps = 10;
let fpsInterval, then;
let animFrame;

function setPreCharSize() {
  const frame = frames[0];
  const lines = frame.split("\n");
  const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b);
  const charCount = longestLine.length;
  const lineCount = lines.length;

  const gate = pre.closest(".gate") || document.querySelector(".gate");
  const nav = document.querySelector(".choices");

  pre.style.fontSize = "";
  pre.style.lineHeight = "";

  const gateStyle = getComputedStyle(gate);
  const paddingV = parseFloat(gateStyle.paddingTop) + parseFloat(gateStyle.paddingBottom);
  const paddingH = parseFloat(gateStyle.paddingLeft) + parseFloat(gateStyle.paddingRight);
  const navHeight = nav
    ? nav.getBoundingClientRect().height + parseFloat(gateStyle.gap || 48)
    : 80;

  const maxWidth = gate.clientWidth - paddingH;
  const maxHeight = gate.clientHeight - paddingV - navHeight;

  const sizeByWidth = maxWidth / charCount;
  const sizeByHeight = maxHeight / lineCount;
  const fontSize = Math.min(sizeByWidth, sizeByHeight);

  pre.style.fontSize = fontSize + "px";
  pre.style.lineHeight = fontSize * 0.9 + "px";

  // --- DIAGNOSTICS ---
  const info = {
    charCount,
    lineCount,
    gateClientW: gate.clientWidth,
    gateClientH: gate.clientHeight,
    paddingH,
    paddingV,
    navHeight,
    maxWidth,
    maxHeight,
    sizeByWidth: sizeByWidth.toFixed(3),
    sizeByHeight: sizeByHeight.toFixed(3),
    fontSize: fontSize.toFixed(3),
    windowInnerW: window.innerWidth,
    windowInnerH: window.innerHeight,
    vvW: window.visualViewport?.width,
    vvH: window.visualViewport?.height,
    devicePixelRatio: window.devicePixelRatio,
    screenW: screen.width,
    screenH: screen.height,
  };

  // Print to console
  console.table(info);

  // Also render into page so you can see it without devtools
  let dbg = document.getElementById("dbg");
  if (!dbg) {
    dbg = document.createElement("pre");
    dbg.id = "dbg";
    dbg.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,0.85);
      color: #0f0;
      font-size: 10px;
      line-height: 1.4;
      padding: 6px 8px;
      z-index: 9999;
      pointer-events: none;
      white-space: pre-wrap;
    `;
    document.body.appendChild(dbg);
  }
  dbg.textContent = Object.entries(info)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  // Also shove key values into the title for a quick glance
  document.title = `fs:${fontSize.toFixed(2)} gW:${gate.clientWidth} gH:${gate.clientHeight} vvH:${window.visualViewport?.height|0}`;
}

function startAnimating() {
  fpsInterval = 1000 / fps;
  then = Date.now();
  animate();
}

function animate() {
  animFrame = requestAnimationFrame(animate);
  const now = Date.now();
  if (now - then > fpsInterval) {
    then = now - ((now - then) % fpsInterval);
    step();
  }
}

function step() {
  i = (i + 1) % max;
  pre.textContent = frames[i];
}

function debounce(fn, delay) {
  let t;
  return function () {
    clearTimeout(t);
    t = setTimeout(fn, delay);
  };
}

window.addEventListener("load", () => {
  pre.textContent = frames[0];
  setPreCharSize();
  startAnimating();
});

window.addEventListener("resize", debounce(setPreCharSize, 200));

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animFrame);
  } else {
    startAnimating();
  }
});