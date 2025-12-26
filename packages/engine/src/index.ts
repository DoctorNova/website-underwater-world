import {globalBaseComponentManager} from "@engine/Composition/BaseComponentManager";
import {globalGraphicSystem} from "@engine/Graphics/GraphicSystem";
import {globalInputManager} from "@engine/Input/InputManager";
import type {ResourceName} from "@engine/Resources";
import {type LoadOptions, ResourceManager} from "@engine/Resources/ResourceManager";
import {globalFrameTime} from "@engine/Utility/FrameTime";
import {SceneRoot} from "@engine/Composition/SceneRoot.ts";
import {EventDispatcher} from "three";

export interface EngineOptions {
    paused?: boolean;
    requiredResourcesConfig?: {
        resources: ResourceName[],
        options: LoadOptions,
    };
}

export interface GameLoopHooks {
    onUpdate?: (deltaTime: number) => void;
    beforeRender?: (deltaTime: number) => void;
}

export type EngineEvents = {
    SceneInitialized: {
        scene: SceneRoot;
    },
    SceneCleared: {
        scene: SceneRoot;
    }
};

class Engine extends EventDispatcher<EngineEvents> {
    private scenes: SceneRoot[] = [];
    private paused = false;
    private options?: EngineOptions;

    public SetConfig(options: EngineOptions) {
        this.options = options;
        this.paused = options?.paused ?? false;
    }

    public AddScene(name: string): SceneRoot {
        const newScene = new SceneRoot();
        newScene.transform.name = name;
        this.scenes.push(newScene);
        newScene.Initialize();
        this.dispatchEvent({
            type: "SceneInitialized",
            scene: newScene,
        });
        return newScene;
    }

    public EmptyScene(scene: SceneRoot) {
        scene.Clear();
        this.dispatchEvent({
            type: "SceneCleared",
            scene,
        });
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

    private LoadRequiredResource(config: Required<EngineOptions>["requiredResourcesConfig"]): void {
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
            if (!this.paused) {
                globalBaseComponentManager.Update(globalFrameTime.DeltaTime);
                for (const scene of this.scenes) {
                    scene.Update(globalFrameTime.DeltaTime);
                }
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
        globalBaseComponentManager.Shutdown();
        globalInputManager.Shutdown();
    }
}

export const globalEngine = new Engine();