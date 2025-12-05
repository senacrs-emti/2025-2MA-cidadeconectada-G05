const ecoPoints = [
  {
    id: 1,
    name: "UDC BERNARDINO SILVEIRA DE AMORIM",
    address: "Av. Bernardino Silveira de Amorim, 2261 - Rubem Berta",
    hours: "Seg–Sex 08h–17h • Sáb/Feriados 08h–12h",
    lat: -30.008070,
    lng: -51.106870
  },
  {
    id: 2,
    name: "UDC CÂNCIO GOMES",
    address: "Travessa Carmem, 111 – Floresta",
    hours: "Seg–Sex 07h–19h • Sáb/Feriados 08h–12h",
    lat: -30.014980,
    lng: -51.213930
  },
  {
    id: 3,
    name: "UDC CARVALHO DE FREITAS",
    address: "Rua Professor Carvalho de Freitas, 1012 – Glória",
    hours: "Seg–Sex 07h–19h • Sáb/Feriados 08h–12h",
    lat: -30.083560,
    lng: -51.197440
  },
  {
    id: 4,
    name: "UDC CENTRO",
    address: "Av. Alberto Bins, 667 – Centro Histórico",
    hours: "Seg–Sex 07h–19h • Sáb/Feriados 08h–12h",
    lat: -30.024390,
    lng: -51.230590
  },
  {
    id: 5,
    name: "UDC CRUZEIRO DO SUL",
    address: "Av. Cruzeiro do Sul, 1445 – Cruzeiro do Sul",
    hours: "Seg–Sex 08h–17h • Sáb/Feriados 08h–12h",
    lat: -30.093415,
    lng: -51.244620
  },
  {
    id: 6,
    name: "UDC FÁTIMA PINTO",
    address: "Rua Alfredo Ferreira Rodrigues, 975 – Bom Jesus",
    hours: "Seg–Sex 08h–17h • Sáb/Feriados 08h–12h",
    lat: -30.039840,
    lng: -51.157290
  },
  {
    id: 7,
    name: "UDC HUMAITÁ",
    address: "Rua José Aloísio Filho, 780 – Humaitá",
    hours: "Seg–Sex 08h–16h • Sáb/Feriados 08h–12h",
    lat: -29.987850,
    lng: -51.212710
  },
  {
    id: 8,
    name: "UDC PRINCESA ISABEL",
    address: "Av. Ipiranga, 2765 – Santana",
    hours: "Seg–Sex 07h–19h • Sáb/Feriados 08h–12h",
    lat: -30.045680,
    lng: -51.211340
  }
];
function updateSideInfo(point) {
  const infoBox = document.getElementById("mapInfo");

  if (!infoBox) {
    console.warn("Div #mapInfo não encontrada!");
    return;
  }

  infoBox.innerHTML = `
    <h3 class="map-info-title">${point.name}</h3>
    <p class="map-info-text"><strong>Endereço:</strong> ${point.address}</p>
    <p class="map-info-text"><strong>Horário:</strong> ${point.hours}</p>
    <span class="map-info-badge">Ponto Verificado</span>
  `;
}

document.addEventListener("DOMContentLoaded", () => {

  const map = L.map("ecoMap").setView([-30.03, -51.23], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  const bounds = [];

  ecoPoints.forEach(point => {
    const marker = L.marker([point.lat, point.lng]).addTo(map);

    marker.bindPopup(`<strong>${point.name}</strong><br>${point.address}`);

    marker.on("click", () => {
      updateSideInfo(point);
    });

    bounds.push([point.lat, point.lng]);
  });

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [40, 40] });
  }
  updateSideInfo({
    name: "Selecione um ponto no mapa",
    address: "Clique em qualquer marcador para ver detalhes.",
    hours: ""
  });
});