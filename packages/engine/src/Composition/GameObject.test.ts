import { beforeEach, describe, expect, it, vi } from "vitest";
import { Component } from "./Component";
import { GameObject } from "./GameObject";
import type {SceneRoot} from "@engine/Composition/SceneRoot.ts";

describe("GameObject", () => {
  let mockedLoadResourceFunction = vi.fn();

  class MockComponent1 extends Component {
    AddToSystem = vi.fn();
    RemoveFromSystem = vi.fn();
    Initialize = vi.fn();
    Shutdown = vi.fn();
    Update = vi.fn();
    GetDependencies = vi.fn().mockReturnValue([]);
    LoadResources = mockedLoadResourceFunction;
  }

  class MockComponent2 extends Component {
    AddToSystem = vi.fn();
    RemoveFromSystem = vi.fn();
    Initialize = vi.fn();
    Shutdown = vi.fn();
    Update = vi.fn();
    GetDependencies = vi.fn().mockReturnValue([]);
    LoadResources = mockedLoadResourceFunction;
  }

  class MockComponentWithConstructor extends Component {
    constructor(owner: GameObject, public value: number) {
      super(owner);
      this.value = value;
    }

    AddToSystem = vi.fn();
    RemoveFromSystem = vi.fn();
    Initialize = vi.fn();
    Shutdown = vi.fn();
    Update = vi.fn();
    GetDependencies = vi.fn().mockReturnValue([]);
    LoadResources = mockedLoadResourceFunction;
  }

  const scene = { transform: { add: vi.fn() } } as unknown as SceneRoot;

  beforeEach(() => {
    vi.clearAllMocks(); // resets call counts, last calls, etc.
    mockedLoadResourceFunction.mockImplementation((_signal: AbortSignal) => Promise.resolve())
  });

  it("Creates a component and adds it to the list", () => {
    const gameObject = new GameObject([[MockComponent1, []]]);
    const component = gameObject.FindComponent(MockComponent1);
    expect(gameObject.Parent).toBe(scene);
    expect(scene.transform.add).toHaveBeenCalledWith(gameObject.transform);
    expect(component).toBeInstanceOf(MockComponent1);
  });

  it("Should save the parent correctly", () => {
    const parentGameObject = new GameObject( [[MockComponent1, []]]);
    const gameObject = new GameObject([[MockComponent1, []]]);
    gameObject.SetParent(parentGameObject);

    expect(gameObject.Parent).toBe(parentGameObject);
    expect(scene.transform.add).toHaveBeenCalled();
    expect(parentGameObject.children).toContain(gameObject);
  });

  it("Creates a component with constructor arguments", () => {
    const gameObject = new GameObject( [[MockComponentWithConstructor, [42]]]);
    const component = gameObject.FindComponent(MockComponentWithConstructor);
    expect(component).toBeInstanceOf(MockComponentWithConstructor);
    expect(component?.value).toBe(42);
  });

  it("Throw error if dependencies are missing", () => {
    class DependentComponent extends Component {
      SetOwner = vi.fn();
      AddToSystem = vi.fn();
      RemoveFromSystem = vi.fn();
      Initialize = vi.fn();
      Shutdown = vi.fn();
      Update = vi.fn();
      GetDependencies = vi.fn().mockReturnValue([MockComponent1]);
    }
    expect(() => new GameObject( [[DependentComponent, []]])).toThrowError(`Missing dependency: ${MockComponent1.name}`);
  });

  it("Finds a component by type", () => {
    const gameObject = new GameObject( [[MockComponent1, []]]);
    const component = gameObject.FindComponent(MockComponent1);
    const foundComponent = gameObject.FindComponent(MockComponent1);
    expect(foundComponent).toBe(component);
  });

  it("Returns undefined when finding a non-existent component", () => {
    const gameObject = new GameObject( []);
    const foundComponent = gameObject.FindComponent(MockComponent1);
    expect(foundComponent).toBeUndefined();
  });

  it("Checks for existence of a component by type", () => {
    const gameObject1 = new GameObject( []);
    expect(gameObject1.HasComponent(MockComponent1)).toBe(false);
    const gameObject2 = new GameObject( [[MockComponent1, []]]);
    expect(gameObject2.HasComponent(MockComponent1)).toBe(true);
  });

  it("Removes a component from the list", () => {
    const gameObject = new GameObject( [[MockComponent1, []]]);
    const component = gameObject.FindComponent(MockComponent1);
    if (component) {
      gameObject.RemoveComponent(component);
      expect(component.RemoveFromSystem).toHaveBeenCalled();
      expect(gameObject.HasComponent(MockComponent1)).toBe(false);
    }
  });

  it("Initializes all components", () => {
    const gameObject = new GameObject( [[MockComponent1, []], [MockComponent2, []]]);
    const component1 = gameObject.FindComponent(MockComponent1);
    const component2 = gameObject.FindComponent(MockComponent2);
    gameObject.Initialize();
    expect(component1?.AddToSystem).toHaveBeenCalled();
    expect(component2?.AddToSystem).toHaveBeenCalled();
    expect(component1?.Initialize).toHaveBeenCalled();
    expect(component2?.Initialize).toHaveBeenCalled();
  });

  it("should load all component resources", async () => {
    const gameObject = new GameObject( [[MockComponent1, []], [MockComponent2, []]]);
    const component1 = gameObject.FindComponent(MockComponent1);
    const abortController = new AbortController();
    await gameObject.LoadResources(abortController.signal);
    expect(component1?.LoadResources).toHaveBeenCalled();
  });

  it("should load all component resources", async () => {
    const gameObject = new GameObject( [[MockComponent1, []], [MockComponent2, []]]);
    const component1 = gameObject.FindComponent(MockComponent1);
    const component2 = gameObject.FindComponent(MockComponent2);
    const abortController = new AbortController();
    await gameObject.LoadResources(abortController.signal);
    expect(component1?.LoadResources).toHaveBeenCalled();
    expect(component2?.LoadResources).toHaveBeenCalled();
  });

  it("should abort component resources loading", async () => {
    mockedLoadResourceFunction.mockImplementation((signal: AbortSignal) => {
      return new Promise<void>((resolve, reject) => {
        // Abort already triggered
        if (signal.aborted) {
          return reject(new Error("Aborted"));
        }
        // Otherwise listen for abort event
        const onAbort = () => {
          reject(new Error("Aborted"));
        };

        signal.addEventListener("abort", onAbort);
        // Simulate async completion (optional)
        setTimeout(() => {
          if (!signal.aborted) {
            resolve();
            signal.removeEventListener("abort", onAbort);
          }
        }, 10);
      });
    });
    const gameObject = new GameObject( [[MockComponent1, []], [MockComponent2, []]]);
    const component1 = gameObject.FindComponent(MockComponent1);
    const component2 = gameObject.FindComponent(MockComponent2);
    const abortController = new AbortController();
    const loadPromise = gameObject.LoadResources(abortController.signal);
    abortController.abort();
    await expect(loadPromise).rejects.toThrowError("Aborted");
    expect(component1?.LoadResources).toHaveBeenCalled();
    expect(component2?.LoadResources).toHaveBeenCalled();
  });

  it("Shuts down all components", () => {
    const gameObject = new GameObject( [[MockComponent1, []], [MockComponent2, []]]);
    const component1 = gameObject.FindComponent(MockComponent1);
    const component2 = gameObject.FindComponent(MockComponent2);
    gameObject.Shutdown();
    expect(component1?.Shutdown).toHaveBeenCalled();
    expect(component2?.Shutdown).toHaveBeenCalled();
  });
});