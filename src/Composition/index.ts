import type { Scene } from "three";
import * as THREE from "three";
import { GameObject, type ComponentsToCreateList } from "./GameObject";
import { globalGameObjectManager } from "./GameObjectManager";

export * from "./GameObject";

export interface GameObjectConfig {
    parent: GameObject | Scene, 
    position?: THREE.Vector3,
    rotation?: THREE.Euler, 
    scale?: THREE.Vector3 | number, 
    componentsToCreate?: ComponentsToCreateList
};

export async function CreateGameObject(config: GameObjectConfig): Promise<GameObject> {
  const object = new GameObject(config.parent, config.componentsToCreate ?? []);
  await globalGameObjectManager.Add(object);

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

  return object;
}

export function DestroyGameObject(object: GameObject) {
  globalGameObjectManager.Remove(object);
}
