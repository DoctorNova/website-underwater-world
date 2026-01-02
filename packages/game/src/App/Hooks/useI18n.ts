import { useEffect, useState } from "preact/hooks";
import { i18n, type LanguageKeys } from "@engine/Translations/i18n";

export function useI18n() {
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        return i18n.subscribe(() => {
            forceUpdate(v => v + 1);
        });
    }, []);

    return {
        t: i18n.t,
        language: i18n.getLanguage(),
        setLanguage: (lang: LanguageKeys) => i18n.setLanguage(lang),
        languages: i18n.languages
    };
}
