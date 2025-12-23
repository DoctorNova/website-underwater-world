import { Object3D, Quaternion, Scene, Vector3 } from "three";
import type { Component, ComponentConstructor } from "./Component";

/**
 * @file GameObject.ts
 * Scene entity with a `transform` and component management.
 * Handles hierarchy (parent/children) and component lifecycle.
 */

/**
 * List of component constructors with their constructor arguments used
 * to initialize a `GameObject`.
 */
export type ComponentsToCreateList = [ComponentConstructor<Component, any[]>, any[]][];

/**
 * A scene entity that owns a `transform` and a set of `Component`s.
 * Supports hierarchical parenting and component lifecycle management.
 */
export class GameObject {
  public transform = new Object3D();
  private components = new Array<Component>();
  private parentGameObject: GameObject | Scene;
  private children: GameObject[] = [];

  /**
   * Creates a `GameObject`, sets its parent, and instantiates components.
   * @param {GameObject | Scene} parent Parent `GameObject` or three.js `Scene`.
   * @param {ComponentsToCreateList} [componentsToCreate=[]] Components with constructor args to create.
   */
  constructor(parent: GameObject | Scene, componentsToCreate: ComponentsToCreateList = []) {
    // Setup hierarchy
    this.parentGameObject = parent; // To tell typescript that parent will be initialized
    this.SetParent(parent);

    // Create all the needed components for this GameObject
    componentsToCreate.forEach(([ComponentType, constructorArgs]) => {
      this._NewComponent(ComponentType, ...constructorArgs);
    });
  }

  /**
   * Instantiates a component, validates dependencies, and registers it.
   * @typeParam T Component type to create.
   * @typeParam A Constructor argument tuple type.
   * @param ComponentType The component constructor.
   * @param args Constructor arguments forwarded to the component.
   * @returns {T} The created component instance.
   * @throws {Error} If a required dependency is missing.
   * @private
   */
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

  /**
   * Removes a child `GameObject` from this object's children list.
   * @param {GameObject} object Child object to remove.
   * @protected
   */
  protected RemoveChild(object: GameObject) {
    const ndx = this.children.indexOf(object);
    if (ndx >= 0) {
      this.children.splice(ndx, 1);
    }
  }

  /**
   * Reparents this `GameObject` to `newParent` and updates transforms.
   * Removes from previous parent, then attaches to the new parent.
   * @param {GameObject | Scene} newParent New parent.
   */
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

  /**
   * Gets the current parent.
   * @returns {GameObject | Scene} Parent `GameObject` or `Scene`.
   */
  get Parent() {
    return this.parentGameObject;
  }

  /**
   * Gets the list of child `GameObject`s.
   * @returns {Readonly<Array<GameObject>>} Read-only children array.
   */
  get Children(): Readonly<Array<GameObject>> {
    return this.children;
  }

  /**
   * Shuts down and removes a component from this `GameObject`.
   * @param {Component} component Component instance to remove.
   */
  RemoveComponent(component: Component) {
    component.Shutdown();
    component.RemoveFromSystem();
    const ndx = this.components.indexOf(component);
    if (ndx >= 0) {
      this.components.splice(ndx, 1);
    }
  }

  /**
   * Finds the first component instance of `ComponentType`.
   * @typeParam T The component type to find.
   * @param ComponentType Constructor function to match.
   * @returns {T | undefined} Component instance if found.
   */
  FindComponent<T extends Component>(ComponentType: ComponentConstructor<T, any[]>): T | undefined {
    return this.components.find(c => c instanceof ComponentType) as T | undefined;
  }

  /**
   * Checks whether this `GameObject` has a component of `ComponentType`.
   * @typeParam T The component type to check.
   * @param ComponentType Constructor function to check.
   * @returns {boolean} True if present.
   */
  HasComponent<T extends Component>(ComponentType: ComponentConstructor<T, any[]>): boolean {
    return this.components.some(c => c instanceof ComponentType);
  }

  /**
   * Loads resources for all components.
   * @param {AbortSignal} signal Abort signal to cancel loading.
   * @returns {Promise<GameObject>} Resolves with `this` when done.
   */
  async LoadResources(signal: AbortSignal): Promise<GameObject> {
    await Promise.all(this.components.map(c => c.LoadResources(signal)));
    return this;
  }

  /**
   * Adds all components to their systems, then initializes them.
   */
  Initialize() {
    for (const component of this.components) {
      component.AddToSystem();
    }

    for (const component of this.components) {
      component.Initialize();
    }
  }

  /**
   * Detaches from parent and shuts down all components.
   */
  Shutdown(): void {
    if (this.parentGameObject instanceof GameObject) {
      this.parentGameObject.RemoveChild(this);
    }

    for (const component of this.components) {
      component.Shutdown();
    }
  }

  /**
   * Read-only position of this object's `transform`.
   * @returns {Readonly<Vector3>} Position vector.
   */
  public get position(): Readonly<Vector3> {
    return this.transform.position;
  }

  /**
   * Read-only quaternion of this object's `transform`.
   * @returns {Readonly<Quaternion>} Orientation quaternion.
   */
  public get quaternion(): Readonly<Quaternion> {
    return this.transform.quaternion;
  }

  /**
   * Read-only scale of this object's `transform`.
   * @returns {Readonly<Vector3>} Scale vector.
   */
  public get scale(): Readonly<Vector3> {
    return this.transform.scale;
  }
}