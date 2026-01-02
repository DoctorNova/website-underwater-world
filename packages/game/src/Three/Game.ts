import {CreateGameScene} from "./CreateGameScene.ts";
import {globalEngine} from "@engine/index.ts";
import {globalGraphicSystem} from "@engine/Graphics/GraphicSystem.ts";
import type {LoadOptions} from "@engine/Resources/ResourceManager.ts";

export class GameApplication {
    private readonly canvasElement : HTMLCanvasElement;
    private readonly callbacks: LoadOptions;

    constructor(canvasElement: HTMLCanvasElement, callbacks: LoadOptions) {
        this.canvasElement = canvasElement;
        this.callbacks = callbacks;
    }

    public Resize() {
        globalGraphicSystem.ResizeCanvasToDisplaySize()
    }

    /**
     * Initialize the application
     */
    public Initialize() {
        if (!(this.canvasElement instanceof HTMLCanvasElement)) {
            throw new Error("Canvas element with id 'display' not found or is not a canvas.");
        }
        globalEngine.SetConfig({
            requiredResourcesConfig: {
                resources: ['emperorAngelfish'],
                options: this.callbacks
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