import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Radio from "@material-ui/core/Radio";

export const CanvasWrapper = styled.div<{
  zIndex: number | string;
  width: number;
  height: number;
  translates: { margin: string; top: string; bottom: string };
}>`
  position: absolute;
  left: 0;
  top: ${(props) => props.translates.top};
  bottom: ${(props) => props.translates.bottom};
  margin: ${(props) => props.translates.margin};
  z-index: ${(props) => props.zIndex};
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Canvas = styled.canvas<{
  widthProp: number;
  heightProp: number;
}>`
  width: ${(props) => props.widthProp}px;
  height: ${(props) => props.heightProp}px;
`;

export const PlusIcon = styled.p`
  display: flex;
  justify-content: center;
  font-size: 14px !important;
  line-height: 14px !important;
  color: #000000 !important;
  margin: 0 !important;
  padding: 0 !important;
`;

export const UIWrapperContent = styled(CardContent)`
  display: none;
`;

export const UIWrapper = styled(Card)<{ top: number }>`
  z-index: 1000000;
  position: absolute;
  top: ${(props) => props.top}px;
  left: 20px;
  width: 20px;
  height: 14px;
  transform: translateY(-50%);
  transition: all 0.2s !important;

  :hover {
    width: 300px;
    height: 330px;
    ${PlusIcon} {
      display: none;
    }
    ${UIWrapperContent} {
      display: block;
    }
  }
`;

export const StyledRadio = styled(Radio)`
  svg {
    width: 24px;
    height: 24px;
  }
`;
