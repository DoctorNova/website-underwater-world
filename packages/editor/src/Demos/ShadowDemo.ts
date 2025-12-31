import type { SceneRoot } from "@engine/Composition/SceneRoot.ts";
import * as THREE from "three";
import {globalFrameTime} from "@engine/Utility/FrameTime.ts";

interface Sphere {
    base: THREE.Object3D,
    sphereMesh: THREE.Mesh,
    y: number
}

const sphereShadowBases = new Array<Sphere>();

function CreatePlane(loader: THREE.TextureLoader, scene: THREE.Scene){
    const planeSize = 40;

    const texture = loader.load('images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    planeMat.color.setRGB(1.5, 1.5, 1.5);
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    mesh.receiveShadow = true; // TODO: Make the ground only receive shadows
    scene.add(mesh);
}

function CreateBalls(_: THREE.TextureLoader, scene: THREE.Scene){
    const sphereRadius = 1;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);

    const numSpheres = 15;
    for (let i = 0; i < numSpheres; ++i) {
        // make a base for the shadow and the sphere
        // so they move together.
        const base = new THREE.Object3D();
        scene.add(base);

        // add the sphere to the base
        const u = i / numSpheres;   // goes from 0 to 1 as we iterate the spheres.
        const sphereMat = new THREE.MeshPhongMaterial();
        sphereMat.color.setHSL(u, 1, .75);
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        sphereMesh.castShadow = true;
        sphereMesh.receiveShadow = true;
        sphereMesh.position.set(0, sphereRadius * 2, 0);
        base.add(sphereMesh);

        // remember all 3 plus the y position
        sphereShadowBases.push({base, sphereMesh, y: sphereMesh.position.y});
    }
}

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

    light.position.set(0, 100, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);

    // HELPER TO SEE WHERE THE LIGHT WILL CAST A SHADOW
    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(cameraHelper);


}

export function CreateShadowDemoScene(gameSceneRoot: SceneRoot) {
    const loader = new THREE.TextureLoader();
    CreatePlane(loader, gameSceneRoot.transform);
    CreateBalls(loader, gameSceneRoot.transform);
    CreateDirectionLight(gameSceneRoot.transform);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    gameSceneRoot.transform.add(ambientLight);

    //scene.NewGameObject({
    //  name: "Fish",
    //  parent: scene,
    //  scale: 10,
    //  componentsToCreate: [
    //    [AnimationComponent, ["fusilier", 0]]
    //  ]
    //});
}

export function UpdateShadowDemoScene() {
    const time = globalFrameTime.Time;

    sphereShadowBases.forEach((sphereShadowBase, ndx) => {
        const {base, sphereMesh, y} = sphereShadowBase;

        // u is a value that goes from 0 to 1 as we iterate the spheres
        const u = ndx / sphereShadowBases.length;

        // compute a position for the base. This will move
        // both the sphere and its shadow
        const speed = time * .2;
        const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1);
        const radius = Math.sin(speed - ndx) * 10;
        base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);

        // yOff is a value that goes from 0 to 1
        const yOff = Math.abs(Math.sin(time + ndx) * 5);
        // move the sphere up and down
        sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff);
    });
}