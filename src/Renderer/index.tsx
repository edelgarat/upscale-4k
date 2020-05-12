import React from "react";
import Typography from "@material-ui/core/Typography";
import MaterialSlider, { SliderProps } from "@material-ui/core/Slider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";

import { Canvas, CanvasWrapper, PlusIcon, StyledRadio, UIWrapper, UIWrapperContent } from "./UI";
import Row from "./UI/Row";

import { useRenderer } from "./hooks/useRenderer";
import useHTMLElementZIndex from "./hooks/useHTMLElementZIndex";
import { calculateVideoSizes } from "../libs/calculateVideoSizes";

interface RendererInterface {
  video: HTMLVideoElement;
}

const Slider = (props: Omit<SliderProps, "onChange"> & { onChange: (value: number) => void }) => (
  <MaterialSlider {...props} onChange={(_, value) => props.onChange(value as number)} />
);

function stopUiPropagation(target: HTMLElement) {
  if (!target) return;
  // target.addEventListener("click", (ev) => {
  //   ev.stopPropagation();
  // });
}

export default React.memo(function ({ video }: RendererInterface) {
  const {
    initCanvas,
    canvas,
    size,
    scale,
    bold,
    blur,
    fps,
    enabled,
    visible,
    setScaleElement,
    setBoldElement,
    setBlurElement,
    setFPS,
    setEnabled,
    setVisible,
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
  }, [size]);

  React.useEffect(() => {
    function listener(ev: KeyboardEvent) {
      const key = ev.key.toLowerCase();
      if (key === "u" && ev.ctrlKey) {
        setVisible(!visible);
      }
    }

    document.body.addEventListener("keypress", listener);
    return () => document.body.removeEventListener("keypress", listener);
  }, [visible]);

  const calculatedCanvasSizes = calculateVideoSizes(size.videoElement, size.video);

  return (
    <>
      <CanvasWrapper
        zIndex={zIndex}
        width={size.videoElement.width}
        height={size.videoElement.height}
        translates={translates}
      >
        <Canvas ref={initCanvas} widthProp={calculatedCanvasSizes.width} heightProp={calculatedCanvasSizes.height} />
      </CanvasWrapper>
      {visible && (
        <UIWrapper top={size.videoElement.height / 2}>
          <PlusIcon>+</PlusIcon>
          <UIWrapperContent ref={stopUiPropagation}>
            <Typography color="textPrimary" variant="h4" gutterBottom>
              UpScale 4K ({enabled ? "enabled" : "disabled"})
            </Typography>
            <Row name="Scale factor">
              <RadioGroup row value={scale} onChange={(_, value) => setScaleElement(parseFloat(value))}>
                <FormControlLabel value={1} control={<StyledRadio color="primary" />} label="1" />
                <FormControlLabel value={1.5} control={<StyledRadio color="primary" />} label="1.5" />
                <FormControlLabel value={2} control={<StyledRadio color="primary" />} label="2" />
                <FormControlLabel value={3} control={<StyledRadio color="primary" />} label="3" />
              </RadioGroup>
            </Row>
            <Row value={bold} name="Bold">
              <Slider value={bold} min={0.0001} max={8} step={0.1} onChange={setBoldElement} />
            </Row>
            <Row value={blur} name="Blur">
              <Slider value={blur} min={0.0001} max={8} step={0.1} onChange={setBlurElement} />
            </Row>
            <Row name="FPS">
              <RadioGroup row value={fps} onChange={(_, value) => setFPS(parseFloat(value))}>
                <FormControlLabel value={24} control={<StyledRadio color="primary" />} label="24" />
                <FormControlLabel value={30} control={<StyledRadio color="primary" />} label="30" />
                <FormControlLabel value={60} control={<StyledRadio color="primary" />} label="60" />
              </RadioGroup>
            </Row>
            <Row>
              {enabled ? (
                <Button variant="contained" color="primary" onClick={() => setEnabled(false)}>
                  Disable
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={() => setEnabled(true)}>
                  Enable
                </Button>
              )}
            </Row>
          </UIWrapperContent>
        </UIWrapper>
      )}
    </>
  );
});
