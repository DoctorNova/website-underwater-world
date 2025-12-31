import { globalBaseComponentManager } from "./BaseComponentManager";
import type { GameObject } from "./GameObject";

const DEPENDENCY_CACHE = [] as Array<new (...args: any[]) => Component>;
const RESOLVE_PROMISE = new Promise<void>((resolve) => resolve());

export abstract class Component {
  constructor(public owner: GameObject) {}

  // ------------------------
  // All these methods are called by the owning ComponentList (owned by a GameObject)
  // ------------------------
  GetDependencies(): readonly(new (...args: any[]) => Component)[] { return DEPENDENCY_CACHE; }
  async LoadResources(_signal: AbortSignal): Promise<any> { return await RESOLVE_PROMISE; }

  AddToSystem(): void { globalBaseComponentManager.Add(this); };
  RemoveFromSystem(): void { globalBaseComponentManager.Remove(this); };

  abstract Initialize(): void;
  abstract Shutdown(): void;

  // ------------------------
  // Called by the system that this component is part of
  // ------------------------
  abstract Update(deltaTime: number): void;

  public isEnabled: boolean = true;
}

export type ComponentConstructor<T extends Component = Component> = new (owner: GameObject, ...args: any[]) => T;

type Tail<T extends any[]> =
    T extends [any, ...infer R] ? R : never;

export type ComponentArguments<C extends ComponentConstructor> = Tail<ConstructorParameters<C>>;