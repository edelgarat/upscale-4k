import React from "react";
import ReactDom from "react-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import "mobx-react-lite/batchingForReactDom";

import Renderer from "./Renderer";
import UI from "./Renderer/UI";

import { appendElementAfterAnotherElement, makeDiv, muiTheme } from "./initial";

export function runForVideoElement(videoElement: HTMLVideoElement) {
  const videoTarget = makeDiv();

  ReactDom.render(
    <React.StrictMode>
      <MuiThemeProvider theme={muiTheme}>
        <Renderer video={videoElement} />
        <UI />
      </MuiThemeProvider>
    </React.StrictMode>,
    videoTarget,
  );

  appendElementAfterAnotherElement(videoTarget, videoElement);

  return () => {
    ReactDom.unmountComponentAtNode(videoTarget);
    if (videoElement.parentElement) videoElement.parentElement.removeChild(videoTarget);
  };
}
