// French day numbers (1-31)
const frenchDays = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function generateCalendarData(month, year) {
  const days = getDaysInMonth(month, year);

  const data = [];
  for (let i = 1; i <= days; i++) {
    const date = new Date(year, month - 1, i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    data.push({
      day: i,
      french: frenchDays[date.getDay()].substring(0, 2),
      isWeekend,
    });
  }
  return data;
}

function renderCalendar(data, names, month, year) {
  const monthName = new Date(year, month - 1, 1).toLocaleString("fr-FR", {
    month: "long",
  });
  const container = document.createElement("div");
  container.className = "calendar-container";

  // Title
  const title1 = document.createElement("div");
  const title2 = document.createElement("div");
  title1.className = title2.className = "calendar-title";
  title1.textContent = title2.textContent = monthName.toUpperCase();
  container.appendChild(title1);
  container.appendChild(title2);

  // Table
  const table = document.createElement("table");
  table.className = "calendar-table";

  // Col groups
  const colGroup = document.createElement("colgroup");
  table.append(colGroup);
  const dayCol = document.createElement("col");
  dayCol.setAttribute("span", 1);
  dayCol.style.width = "8%";
  colGroup.append(dayCol);
  const roomMateCol = document.createElement("col");
  roomMateCol.setAttribute("span", 5);
  roomMateCol.style.width = "18.4%";
  colGroup.append(roomMateCol);

  // Header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const thDay = document.createElement("th");

  headerRow.appendChild(thDay);
  for (let i = 0; i < 4; i++) {
    const th = document.createElement("th");
    th.textContent = names[i] || `Col ${i + 1}`;
    headerRow.appendChild(th);
  }
  const th = document.createElement("th");
  th.textContent = "TRUCS";
  headerRow.appendChild(th);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement("tbody");
  data.forEach((row) => {
    // empty row for clean page overlap
    if (row.day == 16) {
      const bonusTr = document.createElement("tr");
      for (let i = 0; i < 6; i++) {
        const td = document.createElement("td");
        td.textContent = "";
        bonusTr.appendChild(td);
      }
      tbody.appendChild(bonusTr);
    }
    // regular day rows
    const tr = document.createElement("tr");
    if (row.isWeekend) tr.classList.add("weekend");
    const tdDay = document.createElement("td");
    tdDay.innerHTML = `<div><span>${row.french}</span><span>${row.day}</span></div>`;
    tr.appendChild(tdDay);
    for (let i = 0; i < 5; i++) {
      const td = document.createElement("td");
      td.textContent = "";
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
  // additionnal days rows if month is shorter than 31.
  const missingDays = 31 - data.length;
  if (missingDays > 0) {
    const nextMonthData = getNextMonth();
    for (let i = 0; i < missingDays; i++) {
      const row = nextMonthData[i];
      const tr = document.createElement("tr");
      if (i == 0) tr.style.borderTop = "3px solid grey";
      tr.style.filter = "brightness(0.87)";
      if (row.isWeekend) tr.classList.add("weekend");
      const tdDay = document.createElement("td");
      tdDay.innerHTML = `<div><span>${row.french}</span><span>${row.day}</span></div>`;
      tr.appendChild(tdDay);
      for (let i = 0; i < 5; i++) {
        const td = document.createElement("td");
        td.textContent = "";
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }
  table.appendChild(tbody);
  container.appendChild(table);

  // Seam line
  const seam = document.createElement("div");
  seam.className = "calendar-seam";
  container.appendChild(seam);

  return container;
}

function getNextMonth() {
  const month = parseInt(document.getElementById("month").value);
  const year = parseInt(document.getElementById("year").value);
  return generateCalendarData(month, year);
}

function updateCalendar() {
  // Generate a random hue for weekends
  const randomHue = Math.floor(Math.random() * 360);
  document.documentElement.style.setProperty("--weekend-hue", randomHue);

  const month = parseInt(document.getElementById("month").value);
  const year = parseInt(document.getElementById("year").value);
  const names = [
    document.getElementById("rm1").value,
    document.getElementById("rm2").value,
    document.getElementById("rm3").value,
    document.getElementById("rm4").value,
  ];
  const data = generateCalendarData(month, year);
  const calendarOutput = document.getElementById("calendar-output");
  calendarOutput.innerHTML = "";
  calendarOutput.appendChild(renderCalendar(data, names, month, year));
}

document
  .getElementById("print")
  .addEventListener("click", () => window.print());
document
  .getElementById("generate")
  .addEventListener("click", updateCalendar);

document.getElementById("month").addEventListener("input", updateCalendar);
document.getElementById("year").addEventListener("input", updateCalendar);
document.getElementById("rm1").addEventListener("input", updateCalendar);
document.getElementById("rm3").addEventListener("input", updateCalendar);
document.getElementById("rm3").addEventListener("input", updateCalendar);
document.getElementById("rm4").addEventListener("input", updateCalendar);

// Set default form values to current month and year on page load
window.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  document.getElementById("month").value = now.getMonth() + 1;
  document.getElementById("year").value = now.getFullYear();
  updateCalendar();
});
