// Target date for the milestone countdown (December 12, 2026)
const targetDate = new Date("Dec 12, 2026 09:00:00").getTime();

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const timeRemaining = targetDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Render results to HTML elements safely
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.innerHTML = days;
    if (hoursEl) hoursEl.innerHTML = hours;
    if (minutesEl) minutesEl.innerHTML = minutes;
    if (secondsEl) secondsEl.innerHTML = seconds;

    // If the countdown is finished, clear interval
    if (timeRemaining < 0) {
        clearInterval(countdownInterval);
        if (daysEl) daysEl.innerHTML = "0";
        if (hoursEl) hoursEl.innerHTML = "0";
        if (minutesEl) minutesEl.innerHTML = "0";
        if (secondsEl) secondsEl.innerHTML = "0";
    }
}, 1000);

// Audio background controller logic
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

function toggleMusic() {
    if (!bgMusic) return;

    if (bgMusic.paused) {
        bgMusic.play().catch(err => console.log("Audio play deferred setup: ", err));
        if (musicBtn) musicBtn.innerHTML = "⏸️";
    } else {
        bgMusic.pause();
        if (musicBtn) musicBtn.innerHTML = "🎵";
    }
}
