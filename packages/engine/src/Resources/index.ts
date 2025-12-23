import { globalResourceManager, type ResourceName } from "./ResourceManager";

export type { AnimationClipsByClipName, AnimationResource } from "./CustomResourceLoaders/CustomGLTFLoader";
export type { ResourceName } from "./ResourceManager";

export function FetchResource<T>(resourceName: ResourceName): Promise<T> | undefined {
  return globalResourceManager.RequestResource<T>(resourceName);
}