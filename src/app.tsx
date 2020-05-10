import React from "react";
import ReactDom from "react-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import Renderer from "./Renderer";
import { convertNodeListToArray } from "./libs/convertNodeListToArray";

const muiTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      root: {
        padding: "13px 0 !important",
      },
    },
  },
});

export function runForVideoElement(element: HTMLVideoElement) {
  const parent = element.parentElement;
  const target = document.createElement("div");
  ReactDom.render(
    ReactDom.createPortal(
      <MuiThemeProvider theme={muiTheme}>
        <Renderer video={element} />
      </MuiThemeProvider>,
      target,
    ),
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
