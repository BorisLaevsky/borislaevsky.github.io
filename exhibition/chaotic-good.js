let beers = 0;

function updateImages() {

  const maxSteps = 12;

  const clampedBeers = Math.min(beers, maxSteps);
  const realOpacity = clampedBeers / maxSteps;
  const asciiOpacity = 1 - realOpacity;

  document.querySelectorAll('.group.active .image-stack').forEach(stack => {

    const ascii = stack.querySelector('.ascii');
    const real = stack.querySelector('.real');

    if (!ascii || !real) return;

    real.style.opacity = realOpacity;
    ascii.style.opacity = asciiOpacity;

  });

}

function drinkBeer() {
  beers++;
  const counter = document.getElementById("beer-count");
  if (counter) counter.textContent = beers;
  updateImages();
}

function goTo(id) {
  // hide all groups
  document.querySelectorAll('.group').forEach(g => g.classList.remove('active'));

  // show target group
  const next = document.getElementById(id);
  next.classList.add('active');

  window.scrollTo(0, 0);

  const score = document.getElementById('score');

  // show score only on pages other than 'start' and linear phase pages
  if (['start', 'w3', 'w4', 'w5', 'threshold'].includes(id)) {
    score.style.display = 'none';
  } else {
    score.style.display = 'block';
    // move score inside the active group for absolute positioning
    next.appendChild(score);
  }

  updateImages();
}

// initial setup
document.addEventListener('DOMContentLoaded', () => {
  const score = document.getElementById('score');
  // hide on start
  if (document.getElementById('start').classList.contains('active')) {
    score.style.display = 'none';
  } else {
    score.style.display = 'block';
    document.querySelector('.group.active').appendChild(score);
  }

  updateImages();
});