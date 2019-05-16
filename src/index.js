import React from "react";
import ReactDOM from "react-dom";
import { Editor } from "./editor";
import "./styles.css";

function App() {
  return <Editor />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
