import { beforeEach, describe, expect, it, vi } from "vitest";
import { Component } from "./Component";
import { SceneRoot } from "./SceneRoot.ts";

describe("GameObjectManager", () => {
  const globalGameObjectManager = new SceneRoot();

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear all game objects from the manager before each test
    globalGameObjectManager.Clear();
  });

  it("Add a gameobject to the manager", async () => {
    await globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager});
    globalGameObjectManager.Update(0); // process queues
    expect(globalGameObjectManager.length).toBe(1);
  });

  it("Remove a gameobject from the manager", async () => {
    const obj = await globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager});
    vi.spyOn(obj, "Initialize");
    vi.spyOn(obj, "Shutdown");
    globalGameObjectManager.Update(0);
    expect(globalGameObjectManager.length).toBe(1);
    globalGameObjectManager.DestroyGameObject(obj);
    globalGameObjectManager.Update(0); // process queues
    expect(obj.Shutdown).toHaveBeenCalled();
    expect(globalGameObjectManager.length).toBe(0);
  });

  it("Remove a gameobject should only shutdown that one gameobject", async () => {
    const obj1 = await globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager});
    const obj2 = await globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager});
    vi.spyOn(obj1, "Initialize");
    vi.spyOn(obj1, "Shutdown");
    vi.spyOn(obj2, "Initialize");
    vi.spyOn(obj2, "Shutdown");

    globalGameObjectManager.Update(0);
    expect(globalGameObjectManager.length).toBe(2);
    globalGameObjectManager.DestroyGameObject(obj1);
    globalGameObjectManager.Update(0);
    expect(obj1.Shutdown).toHaveBeenCalled();
    expect(obj2.Shutdown).not.toHaveBeenCalled();
    expect(globalGameObjectManager.length).toBe(1);
  });

  it("Clears all gameobjects from the manager", async () => {
    await globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager});
    await globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager});
    globalGameObjectManager.Update(0);
    expect(globalGameObjectManager.length).toBe(2);
    globalGameObjectManager.Clear();
    expect(globalGameObjectManager.length).toBe(0);
  });

  it("Initializes all gameobjects in the manager", async () => {
    const obj1 = await globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager});
    const obj2 = await globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager});
    vi.spyOn(obj1, "Initialize");
    vi.spyOn(obj1, "Shutdown");
    vi.spyOn(obj2, "Initialize");
    vi.spyOn(obj2, "Shutdown");
    globalGameObjectManager.Update(0);
    globalGameObjectManager.Initialize();
    expect(obj1.Initialize).toHaveBeenCalled();
    expect(obj2.Initialize).toHaveBeenCalled();
  });

  it("Shuts down all gameobjects in the manager", async () => {
    const obj1 = await globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager});
    const obj2 = await globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager});
    vi.spyOn(obj1, "Initialize");
    vi.spyOn(obj1, "Shutdown");
    vi.spyOn(obj2, "Initialize");
    vi.spyOn(obj2, "Shutdown");
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

    const firstPromise = globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager, componentsToCreate: [[MockComponent, []]]});
    const secondPromise = globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager, componentsToCreate: [[MockComponent, []]]});
    globalGameObjectManager.Shutdown();
    expect(firstPromise).rejects.toThrowError("Aborted");
    expect(secondPromise).rejects.toThrowError("Aborted");
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

    const firstPromise = globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager, componentsToCreate: [[MockComponent, []]]});
    const secondPromise = globalGameObjectManager.NewGameObject({name: "Test", parent:globalGameObjectManager, componentsToCreate: [[MockComponent, []]]});
    globalGameObjectManager.Clear();
    expect(firstPromise).rejects.toThrowError("Aborted");
    expect(secondPromise).rejects.toThrowError("Aborted");
  });
});