export interface CustomResourceLoader {
  Load(resourcePath: string): Promise<any>;
}