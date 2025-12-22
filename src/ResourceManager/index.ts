import { globalResourceManager, type ResourceName } from "./Manager";

export type { AnimationClipsByClipName, AnimationResource } from "./CustomGLTFLoader";
export type { ResourceName } from "./Manager";

export function FetchResource<T>(resourceName: ResourceName): Promise<T> | undefined {
  return globalResourceManager.RequestResource<T>(resourceName);
}