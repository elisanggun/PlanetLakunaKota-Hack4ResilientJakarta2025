// js/modules/data.js

// Struktur data timeline sekarang hanya berisi kunci terjemahan dan data non-teks
export const timelineEvents = {
    0: [
        { year: "500-an M", key: "event_0_0_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Prasasti", zoomToLayer: "prasasti_tugu"},
        { year: "1527", key: "event_0_1_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", location: { coords: [-6.133, 106.814], zoom: 14 } }
    ],
    1: [
        { year: "1621", key: "event_1_0_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Prasasti", zoomToLayer: "canal1619" },
        { year: "1633", key: "event_1_1_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", zoomToLayer: "canal1650" },
        { year: "1699", key: "event_1_2_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", location: { coords: [-6.133, 106.814], zoom: 14 } },
        { year: "1714", key: "event_1_3_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", location: { coords: [-6.133, 106.814], zoom: 14 } },
        { year: "1770", key: "event_1_4_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", location: { coords: [-6.133, 106.814], zoom: 14 } }
    ],
    2: [
        { year: "1854", key: "event_2_0_desc", imageUrl: "https://placehold.co/80x80/1e40af/FFF?text=Kanal", zoomToLayer: "canal1700" },
        { year: "1878", key: "event_2_1_desc", imageUrl: "https://placehold.co/80x80/1e40af/FFF?text=Lumpur", location: { coords: [-6.797, 106.772], zoom: 10 } },
        { year: "1893", key: "event_2_2_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", location: { coords: [-6.133, 106.814], zoom: 14 } },
        { year: "1909", key: "event_2_3_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", zoomToLayer: "canal1797" },
        { year: "1919", key: "event_2_4_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", location: { coords: [-6.133, 106.814], zoom: 14 } },
        { year: "1932", key: "event_2_5_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", location: { coords: [-6.133, 106.814], zoom: 14 } }
    ],
    3: [
        { year: "1854", key: "event_3_0_desc", imageUrl: "https://placehold.co/80x80/3b82f6/FFF?text=Pelabuhan", location: { coords: [-6.107, 106.883], zoom: 14 } },
        { year: "1878", key: "event_3_1_desc", imageUrl: "https://placehold.co/80x80/3b82f6/FFF?text=Masterplan", location: { coords: [-6.182, 106.800], zoom: 13 } }
    ],
    4: [
        { year: "1949", key: "event_4_0_desc", imageUrl: "https://placehold.co/80x80/60a5fa/FFF?text=Banjir" },
        { year: "1952", key: "event_4_1_desc", imageUrl: "https://placehold.co/80x80/60a5fa/FFF?text=Waduk", location: { coords: [-6.115, 106.795], zoom: 15 } },
        { year: "1953", key: "event_4_2_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", location: { coords: [-6.133, 106.814], zoom: 14 } },
        { year: "1956", key: "event_4_3_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", location: { coords: [-6.133, 106.814], zoom: 14 } }
    ],
    5: [
        { year: "1960", key: "event_5_0_desc", imageUrl: "https://placehold.co/80x80/93c5fd/FFF?text=Banjir+2007" },
        { year: "1963", key: "event_5_1_desc", imageUrl: "https://placehold.co/80x80/93c5fd/FFF?text=JEDI" },
        { year: "1970-1985", key: "event_5_2_desc", imageUrl: "https://placehold.co/80x80/93c5fd/FFF?text=Tanggul", location: { coords: [-6.09, 106.8], zoom: 12 } },
        { year: "1983", key: "event_5_3_desc", imageUrl: "https://placehold.co/80x80/0f172a/FFF?text=Pelabuhan", location: { coords: [-6.133, 106.814], zoom: 14 } }
    ]
};

// Konfigurasi layer
export const layerConfig = {
    // Layer Dasar
    administrasi: {
        url: 'assets/data/adm/adm_dki-jakart_FeaturesToJSO.geojson',
        style: { color: "#4ade80", weight: 1, opacity: 0.7, fillColor: "#166534", fillOpacity: 0.2 }
    },
    sungai: {
        url: 'assets/data/hidrology/Sungai_Primer_FeaturesToJSON.geojson',
        style: { color: "#60a5fa", weight: 2, opacity: 0.9 }
    },
    prasasti_tugu: {
        url: 'assets/data/points/prasasti_tugu.geojson',
        pointToLayerStyle: { radius: 8, fillColor: "#fef08a", color: "#fff", weight: 1, opacity: 1, fillOpacity: 0.8 }
    },
    // Layer Kanal
    canal1619: { url: 'assets/data/canal/1619_canal.geojson', style: { color: "#f59e0b", weight: 1.5, opacity: 0.8 } },
    canal1650: { url: 'assets/data/canal/1650_canal.geojson', style: { color: "#fbbf24", weight: 1.5, opacity: 0.8 } },
    canal1700: { url: 'assets/data/canal/1700_canal.geojson', style: { color: "#fcd34d", weight: 1.5, opacity: 0.8 } },
    canal1797: { url: 'assets/data/canal/1797_canal.geojson', style: { color: "#fef08a", weight: 1.5, opacity: 0.8 } },
    canal1937: { url: 'assets/data/canal/1937_canal.geojson', style: { color: "#fde68a", weight: 1.5, opacity: 0.8 } },
    canal1959: { url: 'assets/data/canal/1959_canals.geojson', style: { color: "#fef3c7", weight: 1.5, opacity: 0.8 } },
    canal2024: { url: 'assets/data/canal/2024_canals.geojson', style: { color: "#ffffff", weight: 1.5, opacity: 0.8 } },
    // Layer Banjir
    flood1893: { url: 'assets/data/flood/1893_flood.geojson', style: { fillColor: "#fca5a5", color: "#fca5a5", weight: 1, fillOpacity: 0.4 } },
    flood1909: { url: 'assets/data/flood/1909_flood.geojson', style: { fillColor: "#f87171", color: "#f87171", weight: 1, fillOpacity: 0.4 } },
    flood1919: { url: 'assets/data/flood/1919_flood.geojson', style: { fillColor: "#ef4444", color: "#ef4444", weight: 1, fillOpacity: 0.4 } },
    flood1932: { url: 'assets/data/flood/1932_flood.geojson', style: { fillColor: "#dc2626", color: "#dc2626", weight: 1, fillOpacity: 0.4 } },
    flood2018: { url: 'assets/data/flood/2018_flood.geojson', style: { fillColor: "#b91c1c", color: "#b91c1c", weight: 1, fillOpacity: 0.4 } },
    flood2020: { url: 'assets/data/flood/2020_flood.geojson', style: { fillColor: "#991b1b", color: "#991b1b", weight: 1, fillOpacity: 0.4 } },
    flood2024: { url: 'assets/data/flood/2024_flood.geojson', style: { fillColor: "#7f1d1d", color: "#7f1d1d", weight: 1, fillOpacity: 0.4 } }
};
