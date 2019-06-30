import React from "react";
import ReactDOM from "react-dom";
import { cogs } from "react-icons-kit/icomoon/cogs";
import { Toolbar } from "../components/toolbar";
import styled from "styled-components";
import { Icon } from "react-icons-kit";
import { bold } from "react-icons-kit/icomoon/bold";
import { underline } from "react-icons-kit/icomoon/underline";
import { italic } from "react-icons-kit/icomoon/italic";
import { quotesLeft } from "react-icons-kit/icomoon/quotesLeft";
import { listNumbered } from "react-icons-kit/icomoon/listNumbered";
import { fontSize } from "react-icons-kit/icomoon/fontSize";
import { list } from "react-icons-kit/icomoon/list";
import { stack } from "react-icons-kit/icomoon/stack";
import { equalizer2 } from "react-icons-kit/icomoon/equalizer2";
import { BlockSelectorContainer } from "../components/blockselector";
const menuRef = React.createRef();
const TopLeftToolbar = styled(Toolbar)`
  transform: none;
  &:after,
  &:before {
    display: none;
  }
`;
export default function() {
  return {
    commands: {
      insertBlockTemplate(editor) {
        editor.setState({ showBlockContainer: true });
      },
      closeBlockTemplate(editor, test) {
        editor.setState({ showBlockContainer: false }, test);
      }
    },
    renderEditor(props, editor, next) {
      const children = next();

      return (
        <React.Fragment>
          {editor.state.showBlockContainer && (
            <div id="container">
              <BlockSelectorContainer editor={editor} />
            </div>
          )}
          {children}
          <HoverMenu editor={editor} />
        </React.Fragment>
      );
    }
  };
}

/**
 * Update the menu's absolute position.
 */

const updateMenu = value => {
  const menu = menuRef.current;
  if (!menu) return;
  return;
  const { fragment, selection } = value;

  const collapsed = true;
  //menu.removeAttribute("style");
  //return;
  //}

  const native = window.getSelection();
  if (!native.rangeCount) return;
  const range = native.getRangeAt(0);
  let rect = range.getBoundingClientRect();
  if (collapsed) {
    let el = native.anchorNode.parentElement;
    while (el && el.className.indexOf("block") === -1) {
      el = el.parentElement;
    }

    if (el) rect = el.getBoundingClientRect();
  }
  //.parentElement.parentElement
  menu.style.opacity = 1;

  menu.style.top = `${rect.top + 15}px`; //`${rect.top + window.pageYOffset - menu.offsetHeight}px`;
  const rectCenter = 65;
  menu.style.right = `${15}px`;
  menu.style.left = `auto`;
};

const HoverMenu = ({ children, editor }) => {
  React.useEffect(() => updateMenu(editor.value));
  const [show, setShow] = React.useState(false);
  const root = window.document.getElementById("root");
  return (
    <>
      {show && <BlockSelectorContainer editor={editor} />}
      {!show &&
        ReactDOM.createPortal(
          <TopLeftToolbar ref={menuRef}>
            {children}
            <Icon
              icon={stack}
              onMouseDown={event => {
                event.preventDefault();
                setShow(true);
              }}
            />
            <Icon
              icon={equalizer2}
              onMouseDown={event => {
                event.preventDefault();
                editor.toggleMark("bold");
              }}
            />
          </TopLeftToolbar>,
          root
        )}
    </>
  );
};

const DEFAULT_NODE = "paragraph";
const toggleBlock = (editor, type) => {
  const { value } = editor;
  const { document } = value;

  // Handle everything but list buttons.
  if (type !== "bulleted-list" && type !== "numbered-list") {
    const isActive = hasBlock(editor, type);
    const isList = hasBlock(editor, "list-item");

    if (isList) {
      editor
        .setBlocks(isActive ? DEFAULT_NODE : type)
        .unwrapBlock("bulleted-list")
        .unwrapBlock("numbered-list");
    } else {
      editor.setBlocks(isActive ? DEFAULT_NODE : type);
    }
  } else {
    // Handle the extra wrapping required for list buttons.
    const isList = hasBlock(editor, "list-item");
    const isType = value.blocks.some(block => {
      return !!document.getClosest(block.key, parent => parent.type === type);
    });

    if (isList && isType) {
      editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock("bulleted-list")
        .unwrapBlock("numbered-list");
    } else if (isList) {
      editor
        .unwrapBlock(
          type === "bulleted-list" ? "numbered-list" : "bulleted-list"
        )
        .wrapBlock(type);
    } else {
      editor.setBlocks("list-item").wrapBlock(type);
    }
  }
};

const hasBlock = (editor, type) => {
  const { value } = editor;
  return value.blocks.some(node => node.type === type);
};
