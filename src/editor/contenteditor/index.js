import React, { useState } from "react";
import ReactDOM from "react-dom";
import SectionLayout from "./plugins/sectionlayout";
import Menu from "./plugins/menu";
import SectionConfig from "./plugins/sectionconfig";
import BaseElements from "./plugins/baseelements";
import UrlAutoInsert from "./plugins/urlautoinsert";
import { EditorTypes } from "./types/editortypes";
import { StyleContext } from "../../ctx";
import {
  Section,
  TestSection,
  EmptySection,
  PlainSection
} from "./components/section";
import AllBlocks from "./blocks";
import styled from "styled-components";
import SoftBreak from "slate-soft-break";

import PropTypes from "prop-types";

import { checkboxUnchecked } from "react-icons-kit/icomoon/checkboxUnchecked";
import { checkboxChecked } from "react-icons-kit/icomoon/checkboxChecked";

import { findDOMNode } from "slate";

import { shuffle } from "react-icons-kit/entypo/shuffle";
import { StepMap, Mapping } from "./map";
import Plain from "slate-plain-serializer";
import { Block, Value, Text, Range, Operation } from "slate";
import { sidebar } from "react-icons-kit/feather/sidebar";
import Ruler from "./ruler";
import { Icon } from "react-icons-kit";
import { SelectableGroup } from "react-selectable-fast";

import { Editor, Node, Content } from "slate-react";
import { isKeyHotkey } from "is-hotkey";
const EditorContext = React.createContext({});
const isBoldHotkey = isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+u");
const isTabHotkey = isKeyHotkey("tab");

window.Range = Range;

const extractEditorMeta = (key, editorType, { children, node, editor }) => {
  let props = {};
  let toolbarOptions = [];

  if (editorType.type === "oneOf") {
    editorType.values.forEach(childType => {
      const [newProps, newOptions] = extractEditorMeta(key, childType, {
        children,
        node,
        editor
      });
      props = { ...props, ...newProps };
      toolbarOptions = [...toolbarOptions, ...newOptions];
    });
  }
  if (editorType.resolve) {
    props[key] = editorType.resolve({ key, children, node, editor }) || "123";
  }
  if (editorType.type === "button") {
    toolbarOptions.push(
      <span
        onClick={() => {
          editorType.onClick({ editor, node, children, key });
        }}
      >
        {editorType.icon}
      </span>
    );
  }
  return [props, toolbarOptions];
};

const schema = {
  blocks: { image: { isVoid: true } }
};
const plugins = [
  UrlAutoInsert(),
  Menu(),
  BaseElements(),
  SoftBreak({ shift: true }),
  SectionLayout(),
  SectionConfig()
];
export default class ContentEditor extends React.Component {
  componentDidMount() {}
  setSectionWidth = (width, node) => {
    let foundSection = node;
    let anchor = null;
    if (!node) {
      anchor = this.editor.value.selection.anchor;
      var currentPath = this.editor.value.selection.anchor.path.toJS();

      while (currentPath.length > 0) {
        const toCheck = this.editor.value.document.getNode(currentPath);
        if (toCheck) {
          if (toCheck.type === "section") {
            foundSection = toCheck;
          }
        }
        currentPath = currentPath.slice(1);
      }
    }
    if (foundSection) {
      this.editor.setNodeByKey(foundSection.key, {
        ...foundSection.toJS(),
        data: { ...foundSection.data.toJS(), width: width }
      });
      if (anchor) this.editor.moveAnchorTo(anchor.path);
    }
  };
  doRender(children, type) {
    return children.filter(r => r.props.node.type === type);
  }

  map = [];
  stepMaps = [];

  onChange = value => {
    console.log(value && value.value.toJS());
    this.props.updateDoc(value.value);
  };
  menuRef = React.createRef();
  componentDidMount = () => {
    this.updateMenu();
  };
  updateMenu = () => {
    const menu = this.menuRef.current;
    if (!menu) return;

    const { value } = this.state;
    const { fragment, selection } = value;

    if (selection.isBlurred || selection.isCollapsed || fragment.text === "") {
      menu.removeAttribute("style");
      return;
    }

    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    menu.style.opacity = 1;
    menu.style.top = `${rect.top + window.pageYOffset}px`;

    menu.style.left = `${rect.left + window.pageXOffset + rect.width / 2}px`;
  };
  componentDidUpdate = () => {
    this.updateMenu();
  };
  renderEditor = (props, editor, next) => {
    const children = next();

    return (
      <StyleContext.Consumer>
        {ctx => {
          editor.ctx = ctx;
          return children;
        }}
      </StyleContext.Consumer>
    );
  };

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };
  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  };
  onKeydown = (event, editor, next) => {
    let mark;
    if (isTabHotkey(event)) {
      const nText = editor.value.document.getNode(
        editor.value.selection.anchor.path
      ).text;

      if (nText.length === 0) {
        event.preventDefault();
        const blockPath = editor.value.selection.anchor.path.take(1);
        const offset = editor.value.selection.anchor.path.skip(1).first();
        editor.splitNodeByPath(blockPath, offset);
      }
      return next();
    } else if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  render() {
    return (
      <EditorWrapper isDragging={this.props.isDragging}>
        <Editor
          plugins={plugins}
          renderMark={this.renderMark}
          renderEditor={this.renderEditor}
          schema={schema}
          ref={r => (window.editor = this.editor = r)}
          onChange={this.onChange}
          onKeyDown={this.onKeydown}
          placeholder="Enter some rich text..."
          value={this.props.doc}
        />
      </EditorWrapper>
    );
  }
}
const EditorWrapper = styled.div`
  background: white;
  flex: 1 1 100%;
  transition: all 0.3s;
  overflow-y: auto;
  transform-origin: 50% 0px;
  ${props => props.isDragging && `transform: scale(0.5);`}
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1), 0 0 12px rgba(0, 0, 0, 0.1);
`;
/*{this.renderMarkButton('bold', 'format_bold')}
{this.renderMarkButton('italic', 'format_italic')}
{this.renderMarkButton('underlined', 'format_underlined')}
{this.renderMarkButton('code', 'code')}
{this.renderBlockButton('heading-one', 'looks_one')}
{this.renderBlockButton('heading-two', 'looks_two')}
{this.renderBlockButton('block-quote', 'format_quote')}
{this.renderBlockButton('numbered-list', 'format_list_numbered')}
{this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
*/
