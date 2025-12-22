import type { GameObject } from "Composition";
import { Component } from "Composition/Component";
import { globalInputManager } from "Input/InputManager";
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
  
  Update(deltaTime: number): void {
    const moveDistance = this.speed * deltaTime;
    const forward = new THREE.Vector3();
    globalInputManager.IsKeyPressed("w") && forward.add(new THREE.Vector3(0, 1, 0));
    globalInputManager.IsKeyPressed("s") && forward.sub(new THREE.Vector3(0, 1, 0));
    globalInputManager.IsKeyPressed("a") && forward.sub(new THREE.Vector3(1, 0, 0));
    globalInputManager.IsKeyPressed("d") && forward.add(new THREE.Vector3(1, 0, 0));
    globalInputManager.IsKeyPressed(" ") && forward.add(new THREE.Vector3(0, 0, 1));
    globalInputManager.IsKeyPressed("Shift") && forward.sub(new THREE.Vector3(0, 0, 1));

    const cameraMovement = new THREE.Vector3(0, 0, 0);
    globalInputManager.IsKeyPressed("e") && cameraMovement.sub(new THREE.Vector3(1, 0, 0));
    globalInputManager.IsKeyPressed("q") && cameraMovement.add(new THREE.Vector3(1, 0, 0));

    this.camera.position.add(cameraMovement.multiplyScalar(moveDistance));

    forward.normalize().multiplyScalar(moveDistance);
    this.owner.transform.position.add(forward);
    this.camera.lookAt(this.owner.transform.position);
  }

  Shutdown(): void {
    
  }
}