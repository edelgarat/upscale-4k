import React from "react";
import Typography from "@material-ui/core/Typography";
import MaterialSlider, { SliderProps } from "@material-ui/core/Slider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import { observer } from "mobx-react-lite";

import { StyledRadio, UIWrapper } from "./Components";
import Row from "./Components/Row";

import state from "../../state";

function mEvValue(callback: (value: number) => void) {
  return function (_: any, value: string) {
    callback(parseFloat(value));
  };
}

const Slider = (props: Omit<SliderProps, "onChange"> & { onChange: (value: number) => void }) => (
  <MaterialSlider {...props} onChange={(_, value) => props.onChange(value as number)} />
);

function UI() {
  React.useEffect(() => {
    function listener(ev: KeyboardEvent) {
      if (ev.code === "KeyU" && ev.ctrlKey) state.toggleVisibility();
    }

    document.body.addEventListener("keypress", listener);
    return () => document.body.removeEventListener("keypress", listener);
  }, [state.visible]);

  if (!state.visible) return;

  return (
    <UIWrapper top={state.sizes.videoElement.height / 2}>
      <CardContent>
        <Typography color="textPrimary" variant="h4" gutterBottom>
          UpScale 4K ({state.enabled ? "enabled" : "disabled"})
        </Typography>
        <Row name="Scale factor">
          <RadioGroup row value={state.scale} onChange={mEvValue(state.setScale)}>
            <FormControlLabel value={1} control={<StyledRadio color="primary" />} label="1" />
            <FormControlLabel value={1.5} control={<StyledRadio color="primary" />} label="1.5" />
            <FormControlLabel value={2} control={<StyledRadio color="primary" />} label="2" />
            <FormControlLabel value={3} control={<StyledRadio color="primary" />} label="3" />
          </RadioGroup>
        </Row>
        <Row value={state.bold} name="Bold">
          <Slider value={state.bold} min={0.0001} max={8} step={0.1} onChange={state.setBold} />
        </Row>
        <Row value={state.blur} name="Blur">
          <Slider value={state.blur} min={0.0001} max={8} step={0.1} onChange={state.setBlur} />
        </Row>
        <Row name="FPS">
          <RadioGroup row value={state.fps} onChange={mEvValue(state.setFPS)}>
            <FormControlLabel value={24} control={<StyledRadio color="primary" />} label="24" />
            <FormControlLabel value={30} control={<StyledRadio color="primary" />} label="30" />
            <FormControlLabel value={60} control={<StyledRadio color="primary" />} label="60" />
          </RadioGroup>
        </Row>
        <Row>
          {state.enabled ? (
            <Button variant="contained" color="primary" onClick={state.disable}>
              Disable
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={state.enable}>
              Enable
            </Button>
          )}
        </Row>
      </CardContent>
    </UIWrapper>
  );
}
export default React.memo(observer(UI));
