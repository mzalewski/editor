import React from "react";
import styled from "styled-components";

const VerticalToolbar = styled.div`
  background: black;
  display: flex;
  flex-direction: column;
  z-index: 20;
  background: #49a1e9;
  position: absolute;
  color: #c9e0f3;
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 2px 10px;

  transform: translateX(-100%) translateY(-50%);
  top: 50%;
  left: 0px;

  i {
    &:hover {
      color: white;
    }
    cursor: pointer;
    padding: 10px 5px;
    cursor: pointer;
    /* width: 1.2rem; */
    display: flex !important;
    align-items: center;
    /* height: 1.2rem; */
    svg {
      width: 1.2rem;
      height: 1.2rem;
    }
  }

  &:before {
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    border: 6px solid transparent;
    right: -12px;
    top: 50%;
    margin-top: -5px;

    border-left-color: #49a1e9;
  }
`;

export const InsertToolbar = styled.div`
  background: transparent;
  display: flex;
  flex-direction: row;
  z-index: 20;
  background: transparent;
  position: absolute;
  color: #49a1e9;
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 0px 5px;

  transform: translateX(0%) translateY(-50%);
  top: 50%;
  left: -30px;

  i {
    &:hover {
      color: #212936;
    }
    cursor: pointer;
    padding: 10px 10px;
    cursor: pointer;
    /* width: 1.2rem; */
    display: flex !important;
    align-items: center;
    /* height: 1.2rem; */
    svg {
      width: 1rem;
      height: 1rem;
    }
  }
`;
export const Toolbar = styled.div`
  background: black;
  display: flex;
  z-index: 20;
  background: #49a1e9;
  position: absolute;
  color: #c9e0f3;
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 2px 10px;
  margin-bottom: 7px;

  -webkit-transform: translateX(-50%) translateY(-100%);
  -webkit-transform: translateX(-50%) translateY(-100%);
  -ms-transform: translateX(-50%) translateY(-100%);
  transform: translateX(-50%) translateY(-100%);
  left: 50%;

  margin-top: -7px;

  ${props =>
    props.from !== undefined && props.to !== undefined
      ? `
      transform: translateY(-50%);
    top:${props.from + (props.to - props.from) / 2}px;
    left: 0px;
  `
      : ""}
  i {
    &:hover {
      color: white;
    }
    cursor: pointer;
    padding: 5px 10px;
    cursor: pointer;
    padding: 5px 10px;
    /* width: 1.2rem; */
    display: flex !important;
    align-items: center;
    /* height: 1.2rem; */
    svg {
      width: 1.2rem;
      height: 1.2rem;
    }
  }
  ${props =>
    props.align === "topright" &&
    `
    right: 0px;
    left: auto;
    transform: translate(-10px, 10px);
  `}
  ${props =>
    !props.hideArrow &&
    `
  &:before {
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    border: 6px solid transparent;

    left: 50%;
    margin-left: -5px;
    bottom: -12px;
    border-top-color: #49a1e9;
  }
  `}
`;
