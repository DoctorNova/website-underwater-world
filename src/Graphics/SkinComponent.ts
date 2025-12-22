import * as THREE from 'three';
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { Component } from "../Composition/Component";
import type { GameObject } from "../Composition/GameObject";
import { type AnimationResource, FetchResource, type ResourceName } from "../ResourceManager";

export class AnimationComponent extends Component {
  private resourceName: ResourceName;
  private animationResource?: AnimationResource;
  private animationMixer?: THREE.AnimationMixer;
  private actions: { [animName: string]: THREE.AnimationAction } = {};

  constructor(gameObject: GameObject, resourceName: ResourceName, protected initialAnimationClipName?: string | number) {
    super(gameObject);
    this.resourceName = resourceName;
  }

  async LoadResources(_signal: AbortSignal): Promise<any> {
    this.animationResource = await FetchResource<AnimationResource>(this.resourceName);
  }

  Initialize(): void {
    const animationRoot = SkeletonUtils.clone(this.animationResource!.gltf.scene);
    this.animationMixer = new THREE.AnimationMixer(animationRoot);
    this.owner.transform.add(animationRoot);

    if (this.initialAnimationClipName) {
      if (typeof this.initialAnimationClipName === 'number') {
        const clipNames = this.animationResource!.gltf.animations[this.initialAnimationClipName]?.name;
        this.initialAnimationClipName = clipNames;
      }
      this.PlayAnimationClip(this.initialAnimationClipName);
    }
  }
  Shutdown(): void {
    
  }
  Update(deltaTime: number): void {
    this.animationMixer?.update(deltaTime);
  }

  PlayAnimationClip(clipName: string): void {
    const clip = this.animationResource!.animations.get(clipName);
    if (!clip) {
      throw new Error(`Animation clip ${clipName} not found in resource ${this.resourceName} \n Available clips: ${Array.from(this.animationResource!.animations.keys()).map(k => `'${k}'`).join(", ")}`);
    }
    // turn off all current actions
    for (const action of Object.values(this.actions)) {
      action.enabled = false;
    }
    // get or create existing action for clip
    const action = this.animationMixer!.clipAction(clip);
    action.enabled = true;
    action.reset();
    action.play();
    this.actions[clipName] = action;
  }
}