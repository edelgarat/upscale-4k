import { createMuiTheme } from "@material-ui/core/styles";

import { convertNodeListToArray } from "./libs/convertNodeListToArray";

export const muiTheme = createMuiTheme({
  spacing: 1,
  overrides: {
    MuiSlider: {
      root: {
        padding: "13px 0 !important",
      },
    },
    MuiTypography: {
      h4: { fontSize: 20 },
      body1: { fontSize: 14 },
      body2: { fontSize: 14 },
    },
    MuiButton: {
      label: {
        fontSize: 12,
      },
    },
  },
});

export function appendElementAfterAnotherElement(target: HTMLElement, after: HTMLElement) {
  const parent = after.parentElement;
  const parentChildren = convertNodeListToArray(parent.children);
  const index = parentChildren.indexOf(after);
  if (index === parent.childElementCount - 1) {
    parent.appendChild(target);
  } else {
    parent.insertBefore(target, parent.children[index + 1]);
  }
}

export function makeDiv() {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.top = "0";
  return div;
}
