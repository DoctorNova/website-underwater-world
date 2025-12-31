import type { SceneRoot } from "@engine/Composition/SceneRoot.ts";
import { CameraComponent } from "@engine/Graphics/CameraComponent.ts";
import * as THREE from "three";
import { CameraControlComponent } from "./Components/CameraControlComponent";

export function CreateEditorScene(scene: SceneRoot, gameScene: SceneRoot) {
  // Set up camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, 5);

  const promise = scene.NewGameObject({
    name: "EditorCamera",
    parent: scene,
    position: new THREE.Vector3(0, 10, 10),
    componentsToCreate: [
      [CameraComponent, [camera, false, [scene, gameScene]]],
      [CameraControlComponent, [camera]],
    ]
  });

  promise.then(() => {
    scene.Update(0);
  });
}