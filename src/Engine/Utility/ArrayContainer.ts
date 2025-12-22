
export class ArrayContainer<T> {
  protected items = new Array<T>();

  get length() {
    return this.items.length;
  }

  IsEmpty() {
    return this.items.length === 0;
  }

  Clear() {
    this.items = [];
  }

  Add(item: T) {
    this.items.push(item);
  }

  Remove(item: T) {
    const ndx = this.items.indexOf(item);
    if (ndx >= 0) {
      this.items.splice(ndx, 1);
    }
  }

  ForEach(callback: (item: T) => void) {
    this.items.forEach(callback);
  }
}