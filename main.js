//FAZER ALTERAÇÕES NOS LOCAIS, REDIRECIONAMENTOS E MAPAS!!!!!!!!

//APENAS EXEMPLOS ABAIXO
const ecoPoints = [
  {
    id: 1,
    name: "Ecoponto Central",
    type: "Todos os Tipos",
    address: "Av. Principal, 1000 - Centro",
    hours: "Seg-Sex 8h-18h, Sáb 8h-12h",
    position: { top: "30%", left: "25%" },
  },
  {
    id: 2,
    name: "Coleta Seletiva Norte",
    type: "Plástico e Metal",
    address: "Rua das Flores, 500 - Zona Norte",
    hours: "Seg-Sex 7h-19h",
    position: { top: "20%", left: "60%" },
  },
  {
    id: 3,
    name: "Reciclagem Sul",
    type: "Papel e Papelão",
    address: "Av. Sul, 2500 - Zona Sul",
    hours: "Seg-Sáb 8h-17h",
    position: { top: "70%", left: "40%" },
  },
  {
    id: 4,
    name: "Ponto Verde Leste",
    type: "Vidro e Eletrônicos",
    address: "Rua Leste, 800 - Zona Leste",
    hours: "Ter-Sáb 9h-18h",
    position: { top: "50%", left: "75%" },
  },
  {
    id: 5,
    name: "EcoParque Oeste",
    type: "Orgânico",
    address: "Parque Oeste, s/n - Zona Oeste",
    hours: "Todos os dias 6h-20h",
    position: { top: "45%", left: "15%" },
  },
]

function initMap() {
  const mapElement = document.getElementById("ecoMap")

  ecoPoints.forEach((point) => {
    const marker = document.createElement("div")
    marker.className = "map-marker"
    marker.style.top = point.position.top
    marker.style.left = point.position.left
    marker.dataset.pointId = point.id

    marker.addEventListener("click", () => showPointInfo(point.id))

    mapElement.appendChild(marker)
  })
}
function showPointInfo(pointId) {
  const point = ecoPoints.find((p) => p.id === pointId)
  const infoElement = document.getElementById("mapInfo")
  document.querySelectorAll(".map-marker").forEach((marker) => {
    marker.classList.remove("active")
  })
  const activeMarker = document.querySelector(`[data-point-id="${pointId}"]`)
  if (activeMarker) {
    activeMarker.classList.add("active")
  }

  infoElement.innerHTML = `
        <h3 class="map-info-title">${point.name}</h3>
        <p class="map-info-text"><strong>Tipo:</strong> ${point.type}</p>
        <p class="map-info-text"><strong>Endereço:</strong> ${point.address}</p>
        <p class="map-info-text"><strong>Horário:</strong> ${point.hours}</p>
        <span class="map-info-badge">Ponto Verificado</span>
    `
}
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const activeModal = document.querySelector(".modal.active")
    if (activeModal) {
      activeModal.classList.remove("active")
      document.body.style.overflow = "auto"
    }
  }
})

function handleRegister(event) {
  event.preventDefault()

  alert("Cadastro realizado com sucesso! Bem-vindo à EcoVida.")
  closeModal("registerModal")
  event.target.reset()
}

function handleReport(event) {
  event.preventDefault()

  alert("Reporte enviado com sucesso! Agradecemos sua contribuição para um ambiente melhor.")
  closeModal("reportModal")
  event.target.reset()
}

function handleEcoPoint(event) {
  event.preventDefault()

  alert("Ponto ecológico registrado com sucesso! Após verificação, ele aparecerá no mapa.")
  closeModal("ecoPointModal")
  event.target.reset()
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerOffset = 80
      const elementPosition = target.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  })
})
let lastScroll = 0
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  const currentScroll = window.pageYOffset

  if (currentScroll > 100) {
    header.style.boxShadow = "var(--shadow-md)"
  } else {
    header.style.boxShadow = "var(--shadow-sm)"
  }

  lastScroll = currentScroll
})

document.addEventListener("DOMContentLoaded", () => {
  initMap()
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  document.querySelectorAll(".action-card, .feature-card, .stat-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
})
function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  const timer = setInterval(() => {
    start += increment
    if (start >= target) {
      element.textContent = target.toLocaleString("pt-BR")
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(start).toLocaleString("pt-BR")
    }
  }, 16)
}
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const number = entry.target.querySelector(".stat-number")
        const target = Number.parseInt(number.textContent.replace(/\D/g, ""))
        animateCounter(number, target)
        entry.target.dataset.animated = "true"
      }
    })
  },
  { threshold: 0.5 },
)

document.querySelectorAll(".stat-card").forEach((card) => {
  statsObserver.observe(card)
})
