// js/modules/translator.js

let translations = {};
let currentLanguage = 'id'; // Bahasa default

async function loadLanguage(lang) {
    try {
        const response = await fetch(`assets/lang/${lang}.json`);
        if (!response.ok) throw new Error(`Gagal memuat file bahasa: ${lang}.json`);
        translations = await response.json();
    } catch (error) {
        console.error(error);
        if (lang !== 'en') await loadLanguage('en');
    }
}

function translatePage() {
    document.querySelectorAll('[data-lang-key]').forEach(el => {
        const key = el.dataset.langKey;
        if (translations[key]) el.innerHTML = translations[key];
    });
}

export function t(key) {
    return translations[key] || `[${key}]`;
}

export function getLang() {
    return currentLanguage;
}

async function setLanguage(lang, rerenderCallback) {
    currentLanguage = lang;
    await loadLanguage(lang);
    translatePage();
    if (rerenderCallback) rerenderCallback();
}

export function initializeTranslator(rerenderCallback) {
    const switcher = document.getElementById('lang-switcher');
    if (switcher) {
        switcher.addEventListener('click', () => {
            const newLang = currentLanguage === 'id' ? 'en' : 'id';
            setLanguage(newLang, rerenderCallback);
        });
    }
    // Mengembalikan promise untuk menandakan kapan pemuatan awal selesai
    return setLanguage(currentLanguage, rerenderCallback);
}
