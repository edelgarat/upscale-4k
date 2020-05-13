import React from "react";
import ReactDom from "react-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";

import Renderer from "./Renderer";

import { appendElementAfterAnotherElement, makeDiv, muiTheme } from "./initial";

export function runForVideoElement(videoElement: HTMLVideoElement) {
  const target = makeDiv();

  ReactDom.render(
    <MuiThemeProvider theme={muiTheme}>
      <Renderer video={videoElement} />
    </MuiThemeProvider>,
    target,
  );

  appendElementAfterAnotherElement(target, videoElement);

  return () => {
    ReactDom.unmountComponentAtNode(target);
    document.body.removeChild(target);
  };
}
