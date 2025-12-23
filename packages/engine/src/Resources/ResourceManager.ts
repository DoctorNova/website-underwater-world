import * as THREE from 'three';
import { FILES_ON_SERVER } from './AvailableResources';
import { CustomGLTFLoader } from './CustomResourceLoaders/CustomGLTFLoader';
import type { CustomResourceLoader } from './CustomResourceLoaders/CustomResourceLoader';
import { LoaderWrapper } from './CustomResourceLoaders/LoaderWrapper';

export type ResourceName = keyof typeof FILES_ON_SERVER;

export type OnProgressCallback = (url: string, itemsLoaded: number, itemsTotal: number) => void;
export type OnSuccessCallback = () => void;
export type OnErrorCallback = (url:string) => void;

export type LoadOptions = {
  onProgress?: OnProgressCallback;
  onSuccess?: OnSuccessCallback;
  onError?: OnErrorCallback;
};

const defaultLoadOptions: LoadOptions = {
  onProgress: undefined,
  onSuccess: undefined,
  onError: (url: string) => { console.error(`Failed to load resource: ${url}`); },
};

export class ResourceManager {
  private static resources: Map<ResourceName, Promise<any>> = new Map();
  private loadingManager: THREE.LoadingManager;
  private resourceLoaders: Map<string, CustomResourceLoader>;

  constructor(options?: LoadOptions) {
    this.loadingManager = new THREE.LoadingManager(
      options?.onSuccess ?? defaultLoadOptions.onSuccess, 
      options?.onProgress ?? defaultLoadOptions.onProgress, 
      options?.onError ?? defaultLoadOptions.onError
    );
    this.resourceLoaders = new Map<string, CustomResourceLoader>([
      ['glb', new CustomGLTFLoader(this.loadingManager)],
      ['png', new LoaderWrapper(new THREE.TextureLoader(this.loadingManager))],
      ['jpg', new LoaderWrapper(new THREE.TextureLoader(this.loadingManager))],
    ]);
  }

  RequestResource<T>(resourceName: ResourceName): Promise<T> | undefined {
    if (!ResourceManager.resources.has(resourceName)) {
      this.Load(resourceName);
    }

    return ResourceManager.resources.get(resourceName) as Promise<T> | undefined;
  }
  
  Load(...resourceNames: ResourceName[]): void {
    for (const resourceName of resourceNames) {
      if (ResourceManager.resources.has(resourceName)) {
        continue; // already loading or loaded
      }

      const resourcePath = FILES_ON_SERVER[resourceName];
      const fileType = resourcePath.split('.').pop()?.toLowerCase() || '';
      const loader = this.resourceLoaders.get(fileType);

      if (!loader) {
        console.warn(`No loader for resource type: ${fileType}`);
        continue;
      }

      ResourceManager.resources.set(resourceName, loader.Load(resourcePath));
    }
  }
}

export const globalResourceManager = new ResourceManager();
