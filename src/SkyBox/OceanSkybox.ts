import {
  type Camera,
  DoubleSide,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  UniformsUtils,
  Vector2,
  Vector3,
} from 'three';
import { globals } from 'Utility/global';
import fragmentShader from './Shaders/OceanSkyBox.frag?raw';
import vertexShader from './Shaders/OceanSkyBox.vert?raw';

export class OceanSkyBox extends Mesh {

  /**
   * Constructs a new oceandome.
   */
  constructor() {

    const shader = OceanSkyBox.#Shader;

    const material = new ShaderMaterial({
      name: shader.name,
      uniforms: UniformsUtils.clone(shader.uniforms),
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: DoubleSide,
      depthWrite: true,
    });

    super(new PlaneGeometry(), material);

    this.frustumCulled = false;

    this.onBeforeRender = (
      _renderer,
      _scene,
      camera: Camera,
      //geometry: BufferGeometry,
      //material: Material,
      //group: Group
    ) => {
      material.uniforms.iTime.value = globals.time;
      material.uniforms.iResolution.value = new Vector2(_renderer.domElement.width, _renderer.domElement.height);
      
      camera.getWorldPosition(material.uniforms.iCameraPosition.value);
      camera.getWorldDirection(material.uniforms.iCameraForward.value);
      material.uniforms.iCameraUp.value = camera.up;
    }
  }

  static #Shader = {
    name: "OceanSkyboxShader",
    uniforms: {
      iDeepSeeDepth: { value: 10 },
      iTime: { value: 0 },
      iSunDirection: { value: new Vector3(0.3, 1.0, 0.2).normalize() },
      iResolution: { value: new Vector2(1920, 1080) },
      iCameraPosition: { value: new Vector3(0, 0, 0) },
      iCameraForward: { value: new Vector3(0, 0, -1) },
      iCameraUp: { value: new Vector3(0, 1, 0) }
    },
    vertexShader,
    fragmentShader,
  };

}


