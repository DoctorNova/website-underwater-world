import type {SceneRoot} from "@engine/Composition/SceneRoot.ts";
import {AnimationComponent} from "@engine/Graphics/AnimationComponent.ts";
import * as THREE from "three";

function CreateDirectionLight(scene: THREE.Scene){
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    // TODO: MAKE THE LIGHT CAST A SHADOW
    light.castShadow = true;
    // TODO: CHANGE TO MAKE THE AREA WHERE SHADOWS ARE CREATED BIGGER
    const lightWidth = 30;
    const lightHeight = 30;
    light.shadow.camera.left = -lightWidth / 2;
    light.shadow.camera.right = lightWidth / 2;
    light.shadow.camera.top = lightHeight / 2;
    light.shadow.camera.bottom = -lightHeight / 2;
    // TODO: Change the size of the shadow map to be crisp
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.radius = 2;
    light.shadow.bias = -0.0001;
    light.shadow.normalBias = 0.02;

    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);

    // HELPER TO SEE WHERE THE LIGHT WILL CAST A SHADOW
    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(cameraHelper);


}


export function CreateTestDemo(scene: SceneRoot) {
    CreateDirectionLight(scene.transform);
    scene.NewGameObject({
      name: "Fish",
      parent: scene,
      scale: 10,
      componentsToCreate: [
        [AnimationComponent, ["fusilier", 0]]
      ]
    }).then(() => {
        scene.Update(0);
    })
}

export function UpdateTestDemoScene() {

}