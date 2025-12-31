import type { SceneObject } from "@engine/Composition/SceneObject.ts";
import * as THREE from "three";
import { type ComponentsToCreateList, GameObject } from "./GameObject";

interface GameObjectInAddQueue {
  object: GameObject;
  parent: SceneObject;
}

export interface GameObjectConfig {
  name: string;
  parent: SceneObject,
  position?: THREE.Vector3,
  rotation?: THREE.Euler,
  scale?: THREE.Vector3 | number,
  componentsToCreate?: ComponentsToCreateList[]
}

export class SceneRoot implements SceneObject {
  private gameObjects = new Array<GameObject>();
  private addQueue = new Array<GameObjectInAddQueue>();
  private removeQueue = new Array<GameObject>();
  private abortController = new AbortController();
  private scene = new THREE.Scene();

  get length() {
    return this.addQueue.length + this.gameObjects.length;
  }

  public get transform() {
    return this.scene;
  }

  public get children(): Array<GameObject> {
    return this.gameObjects;
  }

  IsEmpty() {
    return this.length === 0;
  }

  public async NewGameObject(config: GameObjectConfig): Promise<GameObject> {
    const object = new GameObject(config.componentsToCreate ?? []);

    if (config.position !== undefined){
      object.transform.position.copy(config.position);
    }
    if (config.rotation !== undefined){
      object.transform.rotation.copy(config.rotation);
    }

    if (config.scale instanceof THREE.Vector3){
      object.transform.scale.copy(config.scale);
    }
    else if (typeof config.scale === 'number'){
      object.transform.scale.setScalar(config.scale);
    }

    await object.LoadResources(this.abortController.signal);
    this.addQueue.push({object, parent: config.parent ?? this});

    return object;
  }

  public DestroyGameObject(element: GameObject) {
    this.removeQueue.push(element);
  }

  Clear() {
    this.Shutdown();
  }

  Initialize(): void {
    this.gameObjects.forEach(gameObject => gameObject.Initialize());
  }
  Update(_: number): void {
    this._addQueued();
    this._removeQueued();
  }
  Shutdown(): void {  
    this.gameObjects.forEach(gameObject => gameObject.Shutdown());
    this.addQueue.forEach(({ object }) => object.Shutdown());
    this._disposeScene();
    this.abortController.abort();
    this.abortController = new AbortController();
  }

  /**
   * Properly disposes of all THREE.js resources in the scene to prevent memory leaks.
   * This includes geometries, materials, textures, and the scene itself.
   * @private
   */
  private _disposeScene(): void {
    // Traverse the scene and dispose of all resources
    this.scene.traverse((object: THREE.Object3D) => {
      // Dispose geometries and materials for Mesh objects
      const mesh = object as unknown as any;
      if (mesh.geometry && mesh.material) {
        (mesh.geometry as THREE.BufferGeometry).dispose?.();

        // Dispose materials (handle both single material and material arrays)
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material: THREE.Material) => {
          // Dispose textures in the material
          Object.keys(material).forEach((key: string) => {
            const value = (material as any)[key];
            if (value && typeof value.dispose === 'function') {
              value.dispose();
            }
          });
          material.dispose();
        });
      }
    });

    // Clear the scene
    this.scene.clear();
    this.gameObjects = [];
    this.addQueue = [];
    this.removeQueue = [];
  }
   
  private _addQueued() {
    if (this.addQueue.length) {
      this.addQueue.forEach(({ object, parent }) => object.SetParent(parent));
      this.addQueue.forEach(({ object }) => object.Initialize());
      this.addQueue = [];
    }
  }

  private _removeQueued() {
    if (this.removeQueue.length) {
      this.removeQueue.forEach((object) => {
        object.__Destroy();
      })
      this.removeQueue = [];
    }
  }
}
