import React from "react";
import ReactDOM from "react-dom";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { StepMap } from "prosemirror-transform";
import { keymap } from "prosemirror-keymap";
import { undo, redo } from "prosemirror-history";
import arrayMove from "array-move";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  & > * {
    flex: 1 1 50%;
  }
`;
const SortableItem = SortableElement(({ value }) => <div>{value}</div>);

const SortableList = SortableContainer(({ items }) => {
  return (
    <Row>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </Row>
  );
});
class SortableComponent extends React.Component {
  state = {
    items: ["Item 1", "Item 2"]
  };
  shouldCancelStart = () => false;
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex)
    }));
  };
  render() {
    return (
      <SortableList
        axis="x"
        shouldCancelStart={this.shouldCancelStart}
        items={this.state.items}
        onSortEnd={this.onSortEnd}
      />
    );
  }
}
export const Section = ({}) => {
  /* var headingNode = content.filter(r => r.type.name === "heading")[0];
  var img = content.filter(r => r.type.name === "image")[0];
  debugger;
 */ return (
    <div contentEditable={false}>
      <SortableComponent />
    </div>
  );
};
export default class SectionView {
  constructor(node, view, getPos) {
    // We'll need these later
    this.node = node;
    this.outerView = view;
    this.getPos = getPos;

    // The node's representation in the editor (empty, for now)
    this.dom = document.createElement("section");
    this.reactDom = document.createElement("div");

    //this.contentDOM = document.createElement("div");
    //this.contentDOM.contentEditable = true;
    this.dom.appendChild(this.reactDom);
    // These are used when the footnote is selected
    this.innerView = null;
    ReactDOM.render(
      <Section content={this.node.content.content}>Test</Section>,
      this.reactDom
    );
  }
  update(node) {
    if (node.type.name === "section") {
      if (node.attrs.width !== this.width) {
        this.node = node;
        this.width = node.attrs.width;
        //  this.dom.style = `max-width:${this.width}`;
      }
      return true;
    }

    return false;
  }
  ignoreMutation() {
    return true;
  }
  stopEvent(event) {
    console.log("STOOPPING");
    return true; //this.innerView && this.innerView.dom.contains(event.target)
  }
}
