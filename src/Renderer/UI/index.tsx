import React from "react";
import Typography from "@material-ui/core/Typography";
import MaterialSlider, { SliderProps } from "@material-ui/core/Slider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";

import { StyledRadio, UIWrapper } from "./Components";
import Row from "./Components/Row";

import { FullSizes } from "../../libs/sizes";

interface UIInterface {
  sizes: FullSizes;
  enabled: boolean;
  scale: number;
  bold: number;
  blur: number;
  fps: number;
  setEnabled: (value: boolean) => void;
  setScale: (value: number) => void;
  setBold: (value: number) => void;
  setBlur: (value: number) => void;
  setFPS: (value: number) => void;
}

function mEvValue(callback: (value: number) => void) {
  return function (_: any, value: string) {
    callback(parseFloat(value));
  };
}

const Slider = (props: Omit<SliderProps, "onChange"> & { onChange: (value: number) => void }) => (
  <MaterialSlider {...props} onChange={(_, value) => props.onChange(value as number)} />
);

export default React.memo(function ({
  sizes,
  enabled,
  scale,
  bold,
  blur,
  fps,
  setEnabled,
  setScale,
  setBold,
  setBlur,
  setFPS,
}: UIInterface) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    function listener(ev: KeyboardEvent) {
      if (ev.code === "KeyU" && ev.ctrlKey) setVisible(!visible);
    }

    document.body.addEventListener("keypress", listener);
    return () => document.body.removeEventListener("keypress", listener);
  }, [visible]);

  if (!visible) return;

  return (
    <UIWrapper top={sizes.videoElement.height / 2}>
      <CardContent>
        <Typography color="textPrimary" variant="h4" gutterBottom>
          UpScale 4K ({enabled ? "enabled" : "disabled"})
        </Typography>
        <Row name="Scale factor">
          <RadioGroup row value={scale} onChange={mEvValue(setScale)}>
            <FormControlLabel value={1} control={<StyledRadio color="primary" />} label="1" />
            <FormControlLabel value={1.5} control={<StyledRadio color="primary" />} label="1.5" />
            <FormControlLabel value={2} control={<StyledRadio color="primary" />} label="2" />
            <FormControlLabel value={3} control={<StyledRadio color="primary" />} label="3" />
          </RadioGroup>
        </Row>
        <Row value={bold} name="Bold">
          <Slider value={bold} min={0.0001} max={8} step={0.1} onChange={setBold} />
        </Row>
        <Row value={blur} name="Blur">
          <Slider value={blur} min={0.0001} max={8} step={0.1} onChange={setBlur} />
        </Row>
        <Row name="FPS">
          <RadioGroup row value={fps} onChange={mEvValue(setFPS)}>
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
      </CardContent>
    </UIWrapper>
  );
});
