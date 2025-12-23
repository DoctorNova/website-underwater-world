import type { GameObject } from "@engine/Composition";
import { Component } from "@engine/Composition/Component";
import * as THREE from "three";

export class PlayerControlComponent extends Component {
  private camera: THREE.PerspectiveCamera;
  
  constructor(owner: GameObject, camera: THREE.PerspectiveCamera) {
    super(owner);
    this.camera = camera;
    
    owner.transform.add(this.camera);
    this.camera.position.set(0, 2, -5);
    this.camera.lookAt(owner.transform.position);
  }

  Initialize(): void {
    
  }
  
  Update(_deltaTime: number): void {
    // TODO
  }

  Shutdown(): void {
    
  }
}