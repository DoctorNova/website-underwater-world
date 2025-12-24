import { CreateGameObject } from "@engine/Composition";
import type { SceneRoot } from "@engine/Composition/SceneObject";
import { globalGraphicSystem } from "@engine/Graphics/GraphicSystem";
import { CameraControlComponent } from "./Components/CameraControlComponent";
import * as THREE from "three";
import {globalGameObjectManager} from "@engine/Composition/GameObjectManager.ts";

export function CreateEditorScene(scene: SceneRoot, gameScene: SceneRoot) {
  // Set up camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);
  globalGraphicSystem.AddCamera(false, camera, gameScene.transform);

  const promise = CreateGameObject({
    parent: scene, 
    componentsToCreate: [
      [CameraControlComponent, [camera]],
    ]
  });

  promise.then(() => {
    globalGameObjectManager.Update(0);
  });
}