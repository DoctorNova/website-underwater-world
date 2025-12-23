import type { GameObject } from "@engine/Composition/GameObject";
import * as THREE from "three";

export interface SceneObject {
  transform: THREE.Object3D;
  children: Array<GameObject>;
}

export class SceneRoot implements SceneObject {
  private scene = new THREE.Scene();
  public gameObjects: GameObject[] = [];

  public get transform() {
    return this.scene;
  }

  public get children(): Array<GameObject> {
    return this.gameObjects;
  }
}