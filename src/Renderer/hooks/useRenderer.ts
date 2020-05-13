import React from "react";

import { fpsLoop, fpsLoopType } from "../../libs/fpsLoop";
import { Scaler } from "../Scaler";
import { useVideoElementSizes } from "./useVideoElementSizes";

export function useRenderer(video: HTMLVideoElement) {
  const [enabled, setEnabled] = React.useState(false);
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement>();
  const [scale, setScale] = React.useState(0);
  const [bold, setBold] = React.useState(0);
  const [blur, setBlur] = React.useState(0);
  const [fps, setFPS] = React.useState(24);
  const sizes = useVideoElementSizes(video);

  const loop = React.useRef<fpsLoopType>();
  React.useEffect(() => {
    loop.current = fpsLoop(() => instance.current.render(), 0);
    return () => loop.current.stop();
  }, []);

  React.useEffect(() => {
    if (enabled) {
      loop.current.start();
      return;
    }
    loop.current.stop();
  }, [enabled]);

  const instance = React.useRef<Scaler>();

  function updateSize() {
    if (!instance.current) return;
    instance.current.inputVideo(video);
    instance.current.resize(scale);
  }

  React.useEffect(() => {
    if (sizes.videoElement.square === 0) return;
    updateSize();
  }, [sizes]);

  React.useEffect(() => {
    if (!canvas) return;
    instance.current = new Scaler(canvas.getContext("webgl"));
    updateSize();
    setScale(1);
    setBold(6);
    setBlur(2);
  }, [canvas]);

  React.useEffect(() => {
    loop.current.setFPS(fps);
  }, [fps]);

  React.useEffect(() => {
    if (!instance.current) return;
    instance.current.resize(scale);
  }, [scale]);

  React.useEffect(() => {
    if (!instance.current) return;
    instance.current.bold = bold;
  }, [bold]);

  React.useEffect(() => {
    if (!instance.current) return;
    instance.current.blur = blur;
  }, [blur]);

  return {
    initCanvas: setCanvas,
    canvas,
    sizes,
    scale,
    setScale,
    bold,
    setBold,
    blur,
    setBlur,
    fps,
    setFPS,
    enabled,
    setEnabled,
  };
}
