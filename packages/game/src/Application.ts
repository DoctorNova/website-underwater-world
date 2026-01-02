import {CreateGameScene} from "./CreateGameScene";
import {globalEngine} from "@engine/index.ts";
import {
    AvailableLanguages,
    globalTranslations,
    type LanguageKeys,
    type TranslationSystemEvents
} from "@engine/Translations/TranslationSystem.ts";

export class GameApplication {
    private loadingBarElement = document.querySelector<HTMLElement>('#loading');
    private progressBarElement = document.querySelector<HTMLElement>('#progressbar');
    private canvasElement = document.getElementById("display");
    private languageButton = document.getElementById("language");

    /**
     * Called when all required resources are loaded
     */
    private OnRequiredResourcesLoaded() {
        // hide the loading bar
        if (this.loadingBarElement) {
            // TODO reenable
            //this.loadingBarElement.style.display = 'none';
        }
    }

    /**
     * Update the loading progress bar when a new resource is loaded
     * @param _url url of resource that got loaded
     * @param itemsLoaded number of items loaded
     * @param itemsTotal number of items to be loaded
     */
    private OnRequiredResourcesProgress(_url: string, itemsLoaded: number, itemsTotal: number) {
        if (this.progressBarElement) {
            this.progressBarElement.style.width = `${Math.max(itemsLoaded / itemsTotal * 100 | 0, 5)}%`;
        }
    };

    private InitializeLanguageManagement() {
        if (!this.languageButton) {
            throw new Error("Missing button to change language");
        }

        // Make the correct icon show depending on what the current language is
        const languageIcon = this.languageButton.querySelector("span");
        if (!languageIcon) {
            throw new Error("Failed to find language icon");
        }
        languageIcon.textContent = globalTranslations.GetCurrentLanguage().toUpperCase();

        // Attach event listeners
        this.languageButton.addEventListener("click", this.OnLanguageChangeClick.bind(this));

        globalTranslations.addEventListener("LanguageChanged", this.OnLanguageChange.bind(this));
    }

    private OnLanguageChangeClick(_event: PointerEvent) {
        const index = AvailableLanguages.indexOf(globalTranslations.GetCurrentLanguage()) + 1;
        const nextLanguageIndex = (index >= AvailableLanguages.length) ? 0 : index;
        const lang = AvailableLanguages[nextLanguageIndex];
        globalTranslations.ChangeLanguage(lang as LanguageKeys);
    }

    private OnLanguageChange(_event: TranslationSystemEvents["LanguageChanged"]) {
        if (!this.languageButton) {
            throw new Error("Missing button to change language");
        }

        const languageIcon = this.languageButton.querySelector("span");
        if (!languageIcon) {
            throw new Error("Failed to find language icon");
        }
        languageIcon.textContent = globalTranslations.GetCurrentLanguage().toUpperCase();
    }

    /**
     * Initialize the application
     */
    public Initialize() {
        if (!(this.canvasElement instanceof HTMLCanvasElement)) {
            throw new Error("Canvas element with id 'display' not found or is not a canvas.");
        }
        this.InitializeLanguageManagement();

        globalEngine.SetConfig({
            requiredResourcesConfig: {
                resources: ['emperorAngelfish'],
                options: {
                    onSuccess: this.OnRequiredResourcesLoaded.bind(this),
                    onProgress: this.OnRequiredResourcesProgress.bind(this),
                    onError: this.OnRequiredResourcesLoaded.bind(this),
                }
            }
        });
        globalEngine.Initialize(this.canvasElement);

        // -------------------------------------------------------------
        // Create the main game scene
        // -------------------------------------------------------------
        CreateGameScene(globalEngine.AddScene("gameScene"));
    }

    public GameLoop() {
        globalEngine.GameLoop();
    }

    public Shutdown() {
        globalEngine.Shutdown();
    }

}