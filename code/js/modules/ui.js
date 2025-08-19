// js/modules/ui.js
import { t } from './translator.js';
import { updateTimelineDisplay, zoomToEventLocation, displayAndZoomToLayer } from './map.js';

function setupWisdomEventListeners() {
    const modal = document.getElementById('wisdom-modal');
    if (!modal) return;
    const titleEl = document.getElementById('wisdom-title');
    const contentEl = document.getElementById('wisdom-detail-content');
    const closeBtn = document.getElementById('wisdom-close-btn');

    document.querySelectorAll('.wisdom-card').forEach(card => {
        card.addEventListener('click', () => {
            const wisdomType = card.dataset.wisdom;
            if (modal) {
                titleEl.textContent = t(`wisdom${wisdomType.charAt(0).toUpperCase() + wisdomType.slice(1)}Title`);
                contentEl.innerHTML = t(`wisdom${wisdomType.charAt(0).toUpperCase() + wisdomType.slice(1)}Content`);
                modal.classList.remove('hidden');
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
}

function setupMemoryMapping() {
    const memoryForm = document.getElementById('memory-form');
    if (!memoryForm) return;

    let inputMap, inputMarker;
    let communityMap, communityStoryMarkers;
    const coordsInput = document.getElementById('story-coords');
    const photoInput = document.getElementById('story-photo');
    const photoPreview = document.getElementById('photo-preview');

    // Inisialisasi peta kecil di formulir
    if (document.getElementById('story-input-map')) {
        inputMap = L.map('story-input-map').setView([-6.2088, 106.8456], 11);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(inputMap);
    }

    // Inisialisasi peta besar untuk menampilkan semua cerita
    if (document.getElementById('community-story-map')) {
        communityMap = L.map('community-story-map').setView([-6.2088, 106.8456], 11);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(communityMap);
        communityStoryMarkers = L.layerGroup().addTo(communityMap);
    }

    // Event listener untuk peta input
    if (inputMap) {
        inputMap.on('click', (e) => {
            if (inputMarker) {
                inputMarker.setLatLng(e.latlng);
            } else {
                inputMarker = L.marker(e.latlng).addTo(inputMap);
            }
            coordsInput.value = JSON.stringify([e.latlng.lat, e.latlng.lng]);
        });
    }

    // Pratinjau gambar saat diunggah
    if (photoInput) {
        photoInput.addEventListener('change', () => {
            const file = photoInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    photoPreview.src = e.target.result;
                    photoPreview.classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Event listener untuk submit formulir
    memoryForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const storyData = {
            id: `story-${Date.now()}`,
            name: document.getElementById('contributor-name').value,
            year: document.getElementById('flood-year').value,
            story: document.getElementById('flood-story').value,
            coords: coordsInput.value ? JSON.parse(coordsInput.value) : null,
            photo: photoPreview.src
        };

        if (storyData.name && storyData.year && storyData.story) {
            const storiesContainer = document.getElementById('memory-stories');
            const newStory = document.createElement('div');
            newStory.className = 'story-card';
            if (storyData.coords) {
                newStory.classList.add('clickable');
                newStory.dataset.location = JSON.stringify({ coords: storyData.coords, zoom: 16 });
            }
            newStory.innerHTML = `
                <img src="${storyData.photo || 'https://placehold.co/100x100/1e293b/FFF?text=No+Image'}" alt="Foto dari ${storyData.name}">
                <div class="story-card-content">
                    <h5>${storyData.name}</h5>
                    <div class="meta">${storyData.year}</div>
                    <p>${storyData.story}</p>
                </div>`;
            storiesContainer.insertBefore(newStory, storiesContainer.firstChild);

            if (storyData.coords && communityStoryMarkers) {
                const marker = L.marker(storyData.coords).addTo(communityStoryMarkers);
                marker.bindPopup(`<b>${storyData.name} (${storyData.year})</b><br>${storyData.story.substring(0, 50)}...`);
            }

            memoryForm.reset();
            photoPreview.classList.add('hidden');
            if (inputMarker) {
                inputMarker.remove();
                inputMarker = null;
            }
            coordsInput.value = '';
        }
    });

    // Event listener untuk zoom ke cerita dari daftar
    const storiesContainer = document.getElementById('memory-stories');
    if (storiesContainer) {
        storiesContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.clickable');
            if (target && target.dataset.location) {
                const location = JSON.parse(target.dataset.location);
                if (location.coords && communityMap) {
                    communityMap.flyTo(location.coords, location.zoom || 16);
                }
            }
        });
    }
}


function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sectionId = e.target.dataset.section;
            document.querySelectorAll('.section-content').forEach(section => section.classList.add('hidden'));
            document.getElementById(`${sectionId}-section`).classList.remove('hidden');
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.replace('bg-blue-600', 'bg-slate-600'));
            e.target.classList.replace('bg-slate-600', 'bg-blue-600');
        });
    });
}

function setupTimelineInteraction() {
    const timelineSlider = document.getElementById('timeline-slider');
    if (timelineSlider) {
        timelineSlider.addEventListener('input', (e) => updateTimelineDisplay(e.target.value));
    }

    const verticalTimelineContainer = document.getElementById('vertical-timeline-container');
    if (verticalTimelineContainer) {
        verticalTimelineContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.clickable');
            if (!target) return;

            if (target.dataset.location) {
                const location = JSON.parse(target.dataset.location);
                if (location.coords) zoomToEventLocation(location);
            }

            if (target.dataset.zoomToLayer) {
                const layerKey = target.dataset.zoomToLayer;
                displayAndZoomToLayer(layerKey);
            }
        });
    }
}

export function initializeUI() {
    setupWisdomEventListeners();
    setupMemoryMapping();
    setupNavigation();
    setupTimelineInteraction();
}
