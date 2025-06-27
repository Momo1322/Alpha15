const japButton = document.getElementById('japButton');
const countText = document.getElementById('japCount');
const ring = document.getElementById('progressRing');
const toggle = document.getElementById('silentToggle');
const glow = document.getElementById('glowEffect');
const audio = document.getElementById('radhaSound');

let count = parseInt(localStorage.getItem('japCount')) || 0;
updateUI();

japButton.onclick = () => {
    count++;
    localStorage.setItem('japCount', count);
    updateUI();
};

function updateUI() {
    countText.textContent = count;
    const percent = Math.min(count / 108, 1);
    ring.style.strokeDashoffset = 339 - (339 * percent);
}

// Reminder every 5 minutes
setInterval(() => {
    if (toggle.checked) {
        glow.classList.remove('hidden');
        if (navigator.vibrate) navigator.vibrate([300]);
        setTimeout(() => glow.classList.add('hidden'), 1500);
    } else {
        audio.play();
    }
}, 300000); // 300,000 ms = 5 minutes
