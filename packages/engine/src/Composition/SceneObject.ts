import type { GameObject } from "@engine/Composition/GameObject";
import * as THREE from "three";

export interface SceneObject {
  transform: THREE.Object3D;
  children: Array<GameObject>;
}