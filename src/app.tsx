import React from "react";
import ReactDom from "react-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import "mobx-react-lite/batchingForReactDom";

import Renderer from "./Renderer";

import { appendElementAfterAnotherElement, makeDiv, muiTheme } from "./initial";

export function runForVideoElement(videoElement: HTMLVideoElement) {
  const videoTarget = makeDiv();

  ReactDom.render(
    <MuiThemeProvider theme={muiTheme}>
      <Renderer video={videoElement} />
    </MuiThemeProvider>,
    videoTarget,
  );

  appendElementAfterAnotherElement(videoTarget, videoElement);

  return () => {
    ReactDom.unmountComponentAtNode(videoTarget);
    if (videoElement.parentElement) videoElement.parentElement.removeChild(videoTarget);
  };
}
