import React from "react";
import { observer } from "mobx-react-lite";

import { Canvas, CanvasWrapper } from "./Components";

import { useRenderer } from "./hooks/useRenderer";
import useHTMLElementZIndex from "./hooks/useHTMLElementZIndex";
import { calculateVideoSizes } from "../libs/sizes";

import UI from "./UI";

import state from "../state";

interface RendererInterface {
  video: HTMLVideoElement;
}

function Renderer({ video }: RendererInterface) {
  const { initCanvas, canvas, sizes } = useRenderer(video);

  React.useEffect(() => {
    if (!canvas) return;
    if (state.enabled) {
      canvas.style.display = "block";
      return;
    }
    canvas.style.display = "none";
  }, [state.enabled, canvas]);

  const zIndex = useHTMLElementZIndex(video);
  const [translates, setTranslates] = React.useState(() => ({ margin: "0", top: "0", bottom: "0" }));

  React.useEffect(() => {
    const { margin, top, bottom } = getComputedStyle(video);
    setTranslates({ margin, top, bottom });
    state.setSizes(sizes);
  }, [sizes]);

  const calculatedCanvasSizes = calculateVideoSizes(sizes.videoElement, sizes.video);

  return (
    <>
      <CanvasWrapper
        zIndex={zIndex}
        size={
          state.enabled
            ? { width: sizes.videoElement.width, height: sizes.videoElement.height }
            : { width: 0, height: 0 }
        }
        translates={translates}
      >
        <Canvas ref={initCanvas} widthProp={calculatedCanvasSizes.width} heightProp={calculatedCanvasSizes.height} />
      </CanvasWrapper>
      <UI />
    </>
  );
}

export default React.memo(observer(Renderer));
