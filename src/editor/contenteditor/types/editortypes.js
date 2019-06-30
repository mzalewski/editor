import { Block, Text } from "slate";
import { getStyleByName } from "../styles";
const NodeType = (opts, nodeType, defaultValue = "", defaultData = {}) => {
  return {
    ...opts,
    type: "node",
    nodeType: nodeType,
    create: () =>
      Block.create({
        type: nodeType,
        data: defaultData,
        nodes: [Text.create({ text: defaultValue })]
      }),
    default: defaultValue,
    resolve: ({ children, editor }) =>
      children.filter(r => r.props.node.type === nodeType),
    test: fragment => {
      return (
        fragment.nodes.toJS().filter(node => node.type === nodeType).length > 0
      );
    }
  };
};

const Style = (style, category, name) => {
  return {
    type: "style",
    style: style,
    category: category,
    name: name,
    /*create: () =>
      Block.create({
        type: nodeType,
        data: defaultData,
        nodes: [Text.create({ text: defaultValue })]
      }),
    default: defaultValue,
    */
    resolve: ({ data, children, editor }) => {
      if (data && data.get("styles") && data.get("styles")[style]) {
        const matchingStyle = getStyleByName(data.get("styles")[style]);

        return (
          matchingStyle &&
          matchingStyle.style &&
          matchingStyle.style(editor.ctx)
        );
      }
      return null;
    }
  };
};

const ToolbarButton = opts => {
  return {
    ...opts,
    type: "button",
    onClick: ({ editor, node, key }) => {
      editor.setNodeByKey(node.key, {
        ...node.toJS(),
        data: { ...node.data.toJS(), [key]: opts.value }
      });
    }
  };
};

export const EditorTypes = {
  oneOf: values => ({
    type: "oneOf",
    values: values,
    resolve: ({ key, node }) => {
      if (!node) return null;
      if (node.data) return node.data.get(key);
      return null;
    }
  }),
  Style: (type, cat, name) => Style(type, cat, name),
  button: (value, icon) => ToolbarButton({ value, icon }),
  Heading: opts => NodeType(opts, "heading", "This is a heading"),
  Paragraph: opts => NodeType(opts, "paragraph", opts.default || "Test"),
  Image: opts =>
    NodeType(opts, "image", "", {
      src: "https://picsum.photos/id/663/800/800"
    }),
  Frame: opts => NodeType(opts, "iframe")
};
export default EditorTypes;
