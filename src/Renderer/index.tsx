import React from "react";

import { Canvas, CanvasWrapper } from "./Components";
import UI from "./UI";

import { useRenderer } from "./hooks/useRenderer";
import useHTMLElementZIndex from "./hooks/useHTMLElementZIndex";
import { calculateVideoSizes } from "../libs/sizes";

interface RendererInterface {
  video: HTMLVideoElement;
}

export default React.memo(function ({ video }: RendererInterface) {
  const {
    initCanvas,
    canvas,
    sizes,
    scale,
    bold,
    blur,
    fps,
    enabled,
    setScale,
    setBold,
    setBlur,
    setFPS,
    setEnabled,
  } = useRenderer(video);

  React.useEffect(() => {
    if (!canvas) return;
    if (enabled) {
      canvas.style.display = "block";
      return;
    }
    canvas.style.display = "none";
  }, [enabled, canvas]);

  const zIndex = useHTMLElementZIndex(video);
  const [translates, setTranslates] = React.useState(() => ({ margin: "0", top: "0", bottom: "0" }));

  React.useEffect(() => {
    const { margin, top, bottom } = getComputedStyle(video);
    setTranslates({ margin, top, bottom });
  }, [sizes]);

  const calculatedCanvasSizes = calculateVideoSizes(sizes.videoElement, sizes.video);

  return (
    <>
      <CanvasWrapper
        zIndex={zIndex}
        width={sizes.videoElement.width}
        height={sizes.videoElement.height}
        translates={translates}
      >
        <Canvas ref={initCanvas} widthProp={calculatedCanvasSizes.width} heightProp={calculatedCanvasSizes.height} />
      </CanvasWrapper>
      <UI
        sizes={sizes}
        enabled={enabled}
        scale={scale}
        bold={bold}
        blur={blur}
        fps={fps}
        setEnabled={setEnabled}
        setScale={setScale}
        setBold={setBold}
        setBlur={setBlur}
        setFPS={setFPS}
      />
    </>
  );
});
