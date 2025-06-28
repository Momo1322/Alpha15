const japBtn = document.getElementById('japButton');
const countText = document.getElementById('japCount');
const ring = document.getElementById('progressRing');
const toggle = document.getElementById('silentToggle');
const reverse = document.getElementById('reverseToggle');
const glow = document.getElementById('glowEffect');
const audio = document.getElementById('radhaSound');
const intervalInput = document.getElementById('intervalInput');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let intervalID;
let reminderActive = false;
let reminderReady = false;
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
  japBtn.disabled = !reminderReady;
}

function resetCounter() {
  count = reverse.checked ? maxJaps : 0;
  updateUI();
}

function handleJapClick() {
  if (!reminderReady) return;
  if (reverse.checked && count > 0) count--;
  else if (!reverse.checked && count < maxJaps) count++;
  updateUI();
  reminderReady = false;
  japBtn.disabled = true;
  if ((reverse.checked && count === 0) || (!reverse.checked && count === maxJaps)) {
    playSoundTwiceAndReset();
  }
}

japBtn.onclick = handleJapClick;

function triggerReminder() {
  if (!reminderActive && !window.testMode) return; // Allow testing even when not active
  reminderReady = true;
  japBtn.disabled = false;
  if (toggle.checked) {
    simulateGlow();
    if (navigator.vibrate) navigator.vibrate([300]);
  } else {
    audio.play().catch(e => console.log('Audio play failed:', e));
  }
}

function simulateGlow() {
  glow.classList.remove('hidden');
  setTimeout(() => glow.classList.add('hidden'), 1500);
}

function playSoundTwiceAndReset() {
  japBtn.disabled = true;
  reminderReady = false;
  let playCount = 0;
  function playAgain() {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio play failed:', e));
    playCount++;
    if (playCount < 2) {
      setTimeout(playAgain, 1000);
    } else {
      setTimeout(() => {
        count = reverse.checked ? maxJaps : 0;
        updateUI();
        triggerReminder();
      }, 1000);
    }
  }
  playAgain();
}

function startReminders() {
  if (intervalID) clearInterval(intervalID);
  reminderActive = true;
  const mins = Math.max(parseInt(intervalInput.value || 5), 1);
  intervalID = setInterval(triggerReminder, mins * 60000);
  triggerReminder(); // Start immediately
}

function stopReminders() {
  if (intervalID) clearInterval(intervalID);
  reminderActive = false;
  reminderReady = false;
  japBtn.disabled = true;
}

function getState() {
  return {
    intervalMin: intervalInput.value,
    silent: toggle.checked,
    reverse: reverse.checked,
    count,
    reminderActive,
    reminderReady
  };
}

// Make functions globally accessible for the advanced testing buttons
window.triggerReminder = () => {
  window.testMode = true;
  triggerReminder();
  window.testMode = false;
};
window.resetCounter = resetCounter;
window.getState = getState;
window.simulateGlow = simulateGlow;

startBtn.onclick = startReminders;
stopBtn.onclick = stopReminders;

reverse.addEventListener('change', () => {
  count = reverse.checked ? maxJaps : 0;
  updateUI();
});

intervalInput.addEventListener('change', () => {
  if (reminderActive) startReminders();
});

// Initialize
updateUI();
stopReminders();
