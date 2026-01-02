import type {LanguageKeys} from "@engine/Translations/TranslationSystem.ts";

export function ReadTranslationsCSV(csvFileContent: string, translations: Map<LanguageKeys, Map<string, string>>): any {
    const languages = new Array<LanguageKeys>();
    let startedString = false;
    let word = "";
    let column = -1;
    let id = "";
    let isFirstRow = true;
    let index = -1;

    for(const char of csvFileContent) {
        index++;

        // ignore commas in entries that start with " and end with "
        if (char === '"'){
            startedString = !startedString;

            if (index !== csvFileContent.length - 1) {
                continue;
            }
        }
        const isEndOfRow = char === '\n' || char === '\r' || index === csvFileContent.length - 1;
        if (!startedString && (char === ',' || isEndOfRow)) {
            if (isFirstRow && column >= 0) {
                languages.push(word as LanguageKeys);
            }

            // The entry is the id for the following columns
            if (column === -1){
                id = word;
            } else {
                const lang = languages[column];
                if (!translations.has(lang)) {
                    translations.set(lang, new Map<string, string>());
                }

                translations.get(lang)?.set(id, word);
            }

            column++;
            word = "";

            // Is end of row
            if (isEndOfRow) {
                isFirstRow = false;
                column = -1;
            }
        }
        else {
            word += char;
        }
    }
}