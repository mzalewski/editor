import React from "react";
import ContentEditor from "../../contenteditor";
import styled from "styled-components";
const H1 = styled.h1`
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #222;
`;
const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: row;
  min-height: 100%;
  > * {
    flex: 1 1 100%;
  }
`;

export default () => (
  <Container>
    <H1>Edit Page</H1>
    <ContentEditor />
  </Container>
);
