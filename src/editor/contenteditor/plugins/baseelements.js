import React from "react";
import styled from "styled-components";
const AspectContainer = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: ${props => (props.aspectY / props.aspectX) * 100}%;
  position: relative;
  & > * {
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    width: 100% !important;
    height: 100% !important;
  }
`;
const ImgContainer = styled.span`
  display: block;
  max-width: 100%;

  max-height: 20em;
  box-shadow: ${props => (props.isSelected ? "0 0 0 2px blue;" : "none")};
`;
const Heading1 = styled.h1`
  color: ${props => props.theme.colors.a};
`;

const Paragraph = styled.p`
  color: ${props => props.theme.colors.c};
`;
export default function BaseElements() {
  return {
    renderBlock(props, editor, next) {
      const { attributes, children, node, isFocused } = props;
      const nextWithNewChild = child => {
        const newProps = { ...props, wrapped: true, children: [child] };
        return next(newProps);
      };
      switch (node.type) {
        case "heading":
          /*TODO Wrap Wrapper */
          return nextWithNewChild(
            <Heading1 {...attributes}>{children}</Heading1>
          );
        case "paragraph":
          /*TODO Wrap Wrapper */
          return nextWithNewChild(
            <Paragraph {...attributes}>{children}</Paragraph>
          );
        case "iframe":
          /*TODO Wrap Wrapper */
          return nextWithNewChild(
            <AspectContainer aspectX={16} aspectY={9}>
              <iframe {...attributes} src={node.data.get("src")} />
            </AspectContainer>
          );
        case "image":
          const src = node.data.get("src");
          return nextWithNewChild(
            <img {...attributes} src={src} />
            /*TODO Wrap PlainSection 
            <ImgContainer isSelected={props.isSelected}>
              <span style={{ position: "fixed", left: -9999 }}>{children}</span>
              <img {...attributes} src={src} />
            </ImgContainer>8*/
          );
        default:
          return next();
      }
    }
  };
}
