import React from "react";
import ReactDOM from "react-dom";
import { Toolbar } from "../components/toolbar";
import { Icon } from "react-icons-kit";
import { bold } from "react-icons-kit/icomoon/bold";
import { underline } from "react-icons-kit/icomoon/underline";
import { italic } from "react-icons-kit/icomoon/italic";
import { quotesLeft } from "react-icons-kit/icomoon/quotesLeft";
import { listNumbered } from "react-icons-kit/icomoon/listNumbered";
import { fontSize } from "react-icons-kit/icomoon/fontSize";
import { list } from "react-icons-kit/icomoon/list";
const menuRef = React.createRef();
export default function() {
  return {
    renderEditor(props, editor, next) {
      const children = next();
      return (
        <React.Fragment>
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

  const { fragment, selection } = value;

  const collapsed =
    selection.isBlurred || selection.isCollapsed || fragment.text === "";

  //menu.removeAttribute("style");
  //return;
  //}

  const native = window.getSelection();
  if (!native.rangeCount) return;
  const range = native.getRangeAt(0);
  let rect = range.getBoundingClientRect();
  if (collapsed) {
    menu.removeAttribute("style");
    return;
  }
  //.parentElement.parentElement
  menu.style.opacity = 1;

  menu.style.top = `${rect.top - 5}px`; //`${rect.top + window.pageYOffset - menu.offsetHeight}px`;
  const rectCenter = rect.left + rect.width / 2;
  menu.style.left = `${rectCenter}px`;
};

const HoverMenu = ({ children, editor }) => {
  React.useEffect(() => updateMenu(editor.value));
  const root = window.document.getElementById("root");
  return ReactDOM.createPortal(
    <Toolbar ref={menuRef}>
      {children}
      <Icon
        icon={bold}
        onMouseDown={event => {
          event.preventDefault();
          editor.toggleMark("bold");
        }}
      />
      <Icon
        icon={italic}
        onMouseDown={event => {
          event.preventDefault();
          editor.toggleMark("italic");
        }}
      />
      <Icon
        icon={underline}
        onMouseDown={event => {
          event.preventDefault();
          editor.toggleMark("underlined");
        }}
      />

      <Icon
        icon={fontSize}
        onMouseDown={event => {
          event.preventDefault();
          toggleBlock(editor, "heading");
        }}
      />

      <Icon
        icon={quotesLeft}
        onMouseDown={event => {
          event.preventDefault();
          toggleBlock(editor, "block-quote");
        }}
      />
      <Icon
        icon={listNumbered}
        onMouseDown={event => {
          event.preventDefault();
          toggleBlock(editor, "numbered-list");
        }}
      />
      <Icon
        icon={list}
        onMouseDown={event => {
          event.preventDefault();
          toggleBlock(editor, "bulleted-list");
        }}
      />
    </Toolbar>,
    root
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
