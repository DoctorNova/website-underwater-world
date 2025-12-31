import { OceanSkyBox } from '@game/SkyBox/OceanSkyBox';
import * as THREE from 'three';
import type {SceneRoot} from "@engine/Composition/SceneRoot.ts";
import {AnimationComponent} from "@engine/Graphics/AnimationComponent.ts";
import {BoidMovementComponent} from "@engine/Boid/BoidMovement.ts";
import type {BoidAgentConfig} from "@engine/Boid/BoidAgent.ts";
import type {ResourceName} from "@engine/Resources";

function CreateDirectionalLight(scene: SceneRoot) {
  const light = new THREE.DirectionalLight(0xFFFFFF, 0.6);
  // MAKE THE LIGHT CAST A SHADOW
  light.castShadow = true;
  // CHANGE TO MAKE THE AREA WHERE SHADOWS ARE CREATED BIGGER
  const lightWidth = 30;
  const lightHeight = 30;
  light.shadow.camera.left = -lightWidth / 2;
  light.shadow.camera.right = lightWidth / 2;
  light.shadow.camera.top = lightHeight / 2;
  light.shadow.camera.bottom = -lightHeight / 2;
  // Change the size of the shadow map to be crisp
  light.shadow.mapSize.set(2048, 2048);
  light.shadow.radius = 2;
  light.shadow.bias = -0.0001;
  light.shadow.normalBias = 0.02;

  light.position.set(10, 10, 10);
  light.target.position.set(-5, 0, 0);
  scene.transform.add(light);
  scene.transform.add(light.target);
}

export function CreateGameScene(scene: SceneRoot): void {
  // Set up lighting
  CreateDirectionalLight(scene);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.transform.add(ambientLight);

  // Set up skybox
  const skybox = new OceanSkyBox();
  scene.transform.add(skybox);

  // Create game objects
  const numberOfAngelfish = 10;
  const spawnRadius = 10;
  for(let i = 0; i < numberOfAngelfish; ++i) {
    const position = new THREE.Vector3().randomDirection().multiplyScalar(spawnRadius);
    scene.NewGameObject({
      name: `Angelfish-${i}`,
      parent: scene,
      position: position,
      componentsToCreate: [
          [AnimationComponent, ["emperorAngelfish" as ResourceName, 0, true]],
          [BoidMovementComponent, [{ maxSpeed: 2 } as BoidAgentConfig]]
      ]
    });
  }
}