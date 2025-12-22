import type { GameObject } from "Composition";
import { Component } from "Composition/Component";
import * as THREE from "three";

export class PlayerControlComponent extends Component {
  private speed: number = 5;
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