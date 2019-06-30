import React from "react";
import data from "../data/site";
import ContentEditor from "./contenteditor";
import Navbar from "../components/navbar/basic";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Sidebar from "./sidebar";
import SectionBar from "./sectionbar";
import PageList from "./pagelist";
import Header, { Editor as HeaderEditor } from "../components/header/basic";
import styled from "styled-components";
import { Route } from "react-router-dom";
import { Value } from "slate";
const Workspace = styled("div")`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 19;
  bottom: 0px;
  display: flex;
  > * {
    flex: 1 1 100%;
  }
`;
const WorkspaceSidebar = styled("div")`
  background: #222;
  flex: 0 0 200px;
`;
const Designer = styled("div")`
  background: #fff;
  flex: 1 1 100%;
  position: relative;
`;
const DB = styled("div")`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  > * {
    flex: 1 1 100%;
  }
  > h1 {
    flex: 0 0 auto;
  }
  img {
    max-width: 100%;
  }
  background: #f8f8f8;
`;
const TitleBanner = styled.div`
  font-size: 14px;
  /* height: 50px; */
  padding: 10px 20px;
  /* border-bottom: 1px solid #f0f0f0; */
  font-weight: 400;
  color: #888;
  display: flex;
  background: #fff;
  align-items: center;
  justify-content: space-between;
  flex-basis: 45px;
  flex-shrink: 0;
  flex-grow: 0;
  box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
    0 1px 3px 0 rgba(63, 63, 68, 0.15);
`;
const Button = styled.button`
  border-radius: 4px;
  padding: 8px 18px;
  background: #49a1e9;
  border: 1px solid #49a1e9;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
`;
const A = styled.a`
  text-decoration: none;
  color: #602992;
`;
const TitleIcon = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin: 0px 8px;
`;
const Wrapper = styled.div`
  padding: 0.8em;
  display: flex;
  max-width: 1200px;
  width: 100%;
  margin: 0px auto;
  ${props => !props.isDragging && `overflow-y: auto;`}
  flex: 1 1 100%;
`;
const DocStarter = Value.fromJSON({
  object: "value",
  document: {
    object: "document",
    data: {},
    /*  nodes: [
        {
          object: "block",
          type: "section",*/
    nodes: [
      {
        object: "block",
        type: "heading",
        marks: [],
        nodes: [{ object: "text", text: "Heading goes here" }]
      },
      {
        object: "block",
        type: "paragraph",
        marks: [],
        nodes: [{ object: "text", text: "And body text goes here" }]
      }
      /* ]
        }
      */
    ]
  }
});
const onBeforeDragStart = () => console.log(arguments);
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const onDragEnd = () => console.log(arguments);
const Dashboard = () => {
  const [doc, setDoc] = React.useState(DocStarter);
  const [draggingdoc, setDraggingDoc] = React.useState(null);
  const [isDraggingSections, setDraggingSections] = React.useState(false);
  const onDragUpdate = (e, provided) => {
    const newIndex = e.destination.index;
    const oldIndex = e.source.index;
    const currentDoc = doc.toJS();
    const currentNodes = currentDoc.document.nodes;

    const newNodes = reorder(currentNodes, oldIndex, newIndex);
    currentDoc.document.nodes = newNodes;
    setDraggingDoc(Value.fromJS(currentDoc));
  };
  const onDragStart = (e, d) => {
    setDraggingSections(true);
  };
  const onDragEnd = () => {
    setDraggingSections(false);
    if (draggingdoc !== null) setDoc(draggingdoc);
    setDraggingDoc(null);
  };
  return (
    <>
      <DragDropContext
        onBeforeDragStart={onBeforeDragStart}
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragEnd}
      >
        <SectionBar
          isDragging={isDraggingSections}
          doc={doc}
          updateDoc={setDoc}
        />
      </DragDropContext>
      <DB id="db">
        <TitleBanner>
          <A href="#">
            &lt;
            <TitleIcon>
              <svg width="20" height="20" viewBox="0 0 32 32">
                <path
                  fill="currentColor"
                  d="M28.681 11.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-11.5c-1.379 0-2.5 1.122-2.5 2.5v23c0 1.378 1.121 2.5 2.5 2.5h19c1.378 0 2.5-1.122 2.5-2.5v-15.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 9.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268v0zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-19c-0.271 0-0.5-0.229-0.5-0.5v-23c0-0.271 0.229-0.5 0.5-0.5 0 0 11.499-0 11.5 0v7c0 0.552 0.448 1 1 1h7v15.5z"
                />
                <path
                  fill="currentColor"
                  d="M18.841 1.319c-1.612-1.182-2.393-1.319-2.841-1.319h-11.5c-1.378 0-2.5 1.121-2.5 2.5v23c0 1.207 0.86 2.217 2 2.45v-25.45c0-0.271 0.229-0.5 0.5-0.5h15.215c-0.301-0.248-0.595-0.477-0.873-0.681z"
                />
              </svg>
            </TitleIcon>
            All Posts
          </A>
          <Button>Update</Button>
        </TitleBanner>
        <Wrapper isDragging={isDraggingSections}>
          <ContentEditor
            isDragging={isDraggingSections}
            doc={draggingdoc || doc}
            updateDoc={setDoc}
          />
        </Wrapper>
      </DB>
    </>
  );
};
const PostList = PageList;
const FormList = PageList;
export const Editor = () => {
  const [dataState, updateDataState] = React.useState(data);
  const doUpdateState = section => stateDataToBeUpdated => {
    const newState = { ...dataState };
    const newSection = { ...dataState[section], ...stateDataToBeUpdated };
    const updated = { ...newState, [section]: newSection };
    console.log(updated);
    return updateDataState(updated);
  };

  const editable = {
    header: {
      onChange: doUpdateState("header")
    }
  };
  return (
    <Workspace>
      <Sidebar collapse={true} />

      <Route path="/" exact component={Dashboard} />
      <Route path="/pages" component={PageList} />

      <Route path="/posts" exact component={PostList} />
      <Route path="/forms" exact component={FormList} />
    </Workspace>
  );
};
