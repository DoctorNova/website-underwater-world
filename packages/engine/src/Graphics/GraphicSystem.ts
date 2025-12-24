import * as THREE from "three";
import type {Scene} from "three";

export type ResizeCallback = (this: Window, ev: UIEvent) => void;

interface CameraSceneMapping {
  camera: THREE.Camera;
  scenes: Scene[];
}

class GraphicSystem {
  private cameras: Array<CameraSceneMapping> = [];
  private renderer?: THREE.WebGLRenderer;
  private resizeObservers: ResizeCallback[] = [];
  private mainCamera: number = -1;

  public Initialize(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setClearColor(0x000000, 1);
    // Respect CSS sizing; use device pixel ratio for crisp rendering
    this.ResizeCanvasToDisplaySize();
    this.OnResize(() => this.ResizeCanvasToDisplaySize());
  }

  public Render(_deltaTime: number): void {
    for (const { camera, scenes } of this.cameras) {
      for(const scene of scenes) {
        this.renderer?.render(scene, camera);
      }
    }
  }

  public Shutdown(): void {
    // Shutdown logic for the graphic system
    this.resizeObservers.forEach(callback => this.OffResize(callback));
  }

  public AddCamera(isMainCamera: boolean, camera: THREE.Camera, ...scenes: Scene[]): void {
    if (isMainCamera) {
      this.mainCamera = this.cameras.length;
    }
    this.cameras.push({camera, scenes: scenes});
  }

  public RemoveCamera(camera: THREE.Camera): void {
    const index = this.cameras.findIndex(item => { return item.camera == camera; });
    if (index >= 0) {
      this.cameras.splice(index, 1);
    }
  }

  public OnResize(callback: ResizeCallback): void {
    window.addEventListener('resize', callback);
    this.resizeObservers.push(callback);
  }

  public OffResize(callback: ResizeCallback): void {
    window.removeEventListener('resize', callback);
  }

  private ResizeCanvasToDisplaySize(): void {
    if (!this.renderer) {
      return;
    }

    const canvas = this.renderer.domElement;
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    // Update only internal drawing buffer to match CSS size
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(cssWidth, cssHeight, false);

    // adjust any cameras you have here
    for (const { camera } of this.cameras) {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = (cssWidth || 1) / (cssHeight || 1);
        camera.updateProjectionMatrix();
      }
    }
  }

  get Canvas(): HTMLCanvasElement | undefined {
    return this.renderer?.domElement;
  }

  GetActiveCamera(): THREE.Camera {
    if (this.mainCamera < 0 || this.mainCamera >= this.cameras.length) {
      throw new Error("No cameras available in GraphicSystem.");
    }
    return this.cameras[this.mainCamera].camera;
  }
}

export const globalGraphicSystem = new GraphicSystem();