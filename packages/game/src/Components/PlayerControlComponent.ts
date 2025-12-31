import {Component} from "@engine/Composition/Component";
import {CameraComponent} from "@engine/Graphics/CameraComponent.ts";
import {globalInputManager} from "@engine/Input/InputManager.ts";
import * as THREE from "three";

export class PlayerControlComponent extends Component {
    private speed: number = 5;
    private cameraComp: CameraComponent | undefined;

    private edgeRotateThreshold: number = 0.2; // NDC threshold to start edge rotation
    private edgeRotateScale: number = 0.01;    // scales edge-induced rotation amount

    Initialize(): void {
        this.cameraComp = this.owner.RequireComponent(CameraComponent);
    }

    Update(deltaTime: number): void {
        if (!this.cameraComp) {
            return;
        }
        if (!(globalInputManager.IsWindowFocused() && globalInputManager.IsCanvasHovered())){
            return;
        }
        const moveDistance = this.speed * deltaTime;
        const cameraForward = new THREE.Vector3();
        this.cameraComp.camera.getWorldDirection(cameraForward);
        // After calculating cameraForward and cameraRight
        const cameraUp = new THREE.Vector3(0, 1, 0); // Default up vector
        cameraUp.applyQuaternion(this.cameraComp.camera.quaternion); // Adjust up vector based on camera's rotation
        const cameraRight = cameraForward.clone().cross(cameraUp).normalize();

        const cameraMovement = new THREE.Vector3();
        // --------------------------------------------------------
        // move forward or backward
        // --------------------------------------------------------
        globalInputManager.IsKeyPressed("w") && cameraMovement.add(cameraForward);
        globalInputManager.IsKeyPressed("s") && cameraMovement.sub(cameraForward);
        globalInputManager.IsKeyPressed("a") && cameraMovement.sub(cameraRight);
        globalInputManager.IsKeyPressed("d") && cameraMovement.add(cameraRight);

        // Apply movement to camera position.
        const cameraMovementThisFrame = cameraMovement.normalize().multiplyScalar(moveDistance);
        this.owner.transform.position.add(cameraMovementThisFrame);

        // --------------------------------------------------------
        // rotate camera
        // --------------------------------------------------------

        const mouseMovement = globalInputManager.GetMousePositionChange();

        if (mouseMovement.lengthSq() == 0) {
            // rotate based on mouse movement
            // Edge-rotation: keep rotating when near canvas edges
            const ndc = globalInputManager.GetMousePositionInNDC();
            const th = this.edgeRotateThreshold;
            const overX = Math.max(Math.abs(ndc.x) - th, 0) / (1 - th);
            const overY = Math.max(Math.abs(ndc.y) - th, 0) / (1 - th);

            if (overX > 0 || overY > 0) {
                const targetMovement = new THREE.Vector3();
                const yawDir = ndc.x >= 0 ? -1 : 1;   // mirror mouseDelta.x mapping
                const pitchDir = ndc.y >= 0 ? -1 : 1; // mirror mouseDelta.y mapping

                const yawEdge = cameraRight.clone().multiplyScalar(yawDir * overX);
                const pitchEdge = cameraUp.clone().multiplyScalar(pitchDir * overY);
                targetMovement.add(yawEdge);
                targetMovement.add(pitchEdge);

                const distanceFromCenter = ndc.length();
                this.cameraComp.camera.position.add(targetMovement.normalize().multiplyScalar(moveDistance * this.edgeRotateScale * distanceFromCenter));
            }
        }

        // Make the camera look at the updated target position
        const target = this.owner.transform.position.clone().add(cameraForward);
        this.cameraComp.camera.lookAt(target);
    }

    Shutdown(): void {

    }
}