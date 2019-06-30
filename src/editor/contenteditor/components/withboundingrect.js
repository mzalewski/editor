import React from "react";
import { Toolbar } from "./toolbar";
import styled from "styled-components";
const SectionWrapper = styled.div`
  position: relative;

  ${props =>
    props.selected &&
    `
    &:be1fore {
      pointer-events:none;
   position: absolute;
    top: -1px;
    left: 0px;
    right: 0px;
    bottom: -1px;
    display: block;
    border: 2px solid rgb(73, 161, 233, 0.2);
    background: rgb(73, 161, 233, 0.05);
    content: "";
    }
  `}
`;

export class WithBoundingRect extends React.Component {
  state = {
    isSelected: false
  };
  componentDidMount() {
    this.test = "1";
    //this.rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    this.positionToolbar();
  }
  toggle = e => {
    e.stopPropagation();
    e.preventDefault();
    this.setState(state => ({ isSelected: !state.isSelected }));
  };
  componentDidUpdate() {
    //this.rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
    this.positionToolbar();
  }
  positionToolbar = () => {};
  render() {
    return (
      <SectionWrapper {...this.props} selected={this.state.isSelected}>
        {this.props.icons && this.props.icons.length ? (
          <Toolbar>{this.props.icons}</Toolbar>
        ) : null}
        {this.props.render(this.rect, this.state.isSelected)}
      </SectionWrapper>
    );
  }
}
