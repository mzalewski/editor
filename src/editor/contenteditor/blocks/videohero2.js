import React from "react";
import styled from "styled-components";
import EditorTypes from "../types/editortypes";
const H1 = styled.h1`
  font-size: 18px;

  font-weight: normal;
  text-align: left;
  padding: 20px;
  margin: 20px 0px;
  strong {
    &:after {
      background: url(https://andyhooke.co.uk/wp-content/uploads/2018/02/yellow-brushstroke.png);
      background-repeat: no-repeat;
      background-size: 100% 95%;
      padding: 8px 28px;
      content: "";
      display: block;
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 0px;
      z-index: -1;
    }
    white-space: nowrap;
    position: relative;
  }
`;
const HeadLineBg = styled.div`
  flex: 0 0 400px;
  padding-left: 100px;
  text-align: left;
  align-self: center;

  &:before1 {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
    background: #0f8a9d;
    background: linear-gradient(57deg, #00c6a7 0%, #1e4d92 100%);
    -webkit-transform-origin: 0;
    transform-origin: 0;
    -webkit-transform: skewY(-12deg);
    transform: skewY(-12deg);
  }
`;
const VideoContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  flex: 1 1 auto;
  padding: 100px;
`;
const Bg = styled.div`
  display: flex;
  color: white;
  background: linear-gradient(45deg, #fb83b5ee 0%, #9a51ffee 100%),
    url(https://colorlib.com/preview/theme/webhost/images/bg_1.jpg);
`;
const Headline = props => (
  <Bg>
    <HeadLineBg>
      <H1>{props.heading}</H1>
    </HeadLineBg>
    <VideoContainer>{props.video}</VideoContainer>
  </Bg>
);
Headline.EditorProps = {
  heading: EditorTypes.Heading(),
  video: EditorTypes.Frame()
};
export default Headline;
