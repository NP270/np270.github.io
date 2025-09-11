let entries = [];

fetch("../assets/files/results.txt")
  .then(response => response.text())
  .then(text => {
    entries = text.trim().split("\n").map(line => {
      const [rank, school, teamId, status, ap, cos, gea, oba, roc, total] = line.split(",");
      return { rank, school, teamId, status, ap, cos, gea, oba, roc, total };
    });
    render();
  })
  .catch(err => console.error("Error loading entries:", err));

// UI State
let search = "";
let statusFilter = "all";
let sortField = "rank";
let sortDirection = "asc";
let viewPage = 1;
const itemsPerPage = 10;

// DOM Elements
const searchInput = document.getElementById("searchInput");
const statusSelect = document.getElementById("statusFilter");
const sortFieldSelect = document.getElementById("sortField");
const sortDirectionBtn = document.getElementById("sortDirectionBtn");
const tableBody = document.querySelector("#markstable tbody");
const upArrowSVG = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"></path>
</svg>`;

const downArrowSVG = `
<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"></path>
</svg>`;


function render() {
  if (!entries.length) return;

  // Filter
  let filtered = entries.filter(entry => {
    const matchesSearch =
      entry.school.toLowerCase().includes(search.toLowerCase()) ||
      entry.teamId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort
  filtered.sort((a, b) => {
    const dir = sortDirection === "asc" ? 1 : -1;
    if (sortField === "rank" || sortField === "total") {
      return (parseInt(a[sortField]) - parseInt(b[sortField])) * dir;
    }
    return a[sortField].localeCompare(b[sortField]) * dir;
  });

  // Pages
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (viewPage > totalPages) viewPage = totalPages || 1;
  const paginated = filtered.slice((viewPage - 1) * itemsPerPage, viewPage * itemsPerPage);

  // Render Entries
  tableBody.innerHTML = "";
  paginated.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.rank}</td>
      <td>${entry.school}</td>
      <td>${entry.teamId}</td>
      <td>${getStatusBadge(entry.status)}</td>
      <td>${entry.ap}</td>
      <td>${entry.cos}</td>
      <td>${entry.gea}</td>
      <td>${entry.oba}</td>
      <td>${entry.roc}</td>
      <td>${entry.total}</td>
    `;
    tableBody.appendChild(row);
  });

  // Results Info + Pagination
  renderFooter(filtered.length, totalPages);
}

function renderFooter(totalResults, totalPages) {
  let tbfooter = document.querySelector(".tbfooter");
  if (!tbfooter) {
    tbfooter = document.createElement("div");
    tbfooter.className = "tbfooter";
    tbfooter.innerHTML = `<div id="resultsInfo"></div><div id="paginationControls" class="pagination"></div>`;
    document.querySelector(".table-container").appendChild(tbfooter);
  }

  const resultsInfo = document.getElementById("resultsInfo");
  const paginationControls = document.getElementById("paginationControls");

  const start = (viewPage - 1) * itemsPerPage + 1;
  const end = Math.min(viewPage * itemsPerPage, totalResults);
  resultsInfo.textContent = `${start} - ${end} of ${totalResults} results`;

  // Pagination
  paginationControls.innerHTML = "";
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = viewPage === 1;
  prevBtn.onclick = () => { viewPage--; render(); };
  paginationControls.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === viewPage) btn.classList.add("active");
    btn.onclick = () => { viewPage = i; render(); };
    paginationControls.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = viewPage === totalPages;
  nextBtn.onclick = () => { viewPage++; render(); };
  paginationControls.appendChild(nextBtn);
}

function getStatusBadge(status) {
  if (status === "selected") return `<span class="badge selected"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="w-4 h-4" data-pc-el-id="BsCheckCircleFill-76-76" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path></svg> Selected</span>`;
  if (status === "hold") return `<span class="badge hold"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="w-4 h-4" data-pc-el-id="BsClockFill-83-83" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"></path></svg> Hold</span>`;
  if (status === "nonselected") return `<span class="badge nonselected"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" class="w-4 h-4" data-pc-el-id="BsXCircleFill-90-90" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"></path></svg> Not-Selected</span>`;
  return status;
}

// Event Listeners
searchInput.addEventListener("input", e => { search = e.target.value; render(); });
statusSelect.addEventListener("change", e => { statusFilter = e.target.value; render(); });
sortFieldSelect.addEventListener("change", e => { sortField = e.target.value; render(); });
sortDirectionBtn.addEventListener("click", () => {
  sortDirection = sortDirection === "asc" ? "desc" : "asc";  
  sortDirectionBtn.innerHTML = sortDirection === "asc" ? upArrowSVG : downArrowSVG;
  render();
});
