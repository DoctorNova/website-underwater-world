import { OceanSkyBox } from '@game/SkyBox/OceanSkyBox';
import * as THREE from 'three';
import type {SceneRoot} from "@engine/Composition/SceneRoot.ts";

export function CreateGameScene(scene: SceneRoot): void {
  // Set up lighting
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(10, 10, 10);
  scene.transform.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.transform.add(ambientLight);

  // Set up skybox
  const skybox = new OceanSkyBox();
  scene.transform.add(skybox);

  // Create game objects
}