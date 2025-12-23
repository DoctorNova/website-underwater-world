import * as THREE from 'three';
import type { CustomResourceLoader } from './CustomResourceLoader';

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