import React from "react";
import { SketchPicker } from "react-color";
import styled from "styled-components";
import SectionSettings from "./settingsPanel";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { NavLink } from "react-router-dom";
import InsertBlockContainer from "./insertBlock";
import { StyleContext } from "../../ctx";
const Sidebar = styled.div`
  background: #f8f8f8;
  position: relative;
  color: #222;
  border-right: 1px solid rgba(63, 63, 68, 0.05);
  box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
    0 1px 3px 0 rgba(63, 63, 68, 0.15);

  ${({ collapse }) =>
    collapse
      ? `
    max-width: 52px;
    overflow-x:hidden;
    `
      : `max-width: 256px;`}
  width:100%;
  display: flex;
  flex: 0 0 256px;
  min-width: 256px;
  flex-direction: column;
`;

const TitleBanner = styled.div`
  font-size: 14px;
  /* height: 50px; */
  padding: 0px 0px;
  /* border-bottom: 1px solid #f0f0f0; */
  font-weight: 400;
  color: #888;
  display: flex;
  background: #fff;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
    0 1px 3px 0 rgba(63, 63, 68, 0.15);
`;
const SidebarLinkContainer = styled.div`
  margin: 0px 0px;
  background: white;
  padding: 10px 0px;
  color: #222;
  box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
    0 1px 3px 0 rgba(63, 63, 68, 0.15);
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: #111;
  }
  color: inherit;
  &.active {
    background: #fff;
    color: #222;
    box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
      0 1px 3px 0 rgba(63, 63, 68, 0.15);
  }
`;
const SidebarLinkTitle = styled.div`
  display: flex;
  padding: 0 16px;
  align-items: center;
  min-height: ${props => (props.small ? "45px" : "40px")};
`;
const SidebarLinkText = styled.div`
  flex: 1 1 100%;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 21px;
  ${props => props.center && `text-align:center;`}
`;
const SidebarLinkChild = styled.div`
  flex: 1 1 100%;
  padding: 4px 10px 4px 70px;
  text-transform: uppercase;
  background: #f8f8f8;

  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 21px;
  ${props => props.center && `text-align:center;`}
`;
const SidebarLinkIcon = styled.div`
  flex: 0 0 24px;
  margin-right: 32px;
  display: flex;
  align-items: center;
`;
const SidebarLink = ({ text, icon, onClick }) => (
  <SidebarLinkContainer onClick={onClick}>
    <SidebarLinkTitle>
      <SidebarLinkIcon>{icon}</SidebarLinkIcon>
      <SidebarLinkText>{text}</SidebarLinkText>
    </SidebarLinkTitle>
    {/*children &&
      children.map(child => <SidebarLinkChild>{child.name}</SidebarLinkChild>)*/}
  </SidebarLinkContainer>
);
const SidebarAddNew = ({ to, exact, text, active, icon, className }) => (
  <SidebarLinkContainer small exact={exact} to={to} active={active}>
    <SidebarLinkText center>{text}</SidebarLinkText>
  </SidebarLinkContainer>
);
const getSectionOrBlock = node => {
  if (node.type === "section") {
    return { key: node.key, name: node.data.blockName };
  }
  if (node.type === "block") {
    return {
      key: node.key,
      name: "Custom",
      children: node.nodes && node.nodes.map(r => getSectionOrBlock(r))
    };
  }
  return {
    key: node.key,
    name: node.type,
    children: node.nodes && node.nodes.map(r => getSectionOrBlock(r))
  };
};
const getSectionsFromDoc = doc => {
  return doc.document.nodes.toJS().map(r => getSectionOrBlock(r));
};
const Tab = styled.div`
  flex-basis: 50%;
  text-align: center;
  cursor: pointer;
  color: ${props => (props.active ? "#222" : "#888")};
  font-weight: bold;
  line-height: 25px;
  border: 1px solid #eee;
  margin: 20px 0px 0px 0px;
  padding: 8px 0px;
  border-bottom: 3px solid
    ${props => (props.active ? "#49a1e9" : "transparent")};
`;
const SectionWrapper = styled.div`
  margin: 10px 0px;
`;
export default ({ doc, updateDoc, collapse }) => {
  const [currentTab, setTab] = React.useState("overview");
  const [showAddBlock, setShowAddBlock] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(null);
  const sections = getSectionsFromDoc(doc);
  return (
    <Sidebar collapse={collapse}>
      <TitleBanner>
        <Tab
          active={currentTab === "overview"}
          onClick={() => setTab("overview")}
        >
          Overview
        </Tab>
        <Tab active={currentTab === "styles"} onClick={() => setTab("styles")}>
          Styles
        </Tab>
      </TitleBanner>
      {currentTab === "overview" && (
        <>
          <Droppable droppableId="sections">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <SectionWrapper>
                  {sections.map((r, i) => {
                    return (
                      <Draggable draggableId={r.key} index={i}>
                        {provided => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <SidebarLink
                              text={r.name}
                              onClick={() => setShowSettings(r)}
                              icon={
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0 10H8V0H0V10ZM0 18H8V12H0V18ZM10 18H18V8H10V18ZM10 0V6H18V0H10Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              }
                              children={r.children}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </SectionWrapper>
              </div>
            )}
          </Droppable>

          <SectionSettings
            hide={() => setShowSettings(null)}
            selected={showSettings}
            doc={doc}
            updateDoc={updateDoc}
          />
          <InsertBlockContainer
            hide={() => setShowAddBlock(false)}
            show={showAddBlock}
            updateDoc={updateDoc}
          />
          <SidebarAddNew
            text={<a onClick={() => setShowAddBlock(true)}>Add New Section</a>}
            to="/pages"
            active
          />
        </>
      )}
      {currentTab === "styles" && <Styles />}
    </Sidebar>
  );
};
const ColorWrapper = styled.div`
  position: relative;
`;

const SketchColorPicker = styled(SketchPicker)`
  position: absolute;
  top: 100%;
  z-index: 1;
`;
const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ColorPicker = ({ size, color, onChange }) => {
  const [showPicker, setShowPicker] = React.useState(false);
  const node = React.useRef();
  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setShowPicker(false);
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);
  const handleChangeComplete = (color, event) => {
    onChange(color.hex);
  };

  return (
    <ColorWrapper ref={node}>
      <Color color={color} size={size} onClick={() => setShowPicker(true)} />
      {showPicker && (
        <SketchColorPicker
          color={color}
          onChangeComplete={handleChangeComplete}
        />
      )}
    </ColorWrapper>
  );
  return;
};
const Color = styled.div`
  border-radius: 1000px;
  width: ${props => props.size || "25"}px;
  height: ${props => props.size || "25"}px;
  border: 1px solid #eee;
  background: ${props => props.color || "#222"};
  margin: 5px 5px;
`;
const StyleSection = styled.div`
  margin: 2px 0px;
  background: white;
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
`;
const StyleHeader = styled.h3`
  color: #444;
  font-size: 14px;
  line-height: 20px;
`;
const StyleSectionHeader = styled.div`
  color: #444;
  font-size: 12px;
  font-weight: bold;
  padding: 20px 20px 10px 20px;
`;
const StyleHelp = styled.div`
  color: #888;
  font-size: 12px;
  margin: 8px 0px;
`;
const Styles = () => {
  const { setStyleState, ...styleCtx } = React.useContext(StyleContext);

  const colors = styleCtx.colors || {};
  const colors2 = styleCtx.accentColors || {};
  const setColors = (key, newColors) => {
    const exit = styleCtx[key] || {};
    setStyleState({ ...styleCtx, [key]: { ...exit, ...newColors } });
  };
  const setColors2 = newColors => {
    setStyleState({ ...styleCtx, accentColors: newColors });
  };
  return (
    <div>
      <StyleSectionHeader>Colors</StyleSectionHeader>
      <StyleSection>
        <StyleHeader>Primary Colors</StyleHeader>
        <StyleHelp>These are the main colors that will be used</StyleHelp>
        <ColorPalette>
          <ColorPicker
            color={styleCtx.colors.a}
            size={40}
            onChange={c => setColors("colors", { a: c })}
          />
          <ColorPicker
            color={styleCtx.colors.b}
            size={30}
            onChange={c => setColors("colors", { b: c })}
          />
          <ColorPicker
            color={styleCtx.colors.c}
            onChange={c => setColors("colors", { c: c })}
          />
          <ColorPicker
            color={styleCtx.colors.d}
            onChange={c => setColors("colors", { d: c })}
          />
        </ColorPalette>
      </StyleSection>

      <StyleSection>
        <StyleHeader>Text Colors</StyleHeader>
        <StyleHelp>
          These colors are used to accentuate important elements (eg: Call to
          Action backgrounds)
        </StyleHelp>
        <ColorPalette>
          <ColorPicker
            color={styleCtx.accentColors.a}
            size={40}
            onChange={c => setColors("accentColors", { a: c })}
          />
          <ColorPicker
            color={styleCtx.accentColors.b}
            size={30}
            onChange={c => setColors("accentColors", { b: c })}
          />
          <ColorPicker
            color={styleCtx.accentColors.c}
            onChange={c => setColors("accentColors", { c: c })}
          />
        </ColorPalette>
      </StyleSection>
      <StyleSectionHeader>Text</StyleSectionHeader>
      <StyleSection>
        <StyleHeader>Headings</StyleHeader>
        <StyleHelp>These are the main colors that will be used</StyleHelp>
        <ColorPalette>
          <ColorPicker
            color={styleCtx.colors.a}
            size={40}
            onChange={c => setColors("colors", { a: c })}
          />
          <ColorPicker
            color={styleCtx.colors.b}
            size={30}
            onChange={c => setColors("colors", { b: c })}
          />
          <ColorPicker
            color={styleCtx.colors.c}
            onChange={c => setColors("colors", { c: c })}
          />
          <ColorPicker
            color={styleCtx.colors.d}
            onChange={c => setColors("colors", { d: c })}
          />
        </ColorPalette>
      </StyleSection>

      <StyleSection>
        <StyleHeader>Body Text</StyleHeader>
        <StyleHelp>
          These colors are used to accentuate important elements (eg: Call to
          Action backgrounds)
        </StyleHelp>
        <ColorPalette>
          <ColorPicker
            color={styleCtx.accentColors.a}
            size={40}
            onChange={c => setColors("accentColors", { a: c })}
          />
          <ColorPicker
            color={styleCtx.accentColors.b}
            size={30}
            onChange={c => setColors("accentColors", { b: c })}
          />
          <ColorPicker
            color={styleCtx.accentColors.c}
            onChange={c => setColors("accentColors", { c: c })}
          />
        </ColorPalette>
      </StyleSection>
    </div>
  );
};
