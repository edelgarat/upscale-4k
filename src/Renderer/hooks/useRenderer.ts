import React from "react";

import { fpsLoop, fpsLoopType } from "../../libs/fpsLoop";
import { Scaler } from "../../Scaler";
import { useVideoElementSize } from "./useVideoElementSize";

export function useRenderer(video: HTMLVideoElement) {
  const [enabled, setEnabled] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement>();
  const [scale, setScaleElement] = React.useState(0);
  const [bold, setBoldElement] = React.useState(0);
  const [blur, setBlurElement] = React.useState(0);
  const [fps, setFPS] = React.useState(24);
  const size = useVideoElementSize(video);

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
    if (size.videoElement.square === 0) return;
    updateSize();
  }, [size]);

  React.useEffect(() => {
    if (!canvas) return;
    instance.current = new Scaler(canvas.getContext("webgl"));
    updateSize();
    setScaleElement(1);
    setBoldElement(6);
    setBlurElement(2);
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
    size,
    scale,
    setScaleElement,
    bold,
    setBoldElement,
    blur,
    setBlurElement,
    fps,
    setFPS,
    enabled,
    setEnabled,
    visible,
    setVisible,
  };
}
