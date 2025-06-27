const japBtn = document.getElementById('japButton');
const countText = document.getElementById('japCount');
const ring = document.getElementById('progressRing');
const toggle = document.getElementById('silentToggle');
const reverse = document.getElementById('reverseToggle');
const glow = document.getElementById('glowEffect');
const audio = document.getElementById('radhaSound');
const intervalInput = document.getElementById('intervalInput');

let count = parseInt(localStorage.getItem('japCount')) || 108;
let intervalID;

function getMax() {
  return 108;
}

function updateUI() {
  countText.textContent = count;
  const percent = reverse.checked ? (getMax() - count) / getMax() : count / getMax();
  ring.style.strokeDashoffset = 339 - (339 * percent);
}

function saveCounter() {
  localStorage.setItem('japCount', count);
}

function resetCounter() {
  count = reverse.checked ? 108 : 0;
  saveCounter();
  updateUI();
}

japBtn.onclick = () => {
  if (reverse.checked) {
    if (count > 0) count--;
  } else {
    count++;
  }
  saveCounter();
  updateUI();
};

function triggerReminder() {
  if (toggle.checked) {
    simulateGlow();
    if (navigator.vibrate) navigator.vibrate([300]);
  } else {
    audio.play();
  }
}

function simulateGlow() {
  glow.classList.remove('hidden');
  setTimeout(() => glow.classList.add('hidden'), 1500);
}

function getState() {
  return {
    intervalMin: intervalInput.value,
    silent: toggle.checked,
    reverse: reverse.checked,
    count
  };
}

function restartInterval() {
  if (intervalID) clearInterval(intervalID);
  const intervalMs = Math.max(parseInt(intervalInput.value || 5), 1) * 60000;
  intervalID = setInterval(triggerReminder, intervalMs);
}

intervalInput.addEventListener('change', restartInterval);
reverse.addEventListener('change', resetCounter);

updateUI();
restartInterval();
