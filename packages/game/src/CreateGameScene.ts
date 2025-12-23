import { CreateGameObject } from '@engine/Composition';
import type { SceneRoot } from '@engine/Composition/SceneObject';
import { globalGraphicSystem } from '@engine/Graphics/GraphicSystem';
import { AnimationComponent } from '@engine/Graphics/SkinComponent';
import { OceanSkyBox } from '@game/SkyBox/OceanSkyBox';
import * as THREE from 'three';

function CreateGround(scene: THREE.Scene) {
  const planeSize = 40;
 
  const loader = new THREE.TextureLoader();
  const texture = loader.load('images/checker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  const repeats = planeSize / 2;
  texture.repeat.set(repeats, repeats);
 
  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  planeMat.color.setRGB(1.5, 1.5, 1.5);
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -.5;
  mesh.position.y = -5;
  scene.add(mesh);
}

export function CreateGameScene(scene: SceneRoot): void {

  // Set up camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);
  globalGraphicSystem.AddCamera(camera);

  // Set up lighting
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(10, 10, 10);
  scene.transform.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.transform.add(ambientLight);

  // Set up skybox
  const skybox = new OceanSkyBox();
  scene.transform.add(skybox);

  // Set up ground
  CreateGround(scene.transform);

  // Create game objects
  CreateGameObject({
    parent: scene, 
    scale: 10,
    componentsToCreate: [
      [AnimationComponent, ["fusilier", 0]]
    ]
  });
}