import type { GameObject } from "@engine/Composition";
import { Component } from "@engine/Composition/Component";
import { globalInputManager } from "@engine/Input/InputManager";
import * as THREE from "three";

export class CameraControlComponent extends Component {
  private speed: number = 5;
  private camera: THREE.PerspectiveCamera;

  private edgeRotateThreshold: number = 0.7; // NDC threshold to start edge rotation
  private edgeRotateScale: number = 0.75;    // scales edge-induced rotation amount

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
    // After calculating cameraForward and cameraRight
    const cameraUp = new THREE.Vector3(0, 1, 0); // Default up vector
    cameraUp.applyQuaternion(this.camera.quaternion); // Adjust up vector based on camera's rotation
    const cameraRight = cameraForward.clone().cross(cameraUp).normalize();

    const cameraMovement = new THREE.Vector3();
    // --------------------------------------------------------
    // movement on the xz-plane
    // --------------------------------------------------------
    const xzPlaneForward = new THREE.Vector3(cameraForward.x, 0, cameraForward.z).normalize();
    const xzPlaneRight = new THREE.Vector3(cameraRight.x, 0, cameraRight.z).normalize();
    globalInputManager.IsKeyPressed("w") && cameraMovement.add(xzPlaneForward);
    globalInputManager.IsKeyPressed("s") && cameraMovement.sub(xzPlaneForward);
    globalInputManager.IsKeyPressed("a") && cameraMovement.sub(xzPlaneRight);
    globalInputManager.IsKeyPressed("d") && cameraMovement.add(xzPlaneRight);

    // --------------------------------------------------------
    // movement on the y-axis
    // --------------------------------------------------------
    const yAxis = new THREE.Vector3(0, 1, 0);
    const yAxisScroll = globalInputManager.GetMouseScroll().y;
    const changeOnYAxis = yAxis.clone().multiplyScalar(-yAxisScroll).normalize();
    cameraMovement.add(changeOnYAxis);

    // Apply movement to camera position.
    const cameraMovementThisFrame = cameraMovement.normalize().multiplyScalar(moveDistance);
    this.owner.transform.position.add(cameraMovementThisFrame);

    // --------------------------------------------------------
    // rotate camera
    // --------------------------------------------------------
    const targetMovement = new THREE.Vector3();

    const mouseMovement = globalInputManager.GetMousePositionChange();
    if (globalInputManager.IsWindowFocused() && globalInputManager.IsCanvasHovered() && mouseMovement.lengthSq() == 0) {
      // rotate based on mouse movement
      // Edge-rotation: keep rotating when near canvas edges
      const ndc = globalInputManager.GetMousePositionInNDC();
      const th = this.edgeRotateThreshold;
      const overX = Math.max(Math.abs(ndc.x) - th, 0) / (1 - th);
      const overY = Math.max(Math.abs(ndc.y) - th, 0) / (1 - th);

      if (overX > 0 || overY > 0) {
        const yawDir = ndc.x >= 0 ? -1 : 1;   // mirror mouseDelta.x mapping
        const pitchDir = ndc.y >= 0 ? -1 : 1; // mirror mouseDelta.y mapping

        const yawEdge = cameraRight.clone().multiplyScalar(yawDir * overX * this.edgeRotateScale);
        const pitchEdge = cameraUp.clone().multiplyScalar(pitchDir * overY * this.edgeRotateScale);
        targetMovement.add(yawEdge);
        targetMovement.add(pitchEdge);
      }
    }

    // yawn (rotate around y-axis) with e and q keys.
    globalInputManager.IsKeyPressed("q") && targetMovement.add(cameraRight);
    globalInputManager.IsKeyPressed("e") && targetMovement.sub(cameraRight);
    this.camera.position.add(targetMovement.normalize().multiplyScalar(moveDistance));

    // Make the camera look at the updated target position
    const target = this.owner.transform.position.clone().add(cameraForward);
    this.camera.lookAt(target);
  }

  Shutdown(): void {

  }
}