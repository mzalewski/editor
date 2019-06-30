import React from "react";
import styled from "styled-components";
import AllBlocks from "../blocks";
import { Block } from "slate";
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
  position: fixed;

  background: #222;
  box-sizing: border-box;

  top: 50%;
  z-index: 10000;
  position: fixed;
  left: 50%;
  background: #f8f8f8;
  box-sizing: border-box;

  height: 600px;
  width: 800px;
  transform: translate(-50%, -50%);
  img {
    max-width: 100%;
  }
  a {
    cursor: pointer;
    display: block;

    color: #222;
  }
`;

const replace = (currentBlock, editor, selectedSection) => () => {
  if (currentBlock == null) {
    editor.closeBlockTemplate(() => {
      const blockPath = editor.value.selection.anchor.path.take(1);
      const offset = editor.value.selection.anchor.path.skip(1).first();
      editor.removeNodeByPath(editor.value.selection.anchor.path.take(2));
      editor.splitNodeByPath(blockPath, offset);

      editor.splitNodeByPath([blockPath.first() + 1], 0);
      editor.setNodeByPath([blockPath.first() + 1], {
        type: "section",
        data: {
          blockName: selectedSection.name,
          schema: selectedSection.schema
        }
      });
    });
  } else {
    editor.closeBlockTemplate(() => {
      editor.setNodeByKey(currentBlock.key, {
        type: "section",
        data: {
          blockName: selectedSection.name,
          schema: selectedSection.schema
        }
      });
    });
  }

  /*    selectedNodes.reverse().forEach(node => {
    editor.moveNodeByKey(node.key, newBLock.key, i);
  });
*/
};
const WindowHeader = styled.div`
  background: #212936;
  padding: 4px 8px;
  color: white;
`;

const WindowBody = styled.div`
  background: #f8f8f8;
  padding: 16px;
`;
const BlockItem = styled.div`
  display: block;
  flex: 0 0 33%;
  text-align: center;
  font-size: 12px;
  box-sizing: border-box;
  padding: 5px;
`;

const BlockItemContent = styled.div`
  background: white;
  border-radius: 2px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 5px;
`;
const BlockList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
export const BlockSelectorContainer = ({ editor }) => {
  const container = () => (
    <>
      <Overlay />
      <BlockSelector>
        <WindowHeader>Insert Block Template</WindowHeader>
        <WindowBody>
          <BlockList>
            {AllBlocks.filter(block =>
              fragmentMeetsBlockRequirements(editor, fragment, block.block)
            ).map(r => (
              <BlockItem onClick={replace(currentBlock, editor, r)}>
                <BlockItemContent>
                  <img src={r.image} />
                  <strong>{r.name}</strong>
                </BlockItemContent>
              </BlockItem>
            ))}
          </BlockList>
        </WindowBody>
      </BlockSelector>
    </>
  );
  /* React.useEffect(() => {
    document.getElementById("db").style = "padding-right:200px";
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.getElementById("db").style = "";
    };
  }, []);*/
  const fragment = editor.value.fragment;
  const currentSelection = editor.value.selection.anchor;
  if (!currentSelection.path) return container();
  let currentIndex = currentSelection.path.size;
  let currentBlock = null;
  while (currentIndex > 0 && currentBlock === null) {
    const node = editor.value.document.getNode(
      currentSelection.path.take(currentIndex)
    );
    if (node.type === "paragraph" && node.text === "") {
      // Empty paragraph - insert instead of replace;
      currentBlock = null;
      break;
    }
    if (node.type === "block") {
      currentBlock = node;
    }
    if (node.type === "section") currentBlock = node;
    currentIndex--;
  }

  return container();
};
