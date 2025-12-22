import { globalBaseComponentManager } from "Composition/BaseComponentManager";
import { globalGameObjectManager } from "Composition/GameObjectManager";
import { CreateGameScene } from "CreateGameScene";
import { globalGraphicSystem } from "Graphics/GraphicSystem";
import { globalInputManager } from "Input/InputManager";
import type { ResourceName } from "Resources";
import { ResourceManager } from "Resources/ResourceManager";
import * as THREE from "three";
import { globalFrameTime } from "Utility/FrameTime";

export class Application {
  private loadingBarElement = document.querySelector<HTMLElement>('#loading');
  private progressBarElement = document.querySelector<HTMLElement>('#progressbar');
  private progressInfoElement = document.querySelector<HTMLElement>('.info > p');
  private canvasElement = document.getElementById("display");
  private scene = new THREE.Scene();

  /**
   * Called when all required resources are loaded
   */
  private OnRequiredResourcesLoaded() {
    // hide the loading bar
    if (this.loadingBarElement) {
      this.loadingBarElement.style.display = 'none';
    }
  }

  /**
   * Update the loading progress bar when a new resource is loaded
   * @param url url of resource that got loaded
   * @param itemsLoaded number of items loaded
   * @param itemsTotal number of items to be loaded
   */
  private OnRequiredResourcesProgress(url: string, itemsLoaded: number, itemsTotal: number) {
    if (this.progressBarElement) {
      this.progressBarElement.style.width = `${Math.max(itemsLoaded / itemsTotal * 100 | 0, 5)}%`;
    }
    if (this.progressInfoElement) {
      this.progressInfoElement.textContent = `loading: ${url}`;
    }
  };

  /**
   * Initialize the application
   */
  public Initialize() {
    if (!(this.canvasElement instanceof HTMLCanvasElement)) {
      throw new Error("Canvas element with id 'display' not found or is not a canvas.");
    }

    // -------------------------------------------------------------
    // Initialize all the global systems used in the application
    // -------------------------------------------------------------
    globalGameObjectManager.Initialize();
    globalBaseComponentManager.Initialize();
    globalGraphicSystem.Initialize(this.canvasElement);
    globalInputManager.Initialize();

    // -------------------------------------------------------------
    // Load all the resources needed before we can play the game
    // -------------------------------------------------------------
    const requiredResources: ResourceName[] = [
      'emperorAngelfish',
    ];
    const resourceLoader = new ResourceManager({
      onSuccess: this.OnRequiredResourcesLoaded.bind(this),
      onProgress: this.OnRequiredResourcesProgress.bind(this),
      onError: this.OnRequiredResourcesLoaded.bind(this),
    });
    resourceLoader.Load(...requiredResources);

    // -------------------------------------------------------------
    // Create the main game scene
    // -------------------------------------------------------------
    CreateGameScene(this.scene);
  }

  public GameLoop() {
    const render = (now: number) => {
      // ---------------------------------------------
      // Calculate total time and delta time
      // ---------------------------------------------
      globalFrameTime.Update(now);

      // ---------------------------------------------
      // Update all global systems
      // ---------------------------------------------
      globalGameObjectManager.Update(globalFrameTime.DeltaTime);
      globalBaseComponentManager.Update(globalFrameTime.DeltaTime);
      globalGraphicSystem.Render(globalFrameTime.DeltaTime, this.scene);

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