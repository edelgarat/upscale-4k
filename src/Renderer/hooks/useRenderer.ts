import React from "react";

import { fpsLoop, fpsLoopType } from "../../libs/fpsLoop";
import { Scaler } from "../Scaler";
import { useVideoElementSizes } from "./useVideoElementSizes";

import state from "../../state";

export function useRenderer(video: HTMLVideoElement) {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement>();
  const sizes = useVideoElementSizes(video);

  const loop = React.useRef<fpsLoopType>();

  React.useEffect(() => {
    loop.current = fpsLoop(0);
    return loop.current.stop;
  }, []);

  React.useEffect(() => {
    if (state.enabled) {
      state.clearError();
      try {
        loop.current.start();
      } catch (e) {
        if (e instanceof DOMException && e.message.includes("cross-origin")) {
          state.setError("Sorry, but your browser blocks cross-origin video source. Try a different player");
          loop.current.stop();
          state.disable();
        }
      }
      return;
    }
    loop.current.stop();
  }, [state.enabled]);

  const instance = React.useRef<Scaler>();

  function updateSize() {
    if (!instance.current) return;
    instance.current.inputVideo(video);
    instance.current.resize(state.scale);
  }

  React.useEffect(() => {
    if (sizes.videoElement.square === 0) return;
    updateSize();
  }, [sizes]);

  React.useEffect(() => {
    if (!canvas) return;
    instance.current = new Scaler(canvas.getContext("webgl"));
    loop.current.setFunc(() => instance.current.render());
    updateSize();
    state.setScale(1);
    state.setBold(6);
    state.setBlur(2);
  }, [canvas]);

  React.useEffect(() => {
    loop.current.setFPS(state.fps);
  }, [state.fps]);

  React.useEffect(() => {
    if (!instance.current) return;
    instance.current.resize(state.scale);
  }, [state.scale]);

  React.useEffect(() => {
    if (!instance.current) return;
    instance.current.bold = state.bold;
  }, [state.bold]);

  React.useEffect(() => {
    if (!instance.current) return;
    instance.current.blur = state.blur;
  }, [state.blur]);

  return {
    initCanvas: setCanvas,
    canvas,
    sizes,
  };
}
