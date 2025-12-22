import { globalBaseComponentManager } from "Composition/BaseComponentManager";
import { globalGameObjectManager } from "Composition/GameObjectManager";
import { CreateGameObjects } from "Game/CreateGameObjects";
import { globalGraphicSystem } from "Graphics/GraphicSystem";
import type { ResourceName } from "ResourceManager";
import { ResourceManager } from "ResourceManager/Manager";
import * as THREE from "three";
import { globals } from "Utility/global";

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

    globalGameObjectManager.Initialize();
    globalBaseComponentManager.Initialize();
    globalGraphicSystem.Initialize(this.canvasElement);

    const requiredResources: ResourceName[] = [
      'emperorAngelfish',
    ];
    const resourceLoader = new ResourceManager({
      onSuccess: this.OnRequiredResourcesLoaded.bind(this),
      onProgress: this.OnRequiredResourcesProgress.bind(this),
      onError: this.OnRequiredResourcesLoaded.bind(this),
    });
    resourceLoader.Load(...requiredResources);

    CreateGameObjects(this.scene);
  }

  public RenderLoop() {
    let then = 0;
    const render = (now: number) => {
      // convert to seconds
      globals.time = now * 0.001;
      // make sure delta time isn't too big.
      globals.deltaTime = Math.min(globals.time - then, 1 / 20);
      then = globals.time;

      globalGameObjectManager.Update(globals.deltaTime);
      globalBaseComponentManager.Update(globals.deltaTime);
      globalGraphicSystem.Render(globals.deltaTime, this.scene);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  public Shutdown() {
    globalGraphicSystem.Shutdown();
    globalGameObjectManager.Shutdown();
    globalBaseComponentManager.Shutdown();
  }

}