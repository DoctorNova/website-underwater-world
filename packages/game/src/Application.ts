import { CreateGameScene } from "./CreateGameScene";
import {Engine} from "@engine/index.ts";

export class EditorApplication {
  private loadingBarElement = document.querySelector<HTMLElement>('#loading');
  private progressBarElement = document.querySelector<HTMLElement>('#progressbar');
  private progressInfoElement = document.querySelector<HTMLElement>('.info > p');
  private canvasElement = document.getElementById("display");
  private engine = new Engine({
    requiredResourcesConfig: {
      resources: ['emperorAngelfish'],
      options: {
        onSuccess: this.OnRequiredResourcesLoaded.bind(this),
        onProgress: this.OnRequiredResourcesProgress.bind(this),
        onError: this.OnRequiredResourcesLoaded.bind(this),
      }
    }
  });

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

    this.engine.Initialize(this.canvasElement);

    // -------------------------------------------------------------
    // Create the main game scene
    // -------------------------------------------------------------
    CreateGameScene(this.engine.AddScene());
  }

  public GameLoop() {
    this.engine.GameLoop();
  }

  public Shutdown() {
    this.engine.Shutdown();
  }

}