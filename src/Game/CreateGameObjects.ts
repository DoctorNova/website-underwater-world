import { CreateGameObject } from 'Composition';
import { globalGraphicSystem } from 'Graphics/GraphicSystem';
import { AnimationComponent } from 'Graphics/SkinComponent';
import { OceanSkyBox } from 'SkyBox/OceanSkyBox';
import * as THREE from 'three';

export function CreateGameObjects(scene: THREE.Scene): void {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);
  globalGraphicSystem.AddCamera(camera);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const skybox = new OceanSkyBox();
  scene.add(skybox);

  CreateGameObject({
    parent: scene, 
    componentsToCreate: [
      [AnimationComponent, ["emperorAngelfish", "EmperorAngelfish|Take 001|BaseLayer"]]
    ]
  });
}