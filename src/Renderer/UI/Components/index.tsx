import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Radio from "@material-ui/core/Radio";

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
