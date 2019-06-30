import React from "react";
import { Icon } from "react-icons-kit";

import styled from "styled-components";
import { cross } from "react-icons-kit/icomoon/cross";
import AllBlocks from "../contenteditor/blocks";
import { Block, Value } from "slate";
const fragmentMeetsBlockRequirements = (editor, fragment, section) => {
  let props = {};
  return true;
  const results = Object.keys(section.EditorProps).map(key => {
    const editorType = section.EditorProps[key];
    if (!editorType.test) {
      // Skip
      return null;
    }
    return editorType.test(fragment);
  });
  return results.filter(r => r === false).length === 0;
};
const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  content: "";
  display: block;
`;
const BlockSelector = styled.div`
  position: absolute;
  transition: all 0.25s;
  left: 0px;
  height: 100%;
  right: 0px;
  top: ${props => (props.show ? "0px" : "100%")};
  background: #fafafa;
  img {
    max-width: 100%;
  }
  a {
    cursor: pointer;
    display: block;

    color: #222;
  }
`;

const Header = styled.div`
  background: #f0f0f0;
  padding: 4px 8px;
  color: #222;
  display: flex;
  & > * {
    flex: 0 0 auto;
  }
  & svg {
    width: 10px;
  }
  & > div {
    flex: 1 1 100%;
    text-align: center;
  }
  align-items: center;
  justify-content: center;
  min-height: 65px;
  box-sizing: border-box;
  font-weight: bold;
`;

const WindowBody = styled.div`
  background: #f8f8f8;
  padding: 16px;
`;
const BlockItemContent = styled.div`
  padding: 10px 15px;
  font-size: 12px;
  line-height: 22px;
`;

const BlockItem = styled.div`
  display: block;
  flex: 0 0 33%;
  background: white;
  border-radius: 2px;
  display: flex;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0px;
  box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
    0 1px 3px 0 rgba(63, 63, 68, 0.15);
  margin: 0px 0px;
  & .insert-btn {
    background: #49a1e9;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 10px;
    font-size: 11px;
    transition: all 0.2s;
    transform: translateX(100%);
  }
  overflow: hidden;
  & > ${BlockItemContent} {
    flex: 1 1 100%;
  }
  &:hover .insert-btn {
    transform: translateX(0%);
  }
`;

const BlockList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;
export default ({ show, hide, updateDoc }) => {
  const replace = (currentBlock, editor, selectedSection) => () => {
    const newDoc = window.editor.value.document.insertNode(
      [0],
      Block.create({
        type: "section",
        data: {
          blockName: selectedSection.name,
          schema: selectedSection.schema
        }
      })
    );

    updateDoc(Value.create({ document: newDoc }));
  };
  const container = () => (
    <>
      <BlockSelector show={show}>
        <Header>
          <div>Add Section</div>
          <Icon onClick={() => hide()} icon={cross} />
        </Header>
        <BlockList>
          {AllBlocks.map(r => (
            <BlockItem onClick={replace(null, window.editor, r)}>
              <BlockItemContent>
                <strong>{r.name}</strong>
              </BlockItemContent>
              <span className="insert-btn">Add</span>
            </BlockItem>
          ))}
        </BlockList>
      </BlockSelector>
    </>
  );

  return container();
};
