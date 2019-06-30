import React from "react";
import ReactDOM from "react-dom";
import { Editor } from "./editor";
import "./styles.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { StyleContext } from "./ctx";
import { ThemeProvider } from "styled-components";
function App() {
  return <Editor />;
}
const defaultStyles = {
  colors: {},
  accentColors: {},
  lightColors: {},
  darkColors: {}
};
const StyleProvider = ({ children }) => {
  const [styleState, setStyleState] = React.useState(defaultStyles);

  return (
    <StyleContext.Provider
      value={{
        ...styleState,
        setStyleState: setStyleState
      }}
    >
      {" "}
      <ThemeProvider theme={styleState}>{children}</ThemeProvider>
    </StyleContext.Provider>
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render(
  <StyleProvider>
    <Router>
      <App />
    </Router>
  </StyleProvider>,
  rootElement
);
