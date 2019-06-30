import React from "react";
import { InsertToolbar } from "./toolbar";
import styled from "styled-components";
import { Icon } from "react-icons-kit";
import { plus } from "react-icons-kit/icomoon/plus";
import { image } from "react-icons-kit/icomoon/image";
import { play } from "react-icons-kit/icomoon/play";
import { stack } from "react-icons-kit/icomoon/stack";
import { list } from "react-icons-kit/icomoon/list";
import { quotesLeft } from "react-icons-kit/icomoon/quotesLeft";

import { BlockSelectorContainer } from "./blockselector";

const AddIcon = styled(Icon)`
  svg {
    transition: all 0.2s;
  }
  ${props =>
    props.isOpen
      ? `
  
  svg { 
    transform:rotate(135deg);
  }`
      : ""}
`;

export const Section = styled.section`
  ${props =>
    props.isFocused
      ? `
  
  `
      : `
  &:hover { 
    .selector { 
      display: block;
    }
  }
  `}
  .selector { 
      position:absolute;
      top:50%;
      left:-30px;
      transform:translateY(-50%);
    }
  position: relative;
  z-index: 1;
  transition: width 0.4s;
  box-sizing: border-box;
  
  margin: 0px auto;
  ${props =>
    props.isFocused === true &&
    `&:after { position: absolute;left:0px;width:3px;top:4px;bottom:4px;background:#49a1e8; content:"";display:block; }`}
  max-width: ${props => (props.width ? props.width : "100%")};
`;

export const EmptySection = ({ children, editor, isEmpty, attributes }) => {
  const [showIcons, setShowIcons] = React.useState(false);
  const [showBlocks, setShowBlocks] = React.useState(false);
  const shouldRenderAsEmptyText = !showIcons && !showBlocks && isEmpty;
  const shouldRenderChildren = !showBlocks && !showIcons;
  const fragment = null;
  const fragmentMeetsBlockRequirements = () => true;
  return (
    <PlainSection isEmpty={shouldRenderAsEmptyText} {...attributes}>
      {isEmpty && (
        <>
          <InsertToolbar>
            <AddIcon
              isOpen={showIcons}
              icon={plus}
              onMouseDown={() => setShowIcons(!showIcons)}
            />
            {!showBlocks && showIcons && (
              <>
                <Icon
                  icon={image}
                  onMouseDown={() => {
                    console.log(
                      window.editor.value.selection.anchor.path.take(2)
                    );
                    window.editor.removeNodeByPath(
                      window.editor.value.selection.anchor.path.take(2)
                    );

                    window.editor.insertBlock({
                      type: "image",
                      data: {
                        src:
                          "https://picsum.photos/id/" +
                          parseInt(Math.random() * 1024) +
                          "/1200/500"
                      }
                    });
                  }}
                />
                <Icon icon={play} onMouseDown={() => console.log(true)} />
                <Icon icon={list} onMouseDown={() => console.log(true)} />
                <Icon icon={quotesLeft} onMouseDown={() => console.log(true)} />
                <Icon icon={stack} onMouseDown={() => setShowBlocks(true)} />
              </>
            )}
          </InsertToolbar>
          {showBlocks && <BlockSelectorContainer editor={window.editor} />}
        </>
      )}
      {shouldRenderChildren ? children : null}
    </PlainSection>
  );
};

export const PlainSection = styled.section`
  min-height: 44px;
  ${props =>
    props.showHover
      ? `&:hover {
  }`
      : ``}
  ${props =>
    props.isEmpty
      ? `
    
  &:before {
    position:absolute;
    content: "Start typing, or press tab to start a new section";
    /* color: red; */
    color: #aaa;
    display: block;
    font-size: 14px;
  }
  `
      : ``}
  padding: 10px 20px;
  position: relative;
  transition: width 0.4s;
  box-sizing: border-box;

  ${props =>
    props.selected === true &&
    `&:after { position: absolute;left:0px;width:3px;top:4px;bottom:4px;background:#49a1e8; content:"";display:block; }`}
  margin: 0px auto;
  max-width: ${props => (props.width ? props.width : "800px")};
`;
