import * as THREE from 'three';
import { CustomGLTFLoader } from './CustomGLTFLoader';
import type { CustomResourceLoader } from './CustomResourceLoader';


const filesOnServer = {
  emperorAngelfish: 'assets/emperor_angelfish.glb',
  fusilier: 'assets/fusilier.glb',
};
export type ResourceName = keyof typeof filesOnServer;

export type OnProgressCallback = (url: string, itemsLoaded: number, itemsTotal: number) => void;
export type OnSuccessCallback = () => void;
export type OnErrorCallback = (url:string) => void;

export type LoadOptions = {
  onProgress?: OnProgressCallback;
  onSuccess?: OnSuccessCallback;
  onError?: OnErrorCallback;
};

export class ResourceManager {
  private static resources: Map<ResourceName, Promise<any>> = new Map();
  private loadingManager: THREE.LoadingManager;
  private resourceLoaders: Map<string, CustomResourceLoader>;

  constructor(options?: LoadOptions) {
    this.loadingManager = new THREE.LoadingManager(options?.onSuccess, options?.onProgress, options?.onError);
    this.resourceLoaders = new Map<string, CustomResourceLoader>([['glb', new CustomGLTFLoader(this.loadingManager)]]);
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

      const resourcePath = filesOnServer[resourceName];
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
