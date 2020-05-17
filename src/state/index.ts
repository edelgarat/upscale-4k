import { action, observable } from "mobx";
import { FullSizes, initialFullSizes } from "../libs/sizes";

export class State {
  @observable visible = false;
  @observable enabled = false;
  @observable scale = 0;
  @observable bold = 0;
  @observable blur = 0;
  @observable fps = 24;
  @observable sizes = initialFullSizes;

  @action toggleVisibility = () => {
    this.visible = !this.visible;
  };

  @action hide = () => {
    this.visible = false;
  };

  @action enable = () => {
    this.enabled = true;
  };

  @action disable = () => {
    this.enabled = false;
  };

  @action setScale = (value: number) => {
    this.scale = value;
  };

  @action setBold = (value: number) => {
    this.bold = value;
  };

  @action setBlur = (value: number) => {
    this.blur = value;
  };

  @action setFPS = (value: number) => {
    this.fps = value;
  };

  @action setSizes = (sizes: FullSizes) => {
    this.sizes = sizes;
  };
}

export default new State();
