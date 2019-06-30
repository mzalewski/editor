import React from "react";
import styled from "styled-components";

const RulerPart = styled.div`
  position: absolute;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.width};
  transform: translateX(-50%);
  background: #eee;
  border: 3px solid white;
  height: 24px;
  box-sizing: border-box;
  text-align: center;
  font-size: 12px;
  color: #888;
  z-index: ${props => props.z};
  &:hover {
    background: #ccc !important;
    color: #888 !important;
    > span {
      z-index: 1;
    }
  }
`;

const RulerBg = styled.div`
  background: red;
  position: relative;
  cursor: pointer;
  height: 24px;
  flex: 0 0 24px !important;
  &:hover ${RulerPart} {
    color: transparent;
  }
  z-index: 1;
`;
export default ({ widths, setSectionWidth }) => {
  return (
    <RulerBg>
      {widths.map(width => (
        <RulerPart onClick={() => setSectionWidth(width)} width={width} />
      ))}
    </RulerBg>
  );
};
