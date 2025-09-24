let countdownIntervals = {};

function startCountdown(id, targetDate = null) {
  clearInterval(countdownIntervals[id]);

  if (!targetDate && id === "custom") {
    const input = document.getElementById("targetTime").value;
    targetDate = new Date(input);
    if (!isNaN(targetDate)) {
      document.getElementById("date-custom").textContent = targetDate.toDateString();
    }
  }

  if (isNaN(targetDate)) {
    alert("Please select a valid date and time.");
    return;
  }

  function updateCountdown() {
    const now = new Date();
    let diff = targetDate - now;
    const display = document.getElementById(`countdown-${id}`);

    if (diff <= 0) {
      clearInterval(countdownIntervals[id]);
      display.textContent = "Time's up!";
      return;
    }

    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    display.innerHTML = `
      <span class="digits">${days}</span><span class="label">d</span>
      <span class="digits">${String(hours).padStart(2, "0")}</span><span class="label">h</span> :
      <span class="digits">${String(minutes).padStart(2, "0")}</span><span class="label">m</span> :
      <span class="digits">${String(seconds).padStart(2, "0")}</span><span class="label">s</span>
    `;
  }

  updateCountdown();
  countdownIntervals[id] = setInterval(updateCountdown, 1000);
}

// --- Helper for nearest future event ---
function nextEventDate(month, day, fixed = true, weekday = null, occurrence = null) {
  const now = new Date();
  let year = now.getFullYear();
  let date;

  if (fixed) {
    date = new Date(year, month, day, 0, 0, 0);
  } else {
    // Floating holidays (like Thanksgiving)
    date = new Date(year, month, 1);
    let count = 0;
    while (date.getDay() !== weekday) {
      date.setDate(date.getDate() + 1);
    }
    count++;
    while (count < occurrence) {
      date.setDate(date.getDate() + 7);
      count++;
    }
  }

  if (date < now) {
    year++;
    if (fixed) {
      date = new Date(year, month, day, 0, 0, 0);
    } else {
      date = new Date(year, month, 1);
      let count = 0;
      while (date.getDay() !== weekday) {
        date.setDate(date.getDate() + 1);
      }
      count++;
      while (count < occurrence) {
        date.setDate(date.getDate() + 7);
        count++;
      }
    }
  }
  return date;
}

// --- Preset Events ---
const events = {
  newyear: nextEventDate(0, 1),
  spring: new Date(new Date().getFullYear(), 2, 20),
  summer: new Date(new Date().getFullYear(), 5, 21),
  autumn: new Date(new Date().getFullYear(), 8, 22),
  winter: new Date(new Date().getFullYear(), 11, 21),
  valentine: nextEventDate(1, 14),
  halloween: nextEventDate(9, 31),
  thanksgiving: nextEventDate(10, 1, false, 4, 4), // 4th Thursday Nov
  christmas: nextEventDate(11, 25),
  birthday: nextEventDate(1, 23), // change to your birthday
  july4: nextEventDate(6, 4),
  labor: nextEventDate(8, 1, false, 1, 1), // 1st Mon Sep
  mothers: nextEventDate(4, 1, false, 0, 2), // 2nd Sun May
  fathers: nextEventDate(5, 1, false, 0, 3), // 3rd Sun Jun
  milestone: nextEventDate(9, 1) // Example Oct 1
};

// --- Initialize all preset timers ---
window.onload = () => {
  Object.entries(events).forEach(([id, date]) => {
    document.getElementById(`date-${id}`).textContent = date.toDateString();
    startCountdown(id, date);
  });
};
