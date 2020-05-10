import React from "react";

export default function (element: HTMLElement) {
  return React.useMemo(() => getComputedStyle(element).zIndex, []);
}
