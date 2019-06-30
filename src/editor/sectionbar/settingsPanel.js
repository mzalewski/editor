import React from "react";

import { Icon } from "react-icons-kit";

import styled from "styled-components";
import { cross } from "react-icons-kit/icomoon/cross";
import AllBlocks, { getBlockByName } from "../contenteditor/blocks";
import AllStyles, { getStyleByName } from "../contenteditor/styles";
const BlockSelector = styled.div`
  position: absolute;
  transition: all 0.25s;
  left: 0px;
  height: 100%;

  top: 0px;
  overflow: hidden;
  right: ${props => (props.show ? "0px" : "100%")};

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
const renderSettings = (block, setStyle) => {
  return (
    block &&
    block.schema &&
    block.schema.styles &&
    Object.keys(block.schema.styles).map(s => {
      const style = block.schema.styles[s];
      return (
        <div>
          <label>{style.name}</label>
          <select onChange={e => setStyle(s, getStyleByName(e.target.value))}>
            <option value="">Default</option>
            {AllStyles.map(r => (
              <option value={r.name}>{r.name}</option>
            ))}
          </select>
        </div>
      );
    })
  );
};
const setStyleOfNode = (updateDoc, key, styleProp, styleValue) => {
  debugger;
  const selected = window.editor.value.document.getNode(key.key);
  const currentStyles = selected.data.toJS().styles || {};
  window.editor.setNodeByKey(selected.key, {
    ...selected.toJS(),
    data: {
      ...selected.data.toJS(),
      styles: { ...currentStyles, [styleProp]: styleValue }
    }
  });
};
export default props => {
  return (
    <BlockSelector show={props.selected != null}>
      <Header>
        {props.selected && console.log()}
        <div>{props.selected && props.selected.name}</div>
        <Icon onClick={() => props.hide()} icon={cross} />
      </Header>
      {props.selected && (
        <div>
          {renderSettings(
            getBlockByName(props.selected.name),
            (style, selected) =>
              selected &&
              setStyleOfNode(
                props.updateDoc,
                props.selected,
                style,
                selected.name
              )
          )}
        </div>
      )}
    </BlockSelector>
  );
};
