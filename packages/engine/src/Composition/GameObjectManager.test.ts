import type { Scene } from "three";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Component } from "./Component";
import { GameObject, type ComponentsToCreateList } from "./GameObject";
import { globalGameObjectManager } from "./GameObjectManager";

describe("GameObjectManager", () => {

  class mockGameObject extends GameObject {
    constructor(componentsToCreate: ComponentsToCreateList = []) {
      super({ add: vi.fn() } as unknown as Scene, componentsToCreate);
    }

    Initialize = vi.fn();
    Shutdown = vi.fn();
  }

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear all game objects from the manager before each test
    globalGameObjectManager.Clear();
  });

  it("Add a gameobject to the manager", async () => {
    await globalGameObjectManager.Add(new mockGameObject());
    globalGameObjectManager.Update(0); // process queues
    expect(globalGameObjectManager.length).toBe(1);
  });

  it("Remove a gameobject from the manager", async () => {
    const obj = new mockGameObject();
    await globalGameObjectManager.Add(obj);
    globalGameObjectManager.Update(0);
    expect(globalGameObjectManager.length).toBe(1);
    globalGameObjectManager.Remove(obj);
    globalGameObjectManager.Update(0); // process queues
    expect(obj.Shutdown).toHaveBeenCalled();
    expect(globalGameObjectManager.length).toBe(0);
  });

  it("Remove a gameobject should only shutdown that one gameobject", async () => {
    const obj1 = new mockGameObject();
    const obj2 = new mockGameObject();
    await globalGameObjectManager.Add(obj1);
    await globalGameObjectManager.Add(obj2);
    globalGameObjectManager.Update(0);
    expect(globalGameObjectManager.length).toBe(2);
    globalGameObjectManager.Remove(obj1);
    globalGameObjectManager.Update(0);
    expect(obj1.Shutdown).toHaveBeenCalled();
    expect(obj2.Shutdown).not.toHaveBeenCalled();
    expect(globalGameObjectManager.length).toBe(1);
  });

  it("Clears all gameobjects from the manager", async () => {
    await globalGameObjectManager.Add(new mockGameObject());
    await globalGameObjectManager.Add(new mockGameObject());
    globalGameObjectManager.Update(0);
    expect(globalGameObjectManager.length).toBe(2);
    globalGameObjectManager.Clear();
    expect(globalGameObjectManager.length).toBe(0);
  });

  it("Initializes all gameobjects in the manager", async () => {
    const obj1 = new mockGameObject();
    const obj2 = new mockGameObject();
    await globalGameObjectManager.Add(obj1);
    await globalGameObjectManager.Add(obj2);
    globalGameObjectManager.Update(0);
    globalGameObjectManager.Initialize();
    expect(obj1.Initialize).toHaveBeenCalled();
    expect(obj2.Initialize).toHaveBeenCalled();
  });

  it("Shuts down all gameobjects in the manager", async () => {
    const obj1 = new mockGameObject();
    const obj2 = new mockGameObject();
    await globalGameObjectManager.Add(obj1);
    await globalGameObjectManager.Add(obj2);
    globalGameObjectManager.Update(0);
    globalGameObjectManager.Shutdown();
    expect(obj1.Shutdown).toHaveBeenCalled();
    expect(obj2.Shutdown).toHaveBeenCalled();
  });

  it("should abort resource loading for all gameobjects when the manager is shut down", async () => {
    class MockComponent extends Component {
      AddToSystem = vi.fn();
      RemoveFromSystem = vi.fn();
      Initialize = vi.fn();
      Shutdown = vi.fn();
      Update = vi.fn();
      GetDependencies = vi.fn().mockReturnValue([]);
      LoadResources = vi.fn((signal: AbortSignal) => {
        return new Promise<void>((_, reject) => {
          signal.addEventListener("abort", () => {
            reject(new Error("Aborted"));
          });
        });
      });
    }

    const obj1 = new mockGameObject([[MockComponent, []]]);
    const obj2 = new mockGameObject([[MockComponent, []]]);
    const firstPromise = globalGameObjectManager.Add(obj1);
    const secondPromise = globalGameObjectManager.Add(obj2);
    globalGameObjectManager.Shutdown();
    await expect(firstPromise).rejects.toThrowError("Aborted");
    await expect(secondPromise).rejects.toThrowError("Aborted");
  });

  it("should abort resource loading for all gameobjects when the manager is cleared", async () => {
    class MockComponent extends Component {
      AddToSystem = vi.fn();
      RemoveFromSystem = vi.fn();
      Initialize = vi.fn();
      Shutdown = vi.fn();
      Update = vi.fn();
      GetDependencies = vi.fn().mockReturnValue([]);
      LoadResources = vi.fn((signal: AbortSignal) => {
        return new Promise<void>((_, reject) => {
          signal.addEventListener("abort", () => {
            reject(new Error("Aborted"));
          });
        });
      });
    }

    const obj1 = new mockGameObject([[MockComponent, []]]);
    const obj2 = new mockGameObject([[MockComponent, []]]);
    const firstPromise = globalGameObjectManager.Add(obj1);
    const secondPromise = globalGameObjectManager.Add(obj2);
    globalGameObjectManager.Clear();
    await expect(firstPromise).rejects.toThrowError("Aborted");
    await expect(secondPromise).rejects.toThrowError("Aborted");
  });
});