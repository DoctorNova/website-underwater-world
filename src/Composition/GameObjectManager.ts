import { GameObject } from "./GameObject";

class GameObjectManager {
  private array = new Array<GameObject>();
  private addQueue = new Array<GameObject>();
  private removeQueue = new Set<GameObject>();
  private abortController = new AbortController();

  get length() {
    return this.addQueue.length + this.array.length;
  }

  IsEmpty() {
    return this.length === 0;
  }

  async Add(element: GameObject) {
    await element.LoadResources(this.abortController.signal);
    this.addQueue.push(element);
  }

  Remove(element: GameObject) {
    this.removeQueue.add(element);
  }

  Clear() {
    this.array.forEach(element => element.Shutdown());
    this.addQueue.forEach(element => element.Shutdown());

    this.array = [];
    this.addQueue = [];
    this.removeQueue.clear();

    this.abortController.abort();
    this.abortController = new AbortController();
  }

  Initialize(): void {
    this.array.forEach(gameObject => gameObject.Initialize());
  }
  Update(_: number): void {
    this._addQueued();
    this._removeQueued();
  }
  Shutdown(): void {  
    this.array.forEach(gameObject => gameObject.Shutdown());
    this.abortController.abort();
    this.abortController = new AbortController();
  }
   
  private _addQueued() {
    if (this.addQueue.length) {
      this.array.splice(this.array.length, 0, ...this.addQueue);
      this.addQueue.forEach(element => element.Initialize());
      this.addQueue = [];
    }
  }

  private _removeQueued() {
    if (this.removeQueue.size) {
      this.array = this.array.filter(element => {
        const remove = this.removeQueue.has(element)
        if (remove) {
          element.Shutdown();
        }
        return !remove;
      });
      this.removeQueue.clear();
    }
  }
}

export const globalGameObjectManager = new GameObjectManager();