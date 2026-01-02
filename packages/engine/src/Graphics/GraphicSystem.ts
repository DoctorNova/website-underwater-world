import * as THREE from "three";
import type {CameraComponent} from "@engine/Graphics/CameraComponent.ts";
import {RemoveItemFromArray} from "@engine/Utility/ArrayUtils.ts";

export type ResizeCallback = (this: Window, ev: UIEvent) => void;

class GraphicSystem {
  private cameras: Array<CameraComponent> = [];
  private renderer?: THREE.WebGLRenderer;
  private resizeObservers: ResizeCallback[] = [];
  private mainCamera: CameraComponent | undefined;

  public Initialize(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap; // to blur shadow edges.

    // Respect CSS sizing; use device pixel ratio for crisp rendering
    this.ResizeCanvasToDisplaySize();
  }

  public Render(_deltaTime: number): void {
    for (const { camera, scenes } of this.cameras) {
      for(const scene of scenes) {
        this.renderer?.render(scene.transform, camera);
      }
    }
  }

  public Shutdown(): void {
    // Shutdown logic for the graphic system
    this.resizeObservers.forEach(callback => this.OffResize(callback));
  }

  public AddCamera(isMainCamera: boolean, camera: CameraComponent): void {
    if (isMainCamera) {
      this.mainCamera = camera;
    }
    this.cameras.push(camera);
  }

  public RemoveCamera(camera: CameraComponent): void {
    RemoveItemFromArray(this.cameras, camera);
    if(this.mainCamera == camera){
      this.mainCamera = undefined;
    }
  }

  public OnResize(callback: ResizeCallback): void {
    window.addEventListener('resize', callback);
    this.resizeObservers.push(callback);
  }

  public OffResize(callback: ResizeCallback): void {
    window.removeEventListener('resize', callback);
  }

  public ResizeCanvasToDisplaySize(): void {
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

  GetActiveCamera(): CameraComponent {
    if (this.mainCamera === undefined) {
      throw new Error("No cameras available in GraphicSystem.");
    }
    return this.mainCamera;
  }
}

export const globalGraphicSystem = new GraphicSystem();