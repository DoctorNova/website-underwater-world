import * as THREE from "three";

export type ResizeCallback = (this: Window, ev: UIEvent) => void;

class GraphicSystem {
  private cameras: Array<THREE.Camera> = [];
  private renderer?: THREE.WebGLRenderer;
  private resizeObservers: ResizeCallback[] = [];

  public Initialize(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.OnResize(() => this.ResizeCanvasToDisplaySize());
  }

  public Render(_deltaTime: number, scene: THREE.Scene): void {
    for (const camera of this.cameras) {
      this.renderer?.render(scene, camera);
    }
  }

  public Shutdown(): void {
    // Shutdown logic for the graphic system
    this.resizeObservers.forEach(callback => this.OffResize(callback));
  }

  public AddCamera(camera: THREE.Camera): void {
    this.cameras.push(camera);
  }

  public RemoveCamera(camera: THREE.Camera): void {
    const index = this.cameras.indexOf(camera);
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
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      this.renderer.setSize(width, height);

      // adjust any cameras you have here
      for (const camera of this.cameras) {
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      }
    }
  }

  get Canvas(): HTMLCanvasElement | undefined {
    return this.renderer?.domElement;
  }

  GetActiveCamera(): THREE.Camera {
    if (this.cameras.length === 0) {
      throw new Error("No cameras available in GraphicSystem.");
    }
    return this.cameras[0];
  }
}

export const globalGraphicSystem = new GraphicSystem();