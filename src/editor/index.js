import React from "react";
import Navbar from "../components/header/basic";
import styled from "styled-components";
const Workspace = styled("div")`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
`;
const WorkspaceSidebar = styled("div")`
  background: #222;
  flex: 0 0 200px;
`;
const Designer = styled("div")`
  background: #fff;
  flex: 1 1 100%;
`;
export const Editor = () => (
  <Workspace>
    <WorkspaceSidebar />
    <Designer>
      <Navbar />
    </Designer>
  </Workspace>
);
