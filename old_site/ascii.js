const pre = document.getElementById("ascii-logo");
let i = 0;
let max = frames.length;
let fps = 10;
let fpsInterval, then;
let animFrame;

function getCharWidth(fontSize) {
  const ruler = document.createElement("pre");
  ruler.style.cssText = `
    position:absolute;visibility:hidden;top:-9999px;left:-9999px;
    font-family:${getComputedStyle(pre).fontFamily};
    font-size:${fontSize}px;line-height:1;white-space:pre;
  `;
  ruler.textContent = "X".repeat(100);
  document.body.appendChild(ruler);
  const w = ruler.getBoundingClientRect().width / 100;
  document.body.removeChild(ruler);
  return w;
}

function setPreCharSize() {
  const frame = frames[0];
  const lines = frame.split("\n");
  const longestLine = lines.reduce((a, b) => {
    return a.trimEnd().length > b.trimEnd().length ? a : b;
  });
  const charCount = longestLine.trimEnd().length;
  const lineCount = lines.length;

  const gate = pre.closest(".gate") || document.querySelector(".gate");
  const wrap = pre.parentElement;
  const nav = document.querySelector(".choices");

  pre.style.visibility = "hidden";
  pre.style.fontSize = "0px";
  pre.style.lineHeight = "0px";
  pre.style.transform = "";
  wrap.style.width = "";
  wrap.style.height = "";

  const gateStyle = getComputedStyle(gate);
  const paddingV = parseFloat(gateStyle.paddingTop) + parseFloat(gateStyle.paddingBottom);
  const paddingH = parseFloat(gateStyle.paddingLeft) + parseFloat(gateStyle.paddingRight);

  const navRect = nav ? nav.getBoundingClientRect() : null;
  const navHeight = navRect ? navRect.height : 80;

  const vvH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const gap = 48;
  const maxWidth = gate.clientWidth - paddingH;
  const maxHeight = vvH - paddingV - navHeight - gap;

  const BASE = 16;
  const charW = getCharWidth(BASE);
  const charH = BASE * 0.9;
  const naturalW = charCount * charW;
  const naturalH = lineCount * charH;

  const scale = Math.min(maxWidth / naturalW, maxHeight / naturalH);

  const layoutW = naturalW * scale;
  const layoutH = naturalH * scale;

  wrap.style.width = layoutW + "px";
  wrap.style.height = layoutH + "px";

  pre.style.fontSize = BASE + "px";
  pre.style.lineHeight = charH + "px";
  pre.style.transformOrigin = "