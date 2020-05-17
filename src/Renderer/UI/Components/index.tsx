import styled from "styled-components";
import Card from "@material-ui/core/Card";
import Radio from "@material-ui/core/Radio";

export const UIWrapper = styled(Card)<{ top: number }>`
  z-index: 1000000;
  position: absolute;
  top: ${(props) => props.top}px;
  left: 20px;
  transform: translateY(-50%);
  width: 300px;
  height: 330px;
`;

export const StyledRadio = styled(Radio)`
  svg {
    width: 24px;
    height: 24px;
  }
`;
