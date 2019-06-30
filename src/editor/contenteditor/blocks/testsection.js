/** @jsx jsx */
import React from "react";
import styled from "styled-components";
import { Icon } from "react-icons-kit";
import { square_left } from "react-icons-kit/ikons/square_left";
import { square_right } from "react-icons-kit/ikons/square_right";
import { css, jsx } from "@emotion/core";
import EditorTypes from "../types/editortypes";
const Row = styled.div`
  display: flex;
  flex-direction: ${props =>
    `${
      props.width && props.width !== "100%" && parseInt(props.width, 10) < 500
        ? "column"
        : "row"
    }${props.align === "right" ? "" : "-reverse"}`};
  & > * {
    flex: 1 1 auto;
  }
  & img {
    width: 100%;
  }
`;

const Box = styled.div`
  margin: 10px;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex: 1 1 100%;
`;

const TestSection = props => {
  return (
    <Row
      css={props.styles && props.styles.background}
      align={props.align}
      width={props.width}
    >
      <Box>
        {props.heading}
        <p>{props.paragraphText}</p>
      </Box>
      <Box>{props.image}</Box>
    </Row>
  );
};

TestSection.EditorProps = {
  align: EditorTypes.oneOf([
    EditorTypes.button("left", <Icon icon={square_left} />),
    EditorTypes.button("right", <Icon icon={square_right} />)
  ]),
  heading: EditorTypes.Heading({ maxLength: 100, default: "Image with text" }),
  paragraphText: EditorTypes.Paragraph({
    maxLength: 100,
    default:
      "Pair large text with an image to give focus to your chosen product, collection, or blog post. Add details on availability, style, or even provide a review."
  }),
  image: EditorTypes.Image(),
  styles: {
    background: EditorTypes.Style(
      "background",
      "Background",
      "Background Style"
    )
  }
  //menuItems: EditorTypes.NavItem().max(5)
};

TestSection.RulerWidths = ["100%", "800px"];
export default TestSection;
