import { translations as allTranslations, type LanguageKeys as LK } from "./translations.ts";

export type LanguageKeys = LK;
export type Listener = (lang: LanguageKeys) => void;

let currentLanguage: LanguageKeys = GetBrowserLanguage();
let translations = allTranslations.get(currentLanguage);
const defaultTranslations = allTranslations.get("en");
const listeners = new Set<Listener>();

// Set html lang attribute
document.documentElement.lang = currentLanguage;

function t(key: string): string {
    const translation = translations?.get(key) || defaultTranslations?.get(key);
    return translation || `[${key}]`;
}

function GetBrowserLanguage(): LanguageKeys {
    const lang = navigator.language.toLowerCase();

    if (lang.startsWith("de")) return "de";
    if (lang.startsWith("es")) return "es";

    // English fallback (also for any other language)
    return "en";
}

function setLanguage(lang: LanguageKeys) {
    if (lang === currentLanguage) return;
    currentLanguage = lang;
    translations = allTranslations.get(currentLanguage);
    document.documentElement.lang = lang;
    listeners.forEach(l => l(lang));
}

function getLanguage() {
    return currentLanguage;
}

function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export const i18n = {
    t,
    setLanguage,
    getLanguage,
    subscribe,
    languages: Array.from(allTranslations.keys())
};

