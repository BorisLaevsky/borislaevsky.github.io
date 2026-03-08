const pre = document.getElementById("ascii-logo");

let i = 0;
let max = frames.length;

/* slower animation */
let fps = 8;

let fpsInterval, then;
let animFrame;

window.addEventListener("load", () => {

pre.textContent = frames[0];

setPreCharSize();
startAnimating();

});

window.addEventListener("resize", debounce(setPreCharSize,200));

function setPreCharSize(){

const frame = frames[0];
const lines = frame.split("\n");

const longestLine = lines.reduce((a,b)=>a.length>b.length?a:b);

const maxWidth = window.innerWidth*0.95;
const maxHeight = window.innerHeight*0.85;

const charCount = longestLine.length;
const lineCount = lines.length;

const sizeByWidth = maxWidth/charCount;
const sizeByHeight = maxHeight/lineCount;

const fontSize = Math.min(sizeByWidth,sizeByHeight);

pre.style.fontSize = fontSize+"px";
pre.style.lineHeight = fontSize*0.9+"px";

}

function startAnimating(){

fpsInterval = 1000/fps;
then = Date.now();
animate();

}

function animate(){

animFrame = requestAnimationFrame(animate);

const now = Date.now();

if(now-then>fpsInterval){

then = now-((now-then)%fpsInterval);
step();

}

}

function step(){

i = (i + 1) % max;

pre.textContent = frames[i];

}

function debounce(fn,delay){

let t;

return function(){
clearTimeout(t);
t=setTimeout(fn,delay);
}

}

document.addEventListener("visibilitychange",()=>{

if(document.hidden){
cancelAnimationFrame(animFrame);
}else{
startAnimating();
}

});