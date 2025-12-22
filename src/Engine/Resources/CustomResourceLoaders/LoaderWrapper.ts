import type { CustomResourceLoader } from 'Resources/CustomResourceLoaders/CustomResourceLoader';
import * as THREE from 'three';

export class LoaderWrapper<T> implements CustomResourceLoader {
  constructor(private loader: THREE.Loader<T>) {}

  Load(resourcePath: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.loader.load(
        resourcePath,
        (resource: T) => resolve(resource),
        undefined,
        (error: unknown) => reject(error)
      );
    });
  }
}