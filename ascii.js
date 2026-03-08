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

  const fontSize = Math.min(maxWidth / charCount, maxHeight / lineCount);
  pre.style.fontSize = fontSize + "px";
  pre.style.lineHeight = fontSize * 0.9 + "px";
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