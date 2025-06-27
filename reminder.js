const intervalInput = document.getElementById('intervalInput');
const silentToggle = document.getElementById('silentToggle');
const glow = document.getElementById('glowEffect');
const audio = document.getElementById('radhaSound');
const japDisplay = document.getElementById('japCount');
const ring = document.getElementById('progressRing');

let count = parseInt(localStorage.getItem('radhaJapCount')) || 0;
const maxJaps = 108;
let reminderTimer;

// Update progress ring and text
function updateUI() {
  japDisplay.textContent = count;
  const percent = count / maxJaps;
  ring.style.strokeDashoffset = 339 - (339 * percent);
  localStorage.setItem('radhaJapCount', count);
}

// Trigger one reminder (sound or glow)
function triggerReminder() {
  count++;
  updateUI();

  if (silentToggle.checked) {
    showGlow();
  } else {
    audio.play();
  }

  if (count >= maxJaps) {
    setTimeout(() => {
      if (!silentToggle.checked) {
        audio.play(); // Play second time after a short pause
      } else {
        showGlow();
      }
      count = 0;
      updateUI();
    }, 800);
  }
}

// Glow effect
function showGlow() {
  glow.classList.remove('hidden');
  setTimeout(() => glow.classList.add('hidden'), 1500);
}

// Start or restart timer
function startReminder() {
  clearInterval(reminderTimer);
  const mins = Math.max(parseInt(intervalInput.value || 5), 1);
  reminderTimer = setInterval(triggerReminder, mins * 60000);
}

// Listeners
intervalInput.addEventListener('change', startReminder);
silentToggle.addEventListener('change', updateUI);

// Initial
updateUI();
startReminder();
