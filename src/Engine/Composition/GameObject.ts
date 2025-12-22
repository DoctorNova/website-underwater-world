import { Object3D, Quaternion, Scene, Vector3 } from "three";
import type { Component, ComponentConstructor } from "./Component";

export type ComponentsToCreateList = [ComponentConstructor<Component, any[]>, any[]][];

export class GameObject {
  public transform = new Object3D();
  private components = new Array<Component>();
  private parentGameObject: GameObject | Scene;
  private children: GameObject[] = [];

  constructor(parent: GameObject | Scene, componentsToCreate: ComponentsToCreateList = []) {
    // Setup hierarchy
    this.parentGameObject = parent; // To tell typescript that parent will be initialized
    this.SetParent(parent);

    // Create all the needed components for this GameObject
    componentsToCreate.forEach(([ComponentType, constructorArgs]) => {
      this._NewComponent(ComponentType, ...constructorArgs);
    });
  }

  private _NewComponent<T extends Component, A extends any[]>(
    ComponentType: ComponentConstructor<T, A>,
    ...args: A
  ): T {
    const component = new ComponentType(this, ...args);
    component.GetDependencies().forEach(dep => {
      if (!this.HasComponent(dep)) {
        throw new Error(`Missing dependency: ${dep.name}`);
      }
    });
    this.components.push(component);

    return component;
  }

  protected RemoveChild(object: GameObject) {
    const ndx = this.children.indexOf(object);
    if (ndx >= 0) {
      this.children.splice(ndx, 1);
    }
  }

  SetParent(newParent: GameObject | Scene) {
    // Remove from current parent
    if (this.parentGameObject instanceof GameObject){
      this.parentGameObject.RemoveChild(this);
    }
    // Add to new parent
    if (newParent instanceof GameObject) {
      newParent.transform.add(this.transform);
      newParent.children.push(this);
    } else {
      newParent.add(this.transform);
    }
    this.parentGameObject = newParent;
  }

  get Parent() {
    return this.parentGameObject;
  }

  get Children(): Readonly<Array<GameObject>> {
    return this.children;
  }

  RemoveComponent(component: Component) {
    component.Shutdown();
    component.RemoveFromSystem();
    const ndx = this.components.indexOf(component);
    if (ndx >= 0) {
      this.components.splice(ndx, 1);
    }
  }

  FindComponent<T extends Component>(ComponentType: ComponentConstructor<T, any[]>): T | undefined {
    return this.components.find(c => c instanceof ComponentType) as T | undefined;
  }

  HasComponent<T extends Component>(ComponentType: ComponentConstructor<T, any[]>): boolean {
    return this.components.some(c => c instanceof ComponentType);
  }

  async LoadResources(signal: AbortSignal): Promise<GameObject> {
    await Promise.all(this.components.map(c => c.LoadResources(signal)));
    return this;
  }

  Initialize() {
    for (const component of this.components) {
      component.AddToSystem();
    }

    for (const component of this.components) {
      component.Initialize();
    }
  }

  Shutdown(): void {
    if (this.parentGameObject instanceof GameObject) {
      this.parentGameObject.RemoveChild(this);
    }

    for (const component of this.components) {
      component.Shutdown();
    }
  }

  public get position(): Readonly<Vector3> {
    return this.transform.position;
  }
  public get quaternion(): Readonly<Quaternion> {
    return this.transform.quaternion;
  }
  public get scale(): Readonly<Vector3> {
    return this.transform.scale;
  }
}