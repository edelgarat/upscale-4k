export function convertNodeListToArray(list: HTMLCollectionOf<HTMLElement> | HTMLCollection) {
  return Array.of(...list);
}
