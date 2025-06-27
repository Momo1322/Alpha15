const japBtn = document.getElementById('japButton');
const countText = document.getElementById('japCount');
const ring = document.getElementById('progressRing');
const toggle = document.getElementById('silentToggle');
const reverse = document.getElementById('reverseToggle');
const glow = document.getElementById('glowEffect');
const audio = document.getElementById('radhaSound');
const intervalInput = document.getElementById('intervalInput');

let intervalID;
const maxJaps = 108;

// Load state depending on reverse mode
function getInitialCount() {
  const saved = localStorage.getItem('japCount');
  if (saved !== null) return parseInt(saved);
  return reverse.checked ? maxJaps : 0;
}

let count = getInitialCount();
updateUI();

function updateUI() {
  countText.textContent = count;
  const percent = reverse.checked
      ? (maxJaps - count) / maxJaps
      : count / maxJaps;
  ring.style.strokeDashoffset = 339 - (339 * percent);
  localStorage.setItem('japCount', count);
}

function resetCounter() {
  count = reverse.checked ? maxJaps : 0;
  updateUI();
}

japBtn.onclick = () => {
  if (reverse.checked && count > 0) count--;
  else if (!reverse.checked) count++;
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
  const mins = Math.max(parseInt(intervalInput.value || 5), 1);
  intervalID = setInterval(triggerReminder, mins * 60000);
}

// Recalculate count when mode flips
reverse.addEventListener('change', () => {
  count = reverse.checked ? maxJaps : 0;
  updateUI();
});

intervalInput.addEventListener('change', restartInterval);

restartInterval();
