// Mock data
const mockReports = [
  {
    id: "1",
    severity: "Leve",
    subject: "Estudiante llegó tarde a clase",
    description: "El estudiante Juan Pérez llegó 15 minutos tarde a la clase de matemáticas sin justificación.",
    date: "22-07-2025",
    location: "Aula 201 - Matemáticas",
    reporter: "Prof. María González",
    status: "Pendiente",
  },
  {
    id: "2",
    severity: "Intermedio",
    subject: "Conflicto entre estudiantes en el recreo",
    description:
      "Se reportó una discusión verbal entre dos estudiantes de 8vo grado durante el recreo que requiere mediación.",
    date: "23-07-2025",
    location: "Patio Principal",
    reporter: "Prof. Carlos Mendoza",
    status: "Pendiente",
  },
  {
    id: "3",
    severity: "Grave",
    subject: "Estudiante con comportamiento agresivo",
    description:
      "Un estudiante mostró comportamiento agresivo hacia compañeros y personal docente, requiere intervención inmediata.",
    date: "24-07-2025",
    location: "Aula 105 - Historia",
    reporter: "Prof. Ana Rodríguez",
    status: "Pendiente",
  },
  {
    id: "4",
    severity: "Leve",
    subject: "Olvido de tarea de ciencias",
    description: "La estudiante Laura Martínez no entregó la tarea de ciencias naturales programada para hoy.",
    date: "25-07-2025",
    location: "Aula 302 - Ciencias",
    reporter: "Prof. Roberto Silva",
    status: "En Proceso",
  },
  {
    id: "5",
    severity: "Leve",
    subject: "Uso de celular en clase",
    description: "Se observó al estudiante Diego Torres usando el celular durante la clase de literatura.",
    date: "26-07-2025",
    location: "Aula 203 - Literatura",
    reporter: "Prof. Elena Vargas",
    status: "Resuelto",
  },
  {
    id: "6",
    severity: "Leve",
    subject: "Uniforme incompleto",
    description: "El estudiante Andrés López asistió sin la corbata del uniforme escolar reglamentario.",
    date: "27-07-2025",
    location: "Entrada Principal",
    reporter: "Coordinador Luis Ramírez",
    status: "Pendiente",
  },
  {
    id: "7",
    severity: "Intermedio",
    subject: "Falta de respeto al profesor",
    description: "La estudiante Sofía Herrera respondió de manera irrespetuosa al profesor durante la clase de inglés.",
    date: "25-07-2025",
    location: "Aula 104 - Inglés",
    reporter: "Prof. Michael Johnson",
    status: "En Proceso",
  },
  {
    id: "8",
    severity: "Intermedio",
    subject: "Daño a propiedad escolar",
    description: "Se encontró un pupitre rayado con grafitis en el aula de arte, se investiga al responsable.",
    date: "26-07-2025",
    location: "Aula de Arte - Piso 1",
    reporter: "Prof. Carmen Flores",
    status: "Pendiente",
  },
  {
    id: "9",
    severity: "Intermedio",
    subject: "Ausencia injustificada",
    description:
      "El estudiante Pablo Morales faltó tres días consecutivos sin presentar justificación médica o familiar.",
    date: "28-07-2025",
    location: "Secretaría Académica",
    reporter: "Secretaria Sandra López",
    status: "Resuelto",
  },
  {
    id: "10",
    severity: "Grave",
    subject: "Posible caso de bullying",
    description:
      "Se reportó un posible caso de acoso escolar hacia un estudiante de 7mo grado, requiere investigación urgente.",
    date: "25-07-2025",
    location: "Baños del Piso 2",
    reporter: "Psicóloga Escolar Dra. Patricia Vega",
    status: "En Proceso",
  },
  {
    id: "11",
    severity: "Grave",
    subject: "Estudiante con sustancias prohibidas",
    description: "Se encontró a un estudiante con cigarrillos en su mochila durante una inspección de rutina.",
    date: "27-07-2025",
    location: "Casilleros - Piso 1",
    reporter: "Coordinador de Disciplina José Martín",
    status: "Pendiente",
  },
  {
    id: "12",
    severity: "Grave",
    subject: "Amenaza verbal a compañero",
    description:
      "Un estudiante profirió amenazas verbales graves hacia otro compañero, situación que requiere intervención inmediata.",
    date: "29-07-2025",
    location: "Cafetería Escolar",
    reporter: "Supervisora María Fernández",
    status: "Resuelto",
  },
]

// Application state
let currentSeverity = "Leve"
let selectedReport = null
let searchQuery = ""

// DOM elements
const mainView = document.getElementById("main-view")
const detailView = document.getElementById("detail-view")
const reportsContainer = document.getElementById("reports-container")
const noReportsDiv = document.getElementById("no-reports")
const severityButtons = document.querySelectorAll(".severity-btn")
const backBtn = document.getElementById("back-btn")
const resolveBtn = document.getElementById("resolve-btn")
const resolvedBadge = document.getElementById("resolved-badge")
const searchInput = document.getElementById("search-input")
const searchResultsCount = document.getElementById("search-results-count")
const searchBtn = document.getElementById("search-btn")
const logoutBtn = document.getElementById("logout-btn")

// Utility functions
function getSeverityClass(severity) {
  return severity.toLowerCase()
}

function getStatusIcon(status) {
  const icons = {
    Pendiente: `<svg class="h-4 w-4 text-amber-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>`,
    "En Proceso": `<svg class="h-4 w-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>`,
    Resuelto: `<svg class="h-4 w-4 text-emerald-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>`,
  }
  return icons[status] || ""
}

function getStatusClass(status) {
  const classes = {
    Pendiente: "status-pendiente",
    "En Proceso": "status-proceso",
    Resuelto: "status-resuelto",
  }
  return classes[status] || "status-pendiente"
}

// Filter reports by severity
function getFilteredReports() {
  let filtered = mockReports.filter((report) => report.severity === currentSeverity)

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim()
    filtered = filtered.filter((report) => {
      return (
        report.subject.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.location.toLowerCase().includes(query) ||
        report.reporter.toLowerCase().includes(query) ||
        report.status.toLowerCase().includes(query)
      )
    })
  }

  return filtered
}

// Update severity filter counts
function updateSeverityCounts() {
  const counts = {
    Leve: mockReports.filter((r) => r.severity === "Leve").length,
    Intermedio: mockReports.filter((r) => r.severity === "Intermedio").length,
    Grave: mockReports.filter((r) => r.severity === "Grave").length,
  }

  severityButtons.forEach((btn) => {
    const severity = btn.dataset.severity
    const countSpan = btn.querySelector(".count")
    countSpan.textContent = `(${counts[severity]})`
  })
}

// Render reports table
function renderReports() {
  const filteredReports = getFilteredReports()

  // Update search results count
  if (searchQuery.trim()) {
    searchResultsCount.textContent = `${filteredReports.length} resultado(s) encontrado(s)`
    searchResultsCount.classList.remove("hidden")
  } else {
    searchResultsCount.classList.add("hidden")
  }

  if (filteredReports.length === 0) {
    reportsContainer.innerHTML = ""
    noReportsDiv.classList.remove("hidden")
    const noReportsText = searchQuery.trim()
      ? "No se encontraron reportes que coincidan con tu búsqueda"
      : "No hay reportes de esta severidad"
    noReportsDiv.querySelector("p").textContent = noReportsText
    return
  }

  noReportsDiv.classList.add("hidden")

  reportsContainer.innerHTML = filteredReports
    .map(
      (report) => `
    <div class="report-row">
      <div class="flex items-center">
        <div>
          <p class="font-medium text-foreground">${highlightSearchTerm(report.reporter, searchQuery)}</p>
          <p class="text-sm text-muted-foreground truncate max-w-200">${highlightSearchTerm(report.subject, searchQuery)}</p>
        </div>
      </div>
      
      <div class="flex items-center">
        <p class="text-foreground">${report.date}</p>
      </div>
      
      <div class="flex items-center">
        <span class="badge ${getStatusClass(report.status)}">
          ${getStatusIcon(report.status)}
          ${highlightSearchTerm(report.status, searchQuery)}
        </span>
      </div>
      
      <div class="flex items-center">
        <button class="btn" onclick="showReportDetail('${report.id}')">
          Ver Detalles
        </button>
      </div>
    </div>
  `,
    )
    .join("")
}

// Show report detail view
function showReportDetail(reportId) {
  selectedReport = mockReports.find((r) => r.id === reportId)
  if (!selectedReport) return

  // Update detail view content
  document.getElementById("detail-subject").textContent = selectedReport.subject
  document.getElementById("detail-description").textContent = selectedReport.description
  document.getElementById("detail-date").textContent = selectedReport.date
  document.getElementById("detail-location").textContent = selectedReport.location
  document.getElementById("detail-reporter").textContent = selectedReport.reporter

  // Update badges
  const severityBadge = document.getElementById("detail-severity-badge")
  severityBadge.className = `badge severity-${getSeverityClass(selectedReport.severity)}`
  severityBadge.textContent = selectedReport.severity

  const statusBadge = document.getElementById("detail-status-badge")
  statusBadge.className = `badge ${getStatusClass(selectedReport.status)}`
  statusBadge.innerHTML = `${getStatusIcon(selectedReport.status)}${selectedReport.status}`

  // Show/hide resolve button
  if (selectedReport.status === "Resuelto") {
    resolveBtn.classList.add("hidden")
    resolvedBadge.classList.remove("hidden")
  } else {
    resolveBtn.classList.remove("hidden")
    resolvedBadge.classList.add("hidden")
  }

  // Switch views
  mainView.classList.add("hidden")
  detailView.classList.remove("hidden")
}

// Go back to main view
function showMainView() {
  selectedReport = null
  detailView.classList.add("hidden")
  mainView.classList.remove("hidden")
}

// Mark report as resolved
function markAsResolved() {
  if (!selectedReport) return

  // Update the report in the data
  const reportIndex = mockReports.findIndex((r) => r.id === selectedReport.id)
  if (reportIndex !== -1) {
    mockReports[reportIndex].status = "Resuelto"
    selectedReport.status = "Resuelto"
  }

  // Update the detail view
  const statusBadge = document.getElementById("detail-status-badge")
  statusBadge.className = `badge ${getStatusClass("Resuelto")}`
  statusBadge.innerHTML = `${getStatusIcon("Resuelto")}Resuelto`

  // Hide resolve button, show resolved badge
  resolveBtn.classList.add("hidden")
  resolvedBadge.classList.remove("hidden")

  // Update counts and re-render if needed
  updateSeverityCounts()
}

function highlightSearchTerm(text, query) {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  return text.replace(regex, '<span class="search-highlight">$1</span>')
}

function handleSearch() {
  searchQuery = searchInput.value
  renderReports()
}

function handleLogout() {
  // Mostrar confirmación antes de cerrar sesión
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    // Aquí puedes agregar lógica adicional como limpiar localStorage, cookies, etc.
    alert("Sesión cerrada exitosamente")
    // Redirigir a página de login o recargar la página
    window.location.reload()
  }
}

// Event listeners
severityButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Update active state
    severityButtons.forEach((b) => {
      b.classList.remove("active", "leve", "intermedio", "grave")
    })

    btn.classList.add("active", getSeverityClass(btn.dataset.severity))

    // Update current severity and render
    currentSeverity = btn.dataset.severity

    // Clear search when changing severity
    searchInput.value = ""
    searchQuery = ""

    renderReports()
  })
})

backBtn.addEventListener("click", showMainView)
resolveBtn.addEventListener("click", markAsResolved)
searchBtn.addEventListener("click", handleSearch)
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch()
  }
})
logoutBtn.addEventListener("click", handleLogout)

// Make showReportDetail globally available
window.showReportDetail = showReportDetail

// Initialize the application
function init() {
  // Set initial active button
  const initialBtn = document.querySelector('[data-severity="Leve"]')
  initialBtn.classList.add("active", "leve")

  updateSeverityCounts()
  renderReports()
}

// Start the application
init()
