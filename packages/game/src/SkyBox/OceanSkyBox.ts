import { globalFrameTime } from '@engine/Utility/FrameTime';
import * as THREE from 'three';
import fragmentShader from './Shaders/OceanSkyBox.frag?raw';
import vertexShader from './Shaders/OceanSkyBox.vert?raw';

export class OceanSkyBox extends THREE.Mesh {

  /**
   * Constructs a new oceandome.
   */
  constructor() {

    const shader = OceanSkyBox.#Shader;

    const material = new THREE.ShaderMaterial({
      name: shader.name,
      uniforms: THREE.UniformsUtils.clone(shader.uniforms),
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    super(new THREE.PlaneGeometry(), material);
    this.frustumCulled = false;

    this.onBeforeRender = (
      _renderer,
      _scene,
      camera: THREE.Camera,
      //geometry: BufferGeometry,
      //material: Material,
      //group: Group
    ) => {
      material.uniforms.iTime.value = globalFrameTime.Time;
      material.uniforms.iResolution.value = new THREE.Vector2(_renderer.domElement.width, _renderer.domElement.height);
      
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
      iSunDirection: { value: new THREE.Vector3(0.3, 1.0, 0.2).normalize() },
      iResolution: { value: new THREE.Vector2(1920, 1080) },
      iCameraPosition: { value: new THREE.Vector3(0, 0, 0) },
      iCameraForward: { value: new THREE.Vector3(0, 0, -1) },
      iCameraUp: { value: new THREE.Vector3(0, 1, 0) }
    },
    vertexShader,
    fragmentShader,
  };

}


