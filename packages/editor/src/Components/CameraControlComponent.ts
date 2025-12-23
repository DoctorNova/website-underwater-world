import type { GameObject } from "@engine/Composition";
import { Component } from "@engine/Composition/Component";
import { globalInputManager } from "@engine/Input/InputManager";
import * as THREE from "three";

export class CameraControlComponent extends Component {
  private speed: number = 5;
  private camera: THREE.PerspectiveCamera;

  constructor(owner: GameObject, camera: THREE.PerspectiveCamera) {
    super(owner);
    this.camera = camera;
    
    owner.transform.add(this.camera);
    this.camera.lookAt(owner.transform.position.clone().add(new THREE.Vector3(0, 0, 1)));
  }

  Initialize(): void {
    
  }
  
  Update(deltaTime: number): void {
    const moveDistance = this.speed * deltaTime;
    const cameraForward = new THREE.Vector3();
    this.camera.getWorldDirection(cameraForward);
    const cameraRight = cameraForward.clone().cross(this.camera.up).normalize();
    const cameraMovement = new THREE.Vector3();
    globalInputManager.IsKeyPressed("w") && cameraMovement.add(cameraForward);
    globalInputManager.IsKeyPressed("s") && cameraMovement.sub(cameraForward);
    globalInputManager.IsKeyPressed("a") && cameraMovement.sub(cameraRight);
    globalInputManager.IsKeyPressed("d") && cameraMovement.add(cameraRight);
    globalInputManager.IsKeyPressed(" ") && cameraMovement.add(this.camera.up);
    globalInputManager.IsKeyPressed("Shift") && cameraMovement.sub(this.camera.up);

    const cameraMovementThisFrame = cameraMovement.normalize().multiplyScalar(moveDistance);
    this.owner.transform.position.add(cameraMovementThisFrame);

    const targetMovement = new THREE.Vector3();
    globalInputManager.IsKeyPressed("e") && targetMovement.add(cameraRight);
    globalInputManager.IsKeyPressed("q") && targetMovement.sub(cameraRight);
    this.camera.position.add(targetMovement.normalize().multiplyScalar(moveDistance));

    // Make the camera look at the updated target position
    const target = this.owner.transform.position.clone().add(cameraForward);
    this.camera.lookAt(target);
  }

  Shutdown(): void {
    
  }
}