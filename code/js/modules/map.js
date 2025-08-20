// js/modules/map.js
import { timelineEvents, layerConfig } from './data.js';
import { t } from './translator.js';

let map;
let layers = {};
let legend;
let layerControl;
let highlightedLayer = null;
let tempMarker = null;

function formatLayerNameFromUrl(url) {
    const filename = url.split('/').pop();
    const nameWithoutExt = filename.replace('.geojson', '');
    return nameWithoutExt.replace(/_/g, ' ');
}

function onEachFeature(feature, layer, layerKey) {
    if (feature.properties) {
        let popupContent = "<h4>Informasi Fitur</h4>";
        if (feature.properties.NAMOBJ) popupContent += `<b>Nama:</b> ${feature.properties.NAMOBJ}<br/>`;
        if (feature.properties.REMARK) popupContent += `<b>Keterangan:</b> ${feature.properties.REMARK}`;
        layer.bindPopup(popupContent);
    }
    layer.on({
        click: (e) => {
            const clickedLayer = e.target;
            if (highlightedLayer === clickedLayer) {
                resetHighlight(clickedLayer);
                highlightedLayer = null;
            } else {
                if (highlightedLayer) resetHighlight(highlightedLayer);
                clickedLayer.setStyle(layerConfig[layerKey].highlightStyle);
                highlightedLayer = clickedLayer;
            }
            L.DomEvent.stopPropagation(e);
        }
    });
}

function resetHighlight(layer) {
    for (const key in layers) {
        if (layers[key] && layers[key].hasLayer(layer)) {
            layers[key].resetStyle(layer);
            break;
        }
    }
}

function initializeLegend() {
    legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `<h4 id="legend-toggle">Legenda</h4><div class="legend-content"></div>`;
        L.DomEvent.disableClickPropagation(div);
        div.querySelector('#legend-toggle').addEventListener('click', () => div.classList.toggle('collapsed'));
        updateLegend(div);
        return div;
    };
    legend.addTo(map);
}

function updateLegend() {
    const legendContainer = legend ? legend.getContainer() : null;
    if (!legendContainer) return;
    const contentDiv = legendContainer.querySelector('.legend-content');
    if (!contentDiv) return;
    let content = '';
    for (const key in layerConfig) {
        if (map && map.hasLayer(layers[key])) {
            const config = layerConfig[key];
            const color = config.style.fillColor || config.style.color;
            content += `<i style="background: ${color}"></i> ${config.name}<br>`;
        }
    }
    contentDiv.innerHTML = content;
}

/**
 * === PERBAIKAN DI SINI ===
 * Fungsi ini sekarang akan menyembunyikan semua layer terlebih dahulu,
 * lalu hanya menampilkan layer yang spesifik untuk setiap era.
 */
function updateMapLayers(timelineValue) {
    if (!map) return;

    // Sembunyikan semua layer terlebih dahulu
    Object.values(layers).forEach(layer => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });

    // Tampilkan layer spesifik berdasarkan era
    // timelineValue: 0=1500s, 1=1600s, 2=1800s, 3=1950s, 4=2024
    switch (timelineValue) {
        case 0: // Pra-Kolonial
            if (layers.sungai) map.addLayer(layers.sungai);
            if (layers.prasasti_tugu) map.addLayer(layers.prasasti_tugu);
            break;
        case 1: // Kolonial Awal (1600-an)
            if (layers.sungai) map.addLayer(layers.sungai);
            if (layers.canal1619) map.addLayer(layers.canal1619);
            if (layers.canal1650) map.addLayer(layers.canal1650);
            break;
        case 2: // Ekspansi Kolonial (1800-an)
            if (layers.sungai) map.addLayer(layers.sungai);
            if (layers.canal1700) map.addLayer(layers.canal1700);
            if (layers.canal1797) map.addLayer(layers.canal1797);
            if (layers.flood1893) map.addLayer(layers.flood1893);
            break;
        case 3: // Pasca-Kemerdekaan (1950-an)
            if (layers.sungai) map.addLayer(layers.sungai);
            if (layers.administrasi) map.addLayer(layers.administrasi);
            if (layers.canal1959) map.addLayer(layers.canal1959);
            if (layers.flood1932) map.addLayer(layers.flood1932);
            break;
        case 4: // Modern (2024)
            if (layers.sungai) map.addLayer(layers.sungai);
            if (layers.administrasi) map.addLayer(layers.administrasi);
            if (layers.canal2024) map.addLayer(layers.canal2024);
            if (layers.flood2024) map.addLayer(layers.flood2024);
            break;
    }

    updateLegend();
}

export function zoomToEventLocation(location) {
    if (!map || !location) return;
    map.flyTo(location.coords, location.zoom || 15);
    if (tempMarker) map.removeLayer(tempMarker);
    tempMarker = L.circleMarker(location.coords, { radius: 12, color: '#fbb_f04', fillColor: '#facc15', fillOpacity: 0.5, className: 'pulse-marker' }).addTo(map);
    setTimeout(() => {
        if (tempMarker) map.removeLayer(tempMarker);
        tempMarker = null;
    }, 4000);
}

export function displayAndZoomToLayer(layerKey) {
    const targetLayer = layers[layerKey];
    if (!map || !targetLayer) {
        console.error(`Layer dengan kunci "${layerKey}" tidak ditemukan.`);
        return;
    }

    // Sembunyikan semua layer GeoJSON lain terlebih dahulu
    Object.keys(layers).forEach(key => {
        if (key !== layerKey && map.hasLayer(layers[key])) {
            map.removeLayer(layers[key]);
        }
    });

    // Pastikan layer target ada di peta
    if (!map.hasLayer(targetLayer)) {
        map.addLayer(targetLayer);
    }

    // Zoom ke cakupan layer target
    map.flyToBounds(targetLayer.getBounds(), { padding: L.point(50, 50) });

    // Perbarui legenda agar hanya menampilkan layer yang aktif
    updateLegend();
}


export function updateTimelineDisplay(value) {
    const eraKey = `era_${value}_name`;
    const eraLabel = document.getElementById('era-label');
    if (eraLabel) eraLabel.textContent = t(eraKey);

    const timelineContainer = document.getElementById('vertical-timeline-container');
    if (timelineContainer) {
        timelineContainer.innerHTML = '';
        (timelineEvents[value] || []).forEach(event => {
            const item = document.createElement('div');
            item.className = 'timeline-item';

            let contentClass = 'timeline-item-content';
            let locationAttr = '';
            let zoomLayerAttr = '';

            if (event.location) {
                contentClass += ' clickable';
                locationAttr = `data-location='${JSON.stringify(event.location)}'`;
            }
            if (event.zoomToLayer) {
                contentClass += ' clickable';
                zoomLayerAttr = `data-zoom-to-layer="${event.zoomToLayer}"`;
            }

            item.innerHTML = `
                <div class="${contentClass}" ${locationAttr} ${zoomLayerAttr}>
                    <img src="${event.imageUrl}" alt="Ilustrasi ${event.year}" onerror="this.style.display='none'">
                    <div>
                        <h5>${event.year}</h5>
                        <p>${t(event.key)}</p>
                    </div>
                </div>
            `;
            timelineContainer.appendChild(item);
        });
    }

    updateMapLayers(parseInt(value));
    map.flyTo([-6.2088, 106.8456], 11);
}

export function initializeLeafletMap() {
    map = L.map('leafletMapDiv').setView([-6.2088, 106.8456], 11);
    const basemaps = {
        "Gelap": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO' }),
        "Terang": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }),
        "Satelit": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '&copy; Esri' })
    };
    basemaps["Gelap"].addTo(map);

    const promises = Object.entries(layerConfig).map(([key, config]) =>
        fetch(config.url).then(response => {
            if (!response.ok) throw new Error(`Gagal memuat ${config.url}`);
            return response.json().then(data => ({ key, data, config }));
        })
    );

    Promise.all(promises).then(results => {
        const overlayMaps = {};
        results.forEach(({ key, data, config }) => {
            const dynamicName = formatLayerNameFromUrl(config.url);
            layerConfig[key].name = dynamicName;
            layers[key] = L.geoJSON(data, {
                style: config.style,
                onEachFeature: (feature, layer) => onEachFeature(feature, layer, key)
            });
            overlayMaps[dynamicName] = layers[key];
        });
        layerControl = L.control.layers(basemaps, overlayMaps, { position: 'topright' }).addTo(map);
        initializeLegend();
        map.on('overlayadd overlayremove', updateLegend);
        updateTimelineDisplay(document.getElementById('timeline-slider').value);
    }).catch(error => console.error('Error memuat GeoJSON:', error));

    map.on('click', () => {
        if (highlightedLayer) {
            resetHighlight(highlightedLayer);
            highlightedLayer = null;
        }
    });
}
