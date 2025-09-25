// Form state management
let formData = {
  rut: "",
  curso: "",
  nombre: "",
  correo: "",
  tipoReporte: "",
  declaracion: "",
}

let errors = {}
let isSubmitting = false

// DOM elements
const form = document.getElementById("reportingForm")
const mainForm = document.getElementById("mainForm")
const successMessage = document.getElementById("successMessage")
const submitBtn = document.getElementById("submitBtn")
const submitText = document.getElementById("submitText")
const anonymousBtn = document.getElementById("anonymousBtn")
const charCount = document.getElementById("charCount")

// RUT validation function
function validateRUT(rut) {
  const cleanRUT = rut.replace(/[.-]/g, "")
  if (cleanRUT.length < 8 || cleanRUT.length > 9) return false

  const body = cleanRUT.slice(0, -1)
  const dv = cleanRUT.slice(-1).toLowerCase()

  let sum = 0
  let multiplier = 2

  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number.parseInt(body[i]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = sum % 11
  const calculatedDV = remainder < 2 ? remainder.toString() : remainder === 10 ? "k" : (11 - remainder).toString()

  return dv === calculatedDV
}

// Form validation
function validateForm() {
  const newErrors = {}

  // RUT validation
  if (!formData.rut.trim()) {
    newErrors.rut = "El RUT es obligatorio"
  } else if (!validateRUT(formData.rut)) {
    newErrors.rut = "El RUT ingresado no es válido"
  }

  // Name validation
  if (!formData.nombre.trim()) {
    newErrors.nombre = "El nombre es obligatorio"
  } else if (formData.nombre.trim().length < 2) {
    newErrors.nombre = "El nombre debe tener al menos 2 caracteres"
  }

  // Course validation
  if (!formData.curso.trim()) {
    newErrors.curso = "El curso es obligatorio"
  }

  // Report type validation
  if (!formData.tipoReporte) {
    newErrors.tipoReporte = "Debe seleccionar un tipo de reporte"
  }

  // Declaration validation
  if (!formData.declaracion.trim()) {
    newErrors.declaracion = "La declaración es obligatoria"
  } else if (formData.declaracion.trim().length < 20) {
    newErrors.declaracion = "La declaración debe tener al menos 20 caracteres para proporcionar contexto suficiente"
  }

  // Email validation (optional)
  if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
    newErrors.correo = "El formato del correo electrónico no es válido"
  }

  errors = newErrors
  displayErrors()
  return Object.keys(newErrors).length === 0
}

// Display errors
function displayErrors() {
  Object.keys(formData).forEach((field) => {
    const errorElement = document.getElementById(`${field}Error`)
    const inputElement = document.getElementById(field)

    if (errors[field]) {
      errorElement.textContent = errors[field]
      inputElement.classList.add("error")
    } else {
      errorElement.textContent = ""
      inputElement.classList.remove("error")
    }
  })
}

// Handle input changes
function handleInputChange(field, value) {
  formData[field] = value

  // Clear error when user starts typing
  if (errors[field]) {
    errors[field] = ""
    displayErrors()
  }

  // Update character count for declaration
  if (field === "declaracion") {
    charCount.textContent = value.length
  }
}

// Show success message
function showSuccessMessage() {
  const referenceNumber = `REP-${Date.now().toString().slice(-6)}`
  document.getElementById("referenceNumber").textContent = referenceNumber

  mainForm.classList.add("hidden")
  successMessage.classList.remove("hidden")

  // Reset form after 5 seconds
  setTimeout(() => {
    resetForm()
  }, 5000)
}

// Reset form
function resetForm() {
  formData = {
    rut: "",
    curso: "",
    nombre: "",
    correo: "",
    tipoReporte: "",
    declaracion: "",
  }

  form.reset()
  charCount.textContent = "0"
  errors = {}
  displayErrors()

  successMessage.classList.add("hidden")
  mainForm.classList.remove("hidden")
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault()

  if (!validateForm()) return

  isSubmitting = true
  submitBtn.disabled = true
  anonymousBtn.disabled = true

  // Add loading state
  const sendIcon = submitBtn.querySelector("i")
  sendIcon.setAttribute("data-lucide", "clock")
  const lucide = window.lucide // Declare the lucide variable
  lucide.createIcons()
  sendIcon.classList.add("loading")
  submitText.textContent = "Enviando Reporte..."

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Form submitted:", formData)
    showSuccessMessage()
  } catch (error) {
    console.error("Submission error:", error)
    alert("Error al enviar el reporte. Por favor, inténtelo nuevamente.")
  } finally {
    isSubmitting = false
    submitBtn.disabled = false
    anonymousBtn.disabled = false

    // Reset button state
    sendIcon.setAttribute("data-lucide", "send")
    lucide.createIcons()
    sendIcon.classList.remove("loading")
    submitText.textContent = "Enviar Reporte Confidencial"
  }
}

// Handle anonymous submission
function handleAnonymousSubmit() {
  console.log("Anonymous report submission")
  alert("Funcionalidad de reporte anónimo en desarrollo")
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  const lucide = window.lucide // Declare the lucide variable
  lucide.createIcons()

  // Form submission
  form.addEventListener("submit", handleSubmit)

  // Anonymous button
  anonymousBtn.addEventListener("click", handleAnonymousSubmit)

  // Input event listeners
  Object.keys(formData).forEach((field) => {
    const element = document.getElementById(field)
    if (element) {
      element.addEventListener("input", (e) => {
        handleInputChange(field, e.target.value)
      })
    }
  })

  // Character count for declaration
  const declaracionInput = document.getElementById("declaracion")
  declaracionInput.addEventListener("input", (e) => {
    charCount.textContent = e.target.value.length
  })
})
