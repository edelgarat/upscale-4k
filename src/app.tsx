import React from "react";
import ReactDom from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import Renderer from "./Renderer";
import { convertNodeListToArray } from "./libs/convertNodeListToArray";

const muiTheme = createMuiTheme({
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

export function runForVideoElement(element: HTMLVideoElement) {
  const parent = element.parentElement;
  const target = document.createElement("div");

  target.style.position = "absolute";
  target.style.top = "0";

  ReactDom.render(
    <MuiThemeProvider theme={muiTheme}>
      <Renderer video={element} />
    </MuiThemeProvider>,
    target,
  );

  const parentChildren = convertNodeListToArray(parent.children);
  const index = parentChildren.indexOf(element);
  if (index === parent.childElementCount - 1) {
    parent.appendChild(target);
  } else {
    parent.insertBefore(target, parent.children[index + 1]);
  }

  return () => {
    ReactDom.unmountComponentAtNode(target);
    parent.removeChild(target);
  };
}
