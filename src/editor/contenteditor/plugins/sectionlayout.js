import React from "react";
import { Block, Value, Text, Range, Operation } from "slate";
import { WithBoundingRect } from "../components/withboundingrect";
import Ruler from "../ruler";
import AllBlocks, { TestSection } from "../blocks";
import { StyleContext } from "../../../ctx";
import { Section, EmptySection, PlainSection } from "../components/section";
import { ThemeContext } from "styled-components";
const extractEditorMeta = (
  key,
  editorType,
  { children, data, node, editor }
) => {
  let props = {};
  let toolbarOptions = [];
  if (key === "styles") {
    const results = {};
    Object.keys(editorType).forEach(styleKey => {
      results[styleKey] = extractEditorMeta(styleKey, editorType[styleKey], {
        children,
        node,
        data,
        editor
      })[0][styleKey];
    });
    props[key] = results;
  }
  if (editorType.type === "oneOf") {
    editorType.values.forEach(childType => {
      const [newProps, newOptions] = extractEditorMeta(key, childType, {
        children,
        node,
        data,
        editor
      });
      props = { ...props, ...newProps };
      toolbarOptions = [...toolbarOptions, ...newOptions];
    });
  }
  if (editorType.resolve) {
    props[key] =
      editorType.resolve({ key, children, node, data, editor }) || null;
  }
  if (editorType.type === "button") {
    toolbarOptions.push(
      <span
        onClick={() => {
          editorType.onClick({ editor, node, data, children, key });
        }}
      >
        {editorType.icon}
      </span>
    );
  }
  return [props, toolbarOptions];
};

const renderSection = (Component, { children, node, editor }) => {
  let props = {};
  let toolbarOptions = [];
  const data = node.data;
  Object.keys(Component.EditorProps).forEach(key => {
    const editorType = Component.EditorProps[key];
    const [newprops, newtoolbarOptions] = extractEditorMeta(key, editorType, {
      children,
      node,
      data,
      editor
    });
    props = { ...props, ...newprops };
    toolbarOptions = [...toolbarOptions, ...newtoolbarOptions];
  });

  return {
    component: <Component width={data && data.width} {...props} />,
    toolbarOptions: toolbarOptions
  };
};

export default function SectionLayout(opts) {
  opts = opts || {};
  opts.type = opts.type || "paragraph";
  opts.match = opts.match || (node => node.type === opts.type);

  return {
    onKeyDown(event, change, next) {
      if (event.key !== "Enter" || event.shiftKey) return next();
      if (
        change.value.selection.anchor.isAtEndOfNode(
          change.value.document.getNode(change.value.selection.anchor.path)
        )
      )
        return change.insertBlock("paragraph");
      return next();
    },
    renderBlock: (props, editor, next) => {
      const { attributes, children, data, node, isFocused } = props;

      const container = {
        getNodeForType: type => children.filter(r => r.props.node.type === type)
      };
      let isEmpty = node.text.length === 0;

      if (
        editor.value.selection &&
        editor.value.selection.anchor &&
        editor.value.selection.path &&
        editor.value.selection.path.length
      ) {
        const rootNode = editor.value.document.getFurthestAncestor(
          editor.value.selection.anchor.path
        );
        isEmpty =
          editor.value.selection.anchor.isAtStartOfNode(rootNode) &&
          editor.value.selection.anchor.isAtEndOfNode(rootNode);
      }
      if (props.parent.object !== "document" && props.parent.type !== "block")
        return <span {...attributes}>{children}</span>;

      const Wrapper = node.type === "section" ? React.Fragment : PlainSection;
      switch (node.type) {
        case "section":
          const data = node.data.toJS();
          let ruler = null;
          if (TestSection.RulerWidths) {
            /*ruler = (
              <Ruler
                setSectionWidth={w => this.setSectionWidth(w, node)}
                widths={TestSection.RulerWidths}
              />
            );*/
          }
          const blockName = node.data.get("blockName");
          return (
            <ThemeContext.Consumer>
              {ctx => {
                const sectionData = renderSection(
                  AllBlocks.filter(r => r.name === blockName)[0].block,
                  {
                    children,
                    node,
                    editor
                  }
                );
                const SectionComponent = sectionData.component;
                const icons = sectionData.toolbarOptions;

                return (
                  <>
                    {ruler}
                    <WithBoundingRect
                      icons={icons}
                      render={(rect, selected) => (
                        <Section
                          contentEditable={true}
                          isFocused={isFocused || selected}
                          width={data && data.width}
                          {...attributes}
                        >
                          {/*<SelectorIcon selected={isFocused || selected} />*/}
                          {SectionComponent}
                        </Section>
                      )}
                    />
                  </>
                );
              }}
            </ThemeContext.Consumer>
          );
        case "block":
          return (
            <WithBoundingRect
              icons={[]}
              showHover={true}
              render={(rect, selected) => (
                <>
                  <PlainSection
                    className="block"
                    showHover={true}
                    selected={selected}
                    {...attributes}
                  >
                    {children}
                  </PlainSection>
                </>
              )}
            />
          );
        default:
          if (props.wrapped) {
            return <PlainSection>{children}</PlainSection>;
          }
          return (
            <WithBoundingRect
              icons={[]}
              render={(rect, selected) => (
                <EmptySection isEmpty={isEmpty} attributes={attributes}>
                  {children}
                </EmptySection>
              )}
            />
          );
      }
    },
    normalizeNode: node => {
      if (node.type === "section") {
        // Is a section
        const nodeType = node.data.get("nodeType");
        const schemaMap = node.data.get("schema");
        const schemaValues = Object.values(schemaMap);

        const newBlocks = schemaValues
          .map(schemaValue => {
            if (!schemaValue.nodeType) return null;
            const matches = node.nodes.filter(
              r => r.type === schemaValue.nodeType
            );
            if (matches.size === 0) {
              return schemaValue.create();
            }
          })
          .filter(r => r);
        if (newBlocks.length > 0) {
          return change => {
            newBlocks.forEach(bl => {
              change.insertNodeByKey(node.key, 0, bl);
            });
          };
        }
      }
      if (node.object === "document") {
        const nodeGroups = [];
        let nodeGroup = [];
        nodeGroups.push(nodeGroup);
        let requiresChange = false;
        node.nodes.forEach(childNode => {
          if (childNode.type === "section" || childNode.type === "block") {
            nodeGroup = [];
            nodeGroups.push(nodeGroup);
            return;
          }
          requiresChange = true;
          nodeGroup.push(childNode);
        });
        if (requiresChange) {
          const docKey = node.key;
          return change => {
            const nodes = nodeGroups[0];
            if (nodes.length > 0) {
              const newBlock = Block.create({
                object: "block",
                type: "block",
                nodes: nodes
              });
              nodes.forEach(node => {
                change.removeNodeByKey(node.key);
              });
              change.insertNodeByPath([], 0, newBlock);
            }
          };
        }

        return undefined;
      }
      return undefined;
    }
  };
}
