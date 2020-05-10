import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

export const Canvas = styled.canvas<{
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
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  z-index: ${(props) => props.zIndex};
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
    height: 300px;
    ${PlusIcon} {
      display: none;
    }
    ${UIWrapperContent} {
      display: block;
    }
  }
`;
