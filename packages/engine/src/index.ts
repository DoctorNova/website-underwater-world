import { globalBaseComponentManager } from "@engine/Composition/BaseComponentManager";
import { globalGameObjectManager } from "@engine/Composition/GameObjectManager";
import { SceneRoot } from "@engine/Composition/SceneObject";
import { globalGraphicSystem } from "@engine/Graphics/GraphicSystem";
import { globalInputManager } from "@engine/Input/InputManager";
import type { ResourceName } from "@engine/Resources";
import {type LoadOptions, ResourceManager} from "@engine/Resources/ResourceManager";
import { globalFrameTime } from "@engine/Utility/FrameTime";
import {RemoveItemFromArray} from "@engine/Utility/ArrayUtils.ts";

export interface EngineOptions {
    paused?: boolean;
    requiredResourcesConfig?: {
        resources: ResourceName[],
        options: LoadOptions,
    };
}

export interface GameLoopHooks {
    onUpdate?: (deltaTime: number) => void;
    beforeRender? :(deltaTime: number) => void;
}

export class Engine {
    private scenes: SceneRoot[] = [];
    private paused = false;

    constructor(private options?: EngineOptions)
    {
        this.paused = options?.paused ?? false;
    }

    public AddScene(): SceneRoot {
        const newScene = new SceneRoot();
        this.scenes.push(newScene);
        return newScene;
    }

    public RemoveScene(scene: SceneRoot){
        RemoveItemFromArray(this.scenes, scene);
    }

    public get isPaused() {
        return this.paused;
    }

    public Play() {
        this.paused = false;
    }

    public Pause() {
        this.paused = true;
    }

    private LoadRequiredResource(config: Required<EngineOptions>["requiredResourcesConfig"]) : void {
        if (config.resources.length > 0) {
            const resourceLoader = new ResourceManager(config.options);
            resourceLoader.Load(...config.resources);
        } else {
            config.options?.onSuccess?.();
        }
    }

    /**
     * Initialize the application
     */
    public Initialize(canvasElement: HTMLCanvasElement) {
        // -------------------------------------------------------------
        // Initialize all the global systems used in the application
        // -------------------------------------------------------------
        globalGameObjectManager.Initialize();
        globalBaseComponentManager.Initialize();
        globalGraphicSystem.Initialize(canvasElement);
        globalInputManager.Initialize();

        // -------------------------------------------------------------
        // Load all the resources needed before we can play the game
        // -------------------------------------------------------------
        const resourceConfig = this.options?.requiredResourcesConfig;
        if (resourceConfig) {
            this.LoadRequiredResource(resourceConfig);
        }
    }

    public GameLoop(hooks?: GameLoopHooks) {
        const render = (now: number) => {
            // ---------------------------------------------
            // Calculate total time and delta time
            // ---------------------------------------------
            globalFrameTime.Update(now);
            globalInputManager.BeginFrame();

            // ---------------------------------------------
            // Update all global systems
            // ---------------------------------------------
            if (!this.paused){
                globalGameObjectManager.Update(globalFrameTime.DeltaTime);
                globalBaseComponentManager.Update(globalFrameTime.DeltaTime);
                hooks?.onUpdate?.(globalFrameTime.DeltaTime);
            }
            hooks?.beforeRender?.(globalFrameTime.DeltaTime);
            globalGraphicSystem.Render(globalFrameTime.DeltaTime);

            globalInputManager.EndFrame();
            // Request the next frame
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }

    public Shutdown() {
        globalGraphicSystem.Shutdown();
        globalGameObjectManager.Shutdown();
        globalBaseComponentManager.Shutdown();
        globalInputManager.Shutdown();
    }

}