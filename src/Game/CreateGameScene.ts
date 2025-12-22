import { PlayerControlComponent } from 'Components/PlayerControlComponent';
import { CreateGameObject } from 'Composition';
import { globalGraphicSystem } from 'Graphics/GraphicSystem';
import { AnimationComponent } from 'Graphics/SkinComponent';
import { OceanSkyBox } from 'SkyBox/OceanSkyBox';
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

export function CreateGameScene(scene: THREE.Scene): void {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);
  globalGraphicSystem.AddCamera(camera);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const skybox = new OceanSkyBox();
  scene.add(skybox);

  CreateGround(scene);

  CreateGameObject({
    parent: scene, 
    scale: 10,
    componentsToCreate: [
      [AnimationComponent, ["fusilier", 0]]
    ]
  });

  CreateGameObject({
    parent: scene, 
    componentsToCreate: [
      [PlayerControlComponent, [camera]],
      [AnimationComponent, ["emperorAngelfish", "EmperorAngelfish|Take 001|BaseLayer"]]
    ]
  });
}