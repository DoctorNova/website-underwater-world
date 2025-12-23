
  /**
   * Removes the item `item` from the given array.
   * @param {Array<T>} array
   * @param {T} item the item to remove.
   * @private
   */
export function RemoveItemFromArray<T>(array: Array<T>, item: T) {
  const ndx = array.indexOf(item);
  if (ndx >= 0) {
    array.splice(ndx, 1);
  }
}