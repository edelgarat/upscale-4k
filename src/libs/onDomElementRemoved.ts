export function onDomElementRemoved(element: HTMLElement, onRemove: () => void) {
  document.addEventListener("DOMNodeRemoved", function (ev) {
    if ((ev.target as HTMLElement).contains(element)) {
      onRemove();
    }
  });
}
