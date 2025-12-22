export type CustomResourceLoader = {
  Load(resourcePath: string): Promise<any>;
}