import styled from "styled-components";

export const CanvasWrapper = styled.div<{
  zIndex: number | string;
  size: { width: number; height: number };

  translates: { margin: string; top: string; bottom: string };
}>`
  position: absolute;
  left: 0;
  top: ${(props) => props.translates.top};
  bottom: ${(props) => props.translates.bottom};
  margin: ${(props) => props.translates.margin};
  z-index: ${(props) => props.zIndex};
  width: ${(props) => props.size.width}px;
  height: ${(props) => props.size.height}px;
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
