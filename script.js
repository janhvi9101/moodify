function saveMood() {
  const mood = document.getElementById("mood").value;
  const gratitude = document.getElementById("gratitude").value;
  const date = new Date().toLocaleDateString();

  const moodEntry = { date, mood, gratitude };
  let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

  moodHistory = moodHistory.filter(entry => entry.date !== date);
  moodHistory.push(moodEntry);
  localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

  showSuggestion(mood);
  showHistory();
  drawMoodChart();
  renderCalendar();

  document.getElementById("gratitude").value = "";
}

function showSuggestion(mood) {
  const suggestion = document.getElementById("suggestion");
  let message = "";
  let link = "";

  switch (mood) {
    case "😊":
      message = "You're feeling great! Here's an upbeat playlist 🎵";
      link = "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC";
      break;
    case "😞":
      message = "Feeling down? Try this chill vibes playlist 🌙";
      link = "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0";
      break;
    case "😴":
      message = "Take a break with relaxing lo-fi beats ☁️";
      link = "https://open.spotify.com/playlist/5qap5aO4i9A";
      break;
    case "😡":
      message = "Cool down with calm instrumental music 🧘";
      link = "https://open.spotify.com/playlist/37i9dQZF1DWUZ5bk6qqDSy";
      break;
    default:
      message = "Here's a balanced playlist to stay grounded 🎧";
      link = "https://open.spotify.com/playlist/37i9dQZF1DX3PFzdbtx1Us";
  }

  suggestion.innerHTML = `${message}<br><a href="${link}" target="_blank">🎧 Listen on Spotify</a>`;
}

function showHistory() {
  const history = JSON.parse(localStorage.getItem("moodHistory")) || [];
  const historyList = document.getElementById("history");
  historyList.innerHTML = "";

  history.reverse().forEach(entry => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${entry.date}</strong> — Mood: ${entry.mood}<br>Gratitude: ${entry.gratitude}`;
    historyList.appendChild(item);
  });
}

function drawMoodChart() {
  const ctx = document.getElementById("moodChart").getContext("2d");
  const history = JSON.parse(localStorage.getItem("moodHistory")) || [];
  const recent = history.slice(-7);
  const moodCounts = { "😊": 0, "😞": 0, "😴": 0, "😡": 0, "😐": 0 };

  recent.forEach(entry => {
    moodCounts[entry.mood]++;
  });

  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(moodCounts),
      datasets: [{
        label: 'Mood Frequency (last 7 days)',
        data: Object.values(moodCounts),
        backgroundColor: ['#ffd54f', '#e57373', '#90caf9', '#ff8a65', '#bdbdbd']
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const history = JSON.parse(localStorage.getItem("moodHistory")) || [];
  const last7 = history.slice(-7);
  calendar.innerHTML = "";

  last7.forEach(entry => {
    const box = document.createElement("div");
    box.innerHTML = `<strong>${entry.date}</strong><br>${entry.mood}`;
    calendar.appendChild(box);
  });
}

function toggleTheme() {
  const body = document.body;
  const currentTheme = body.classList.contains("dark") ? "dark" : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  body.classList.remove(currentTheme);
  body.classList.add(newTheme);
  localStorage.setItem("theme", newTheme);

  document.getElementById("theme-toggle").textContent =
    newTheme === "dark" ? "☀️ Toggle Light Mode" : "🌙 Toggle Dark Mode";
}

window.onload = function () {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme);

  document.getElementById("theme-toggle").textContent =
    savedTheme === "dark" ? "☀️ Toggle Light Mode" : "🌙 Toggle Dark Mode";

  showHistory();
  drawMoodChart();
  renderCalendar();
};
