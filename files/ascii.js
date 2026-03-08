const pre = document.getElementById("ascii-logo");
const wrap = pre.parentElement;

let i = 0;
let fps = 10;
let fpsInterval, then, animFrame;

// --- fitTextToContainer (measures exact font size to fit longest line) --------

function fitTextToContainer(text, fontFace, containerWidth) {
  const PIXEL_RATIO = getPixelRatio();
  let canvas = createHiDPICanvas(containerWidth, 0);
  let context = canvas.getContext("2d");
  let longestLine = getLongestLine(text.split("\n"));
  return getFittedFontSize(longestLine, fontFace);

  function getPixelRatio() {
    let ctx = document.createElement("canvas").getContext("2d");
    let dpr = window.devicePixelRatio || 1;
    let bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio  ||
              ctx.msBackingStorePixelRatio   ||
              ctx.oBackingStorePixelRatio    ||
              ctx.backingStorePixelRatio     || 1;
    return dpr / bsr;
  }

  function getLongestLine(lines) {
    let longest = -1, idx;
    lines.forEach((line, ii) => {
      let w = context.measureText(line).width;
      if (w > longest) {
        idx = ii;
        longest = w;
      }
    });
    return typeof idx === "number" ? lines[idx] : "";
  }

  function getFittedFontSize(text, fontFace) {
    const fits = () => context.measureText(text).width <= canvas.width;
    const font = (size, face) => `${size}px ${face}`;
    let fontSize = 300;
    do {
      fontSize--;
      context.font = font(fontSize, fontFace);
    } while (!fits());
    fontSize /= PIXEL_RATIO / 1.62;
    return fontSize;
  }

  function createHiDPICanvas(w, h) {
    let c = document.createElement("canvas");
    c.width  = w * PIXEL_RATIO;
    c.height = h * PIXEL_RATIO;
    c.style.width  = w + "px";
    c.style.height = h + "px";
    c.getContext("2d").setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
    return c;
  }
}

// --- layout ------------------------------------------------------------------

function layout() {
  const fontFace  = getComputedStyle(pre).fontFamily;
  const frame     = frames[0];
  const lines     = frame.split("\n");
  const lineCount = lines.length;

  const vvH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const vvW = window.visualViewport ? window.visualViewport.width  : window.innerWidth;

  const nav  = document.querySelector(".choices");
  const navH = nav ? nav.getBoundingClientRect().height : 24;
  const GAP   = 48; // 3rem
  const PAD_H = 32; // 2 × 1rem sides
  const PAD_V = 64; // 2 × 2rem top/bottom

  const maxW = vvW - PAD_H;
  const maxH = vvH - PAD_V - GAP - navH;

  // font size that makes the longest line exactly fill maxW
  const fontSizeByWidth = fitTextToContainer(frame, fontFace, maxW);

  // font size that makes all lines exactly fill maxH
  // lineHeight = fontSize * 0.9, so: lineCount * fontSize * 0.9 = maxH
  const fontSizeByHeight = maxH / (lineCount * 0.9);

  const fontSize   = Math.min(fontSizeByWidth, fontSizeByHeight);
  const lineHeight = fontSize * 0.9;

  pre.style.fontSize   = fontSize + "px";
  pre.style.lineHeight = lineHeight + "px";
  pre.style.transform  = "";
  wrap.style.width     = "";
  wrap.style.height    = "";
}

// --- animation ---------------------------------------------------------------

function step() {
  i = (i + 1) % frames.length;
  pre.textContent = frames[i];
}

function animate() {
  animFrame = requestAnimationFrame(animate);
  const now = Date.now();
  if (now - then > fpsInterval) {
    then = now - ((now - then) % fpsInterval);
    step();
  }
}

function start() {
  fpsInterval = 1000 / fps;
  then = Date.now();
  animate();
}

function debounce(fn, ms) {
  let t;
  return () => { clearTimeout(t); t = setTimeout(fn, ms); };
}

window.addEventListener("load", () => {
  pre.textContent = frames[0];
  layout();
  start();
});

window.addEventListener("resize", debounce(layout, 150));

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animFrame);
  } else {
    start();
  }
});
