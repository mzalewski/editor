import React from "react";
import Block from "./block.js";
import styled from "styled-components";
import Navbar from "../../components/navbar/basic";

import Header from "../../components/header/basic";

export default () => {
  const [blocks, setBlocks] = React.useState([
    <Navbar
      css={{
        [Navbar]: `background: linear-gradient(black,red);`,
        [Navbar.Link]: `font-size:30px;`
      }}
    />,
    <Header background={[{ from: "white", to: "black" }]} />
  ]);
  return (
    <div>
      {blocks.map(r => (
        <Block
          component={r}
          addBlock={() => setBlocks([...blocks, <h1>Test</h1>])}
        />
      ))}
    </div>
  );
};
