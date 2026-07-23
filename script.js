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
  newyear: { name: "New Year", date: nextEventDate(0, 1) },
  spring: { name: "Spring Equinox", date: nextEventDate(2, 20) },
  summer: { name: "Summer Solstice", date: nextEventDate(5, 21) },
  autumn: { name: "Autumn Equinox", date: nextEventDate(8, 22) },
  winter: { name: "Winter Solstice", date: nextEventDate(11, 21) },
  valentine: { name: "Valentine’s Day", date: nextEventDate(1, 14) },
  halloween: { name: "Halloween", date: nextEventDate(9, 31) },
  thanksgiving: { name: "Thanksgiving (US)", date: nextEventDate(10, 1, false, 4, 4) },
  christmas: { name: "Christmas", date: nextEventDate(11, 25) },
  birthday: { name: "My Birthday", date: nextEventDate(0, 23) }, // change to your birthday
  july4: { name: "Independence Day (US)", date: nextEventDate(6, 4) },
  labor: { name: "Labor Day (US)", date: nextEventDate(8, 1, false, 1, 1) },
  mothers: { name: "Mother’s Day", date: nextEventDate(4, 1, false, 0, 2) },
  fathers: { name: "Father’s Day", date: nextEventDate(5, 1, false, 0, 3) },
  milestone: { name: "Random Milestone", date: nextEventDate(9, 1) }
};

// --- Render all events dynamically in chronological order ---
window.onload = () => {
  const matrix = document.getElementById("matrix");

  // Build array of events
  const eventArray = Object.entries(events).map(([id, obj]) => ({
    id,
    name: obj.name,
    date: obj.date
  }));

  // Sort by soonest date
  eventArray.sort((a, b) => a.date - b.date);

  // Add each to DOM
  eventArray.forEach(event => {
    const cell = document.createElement("div");
    cell.className = "countdown-cell";
    cell.innerHTML = `
      <h2>${event.name}</h2>
      <p class="event-date" id="date-${event.id}"></p>
      <div id="countdown-${event.id}" class="countdown"></div>
    `;
    matrix.appendChild(cell);

    document.getElementById(`date-${event.id}`).textContent = event.date.toDateString();
    startCountdown(event.id, event.date);
  });
};
