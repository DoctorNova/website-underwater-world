import * as THREE from 'three';
import {
  GLTFLoader,
  type GLTF,
} from 'three/addons/loaders/GLTFLoader.js';

import type { CustomResourceLoader } from "./CustomResourceLoader";

export type AnimationClipsByClipName = Map<string, THREE.AnimationClip>;
export interface AnimationResource {
  gltf: GLTF;
  animations: AnimationClipsByClipName;
}

export class CustomGLTFLoader implements CustomResourceLoader {
  private loader: GLTFLoader;

  constructor(manager: THREE.LoadingManager) {
    this.loader = new GLTFLoader(manager);
  }

  private OnSuccessCallback(resolve: (value: AnimationResource) => void, gltf: GLTF): void {

    // Ensure all materials are do not contain transparency
    gltf.scene.traverse((o) => {
      const child = o as unknown as THREE.Mesh;
      if (child.isMesh) {
        const cb = (m: THREE.Material) => {
          m.depthTest = true;
          m.depthWrite = true;
          m.transparent = false; // or true if intentionally transparent
        }

        if (Array.isArray(child.material)) {
          child.material.forEach(cb);
        } else {
          cb(child.material);
        }
      }
    });

    //gltf contains the following useful properties:
    //gltf.animations; // Array<THREE.AnimationClip>
    //gltf.scene; // THREE.Group
    //gltf.scenes; // Array<THREE.Group>
    //gltf.cameras; // Array<THREE.Camera>
    //gltf.asset; // Object

    const result: AnimationResource = { gltf, animations: new Map<string, THREE.AnimationClip>() };
    gltf.animations.forEach((clip) => {
      result.animations.set(clip.name, clip);
    });

    resolve(result);
  }

  private OnErrorCallback(reject: ((reason?: any) => void), error: unknown): void {
    reject(error);
  }

  Load(resourcePath: string): Promise<AnimationResource> {
    return new Promise<AnimationResource>((resolve, reject) => {
      this.loader.load(resourcePath, this.OnSuccessCallback.bind(this, resolve), undefined, this.OnErrorCallback.bind(this, reject));
    });
  }
}