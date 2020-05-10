import React from "react";
import Typography from "@material-ui/core/Typography";
import MaterialSlider, { SliderProps } from "@material-ui/core/Slider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";

import { Canvas, PlusIcon, UIWrapper, UIWrapperContent } from "./UI";
import Row from "./UI/Row";

import stopPropagationFunc from "../libs/stopPropagation";

import { useRenderer } from "./hooks/useRenderer";
import useHTMLElementZIndex from "./hooks/useHTMLElementZIndex";

interface RendererInterface {
  video: HTMLVideoElement;
}

const stopPropagation = stopPropagationFunc();

const Slider = (props: Omit<SliderProps, "onChange"> & { onChange: (value: number) => void }) => (
  <MaterialSlider {...props} onChange={(_, value) => props.onChange(value as number)} />
);

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

  return (
    <>
      <Canvas
        ref={initCanvas}
        zIndex={zIndex}
        width={size.videoElement.width}
        height={size.videoElement.height}
        translates={translates}
      />
      {visible && (
        <UIWrapper
          top={size.videoElement.y + size.videoElement.height / 2}
          /*https://github.com/facebook/react/issues/2043*/
          onClick={stopPropagation}
          onDoubleClick={stopPropagation}
          onMouseDown={stopPropagation}
          onMouseUp={stopPropagation}
        >
          <PlusIcon>+</PlusIcon>
          <UIWrapperContent>
            <Typography color="textPrimary" variant="h4" gutterBottom>
              UpScale 4K ({enabled ? "enabled" : "disabled"})
            </Typography>
            <Row value={scale} name="Scale factor">
              <Slider value={scale} min={1} max={4} step={0.1} onChange={setScaleElement} />
            </Row>
            <Row value={bold} name="Bold">
              <Slider value={bold} min={0.0001} max={8} step={0.1} onChange={setBoldElement} />
            </Row>
            <Row value={blur} name="Blur">
              <Slider value={blur} min={0.0001} max={8} step={0.1} onChange={setBlurElement} />
            </Row>
            <Row name="FPS">
              <RadioGroup row value={fps} onChange={(_, value) => setFPS(parseFloat(value))}>
                <FormControlLabel value={24} control={<Radio color="primary" />} label="24" />
                <FormControlLabel value={30} control={<Radio color="primary" />} label="30" />
                <FormControlLabel value={60} control={<Radio color="primary" />} label="60" />
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
