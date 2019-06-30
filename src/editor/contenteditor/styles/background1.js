import { css } from "@emotion/core";
import bg from "./bg1.svg";
export default theme => {
  console.log(theme);
  console.log(bg);
  return css`
    position: relative;
    &:after {
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      display: "block";
      content: "";
    }
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjg4MCIgaGVpZ2h0PSIxNTMxIiB2aWV3Q…VpZ2h0PSIxNTMxIiBmaWxsPSJ3aGl0ZSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=),
      linear-gradient(blue, red);
  `;
};
