const languageSelect = document.getElementById("language-select");

async function loadLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        const translations = await response.json();
        applyTranslations(translations);
        localStorage.setItem("preferredLang", lang);
    } catch (error) {
        console.error("Translation file loading error:", error);
    }
}

function applyTranslations(translations) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[key]) {
            el.innerHTML = translations[key];
        }
    });
}

// On language change
languageSelect.addEventListener("change", (e) => {
    const selectedLang = e.target.value;
    loadLanguage(selectedLang);
});

// On page load
document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("preferredLang") || "en";
    languageSelect.value = savedLang;
    loadLanguage(savedLang);
});
