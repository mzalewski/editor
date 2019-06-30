import React from "react";
import styled from "styled-components";

const BlockContainer = styled.div`
  position: relative;
`;

export default props => {
  return (
    <BlockContainer>
      {props.component}
      <button onClick={props.addBlock}>Add Block</button>
    </BlockContainer>
  );
};
