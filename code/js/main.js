// js/main.js
import { initializeLeafletMap, updateTimelineDisplay } from './modules/map.js';
import { initializeUI } from './modules/ui.js';
import { initializeTranslator } from './modules/translator.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    initializeLeafletMap();

    initializeTranslator(() => {
        const slider = document.getElementById('timeline-slider');
        if (slider) {
            updateTimelineDisplay(slider.value);
        }
    });
});
