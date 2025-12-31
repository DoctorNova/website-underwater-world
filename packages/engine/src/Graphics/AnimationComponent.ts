import {Component} from "@engine/Composition/Component";
import type {GameObject} from "@engine/Composition/GameObject";
import {type AnimationResource, FetchResource, type ResourceName} from "@engine/Resources";
import * as THREE from 'three';
import {SkeletonUtils} from "three/examples/jsm/Addons.js";

export class AnimationComponent extends Component {
  private resourceName: ResourceName;
  private animationResource?: AnimationResource;
  private animationMixer?: THREE.AnimationMixer;
  private actions: { [animName: string]: THREE.AnimationAction } = {};
  private worldForward = new THREE.Vector3(0, 0, 1);

  constructor(gameObject: GameObject, resourceName: ResourceName, protected initialAnimationClipName?: string | number, protected startAnimationAtRandomTime = false) {
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
    animationRoot.getWorldDirection(this.worldForward);

    if (typeof this.initialAnimationClipName === 'number') {
      this.initialAnimationClipName = this.animationResource!.gltf.animations[this.initialAnimationClipName]?.name;
    }
    if (typeof this.initialAnimationClipName === 'string') {
      this.PlayAnimationClip(this.initialAnimationClipName);
    }
  }
  Shutdown(): void {
    // Stop all animation actions and dispose of the mixer
    if (this.animationMixer) {
      this.animationMixer.stopAllAction();
      this.animationMixer.uncacheRoot(this.animationMixer.getRoot());
      this.animationMixer = undefined;
    }
    this.actions = {};
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

    if (this.startAnimationAtRandomTime) {
      action.startAt(Math.random() * action.getEffectiveTimeScale());
    }
    action.play();
    this.actions[clipName] = action;
  }
}