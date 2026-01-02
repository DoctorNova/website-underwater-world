import CSV from "@assets/translations.csv?raw";
import {ReadTranslationsCSV} from "@engine/Translations/ReadTranslationsCSV.ts";
import * as THREE from "three";

export const AvailableLanguages = ["en", "de", "es"];

export type LanguageKeys = "en" | "de" | "es";

export type TranslationSystemEvents = {
    LanguageChanged: {
        oldLanguage: LanguageKeys;
        newLanguage: LanguageKeys;
        language: LanguageKeys;
    },
};


class TranslationSystem extends THREE.EventDispatcher<TranslationSystemEvents> {
    private translations = new Map<LanguageKeys, Map<string, string>>();
    private currentLanguage: LanguageKeys = "en";
    private domElements: Element[] = [];

    constructor() {
        super();
        this.TranslateElement = this.TranslateElement.bind(this);
        this.currentLanguage = this.GetBrowserLanguage();
        ReadTranslationsCSV(CSV, this.translations);
    }

    public GetText(id: string){
        const lang = this.translations.get(this.currentLanguage)
        if (!lang){
            return undefined;
        }
        return lang.get(id) || this.translations.get("en")?.get(id);
    }

    private GetBrowserLanguage(): LanguageKeys {
        const lang = navigator.language.toLowerCase();

        if (lang.startsWith("de")) return "de";
        if (lang.startsWith("es")) return "es";

        // English fallback (also for any other language)
        return "en";
    }

    private TranslateElement(element: Element){
        const id = element.getAttribute(TranslationSystem.attributeName);
        this.domElements.push(element);
        if (id) {
            const translation = globalTranslations.GetText(id);
            element.innerHTML = translation ?? `Missing translation for ${id}`;

            if (translation && id == "myEmail" && element.tagName.toLowerCase() === "a" && element.hasAttribute("href")) {
                element.setAttribute("href", `mailto:${translation}`);
            }
        } else {
            element.innerHTML = `The attribute "${TranslationSystem.attributeName}" is missing a value`;
        }

    }

    public ChangeLanguage(languageKeys: LanguageKeys){
        const oldLanguage = this.currentLanguage;
        this.currentLanguage = languageKeys;
        this.domElements.forEach(this.TranslateElement);

        this.dispatchEvent({
            type: "LanguageChanged",
            oldLanguage,
            newLanguage: this.currentLanguage,
            language: this.currentLanguage,
        });
    }

    public GetCurrentLanguage(): LanguageKeys{
        return this.currentLanguage;
    }

    public TranslateHTML(element: Element | Document){
        element.querySelectorAll(`[${TranslationSystem.attributeName}]`).forEach(this.TranslateElement);
    }

    public static readonly attributeName = "data-i18n";
}

export const globalTranslations: TranslationSystem = new TranslationSystem();
