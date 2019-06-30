import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import menu from "./menu";
import { keymap } from "prosemirror-keymap";
import schema, { EmbedSchema } from "./schema";
import { baseKeymap } from "prosemirror-commands";
import { Schema, DOMParser, Node } from "prosemirror-model";
import { buildInputRules } from "./inputrules";
import tooltip from "./tooltip";
import "prosemirror-view/style/prosemirror.css";
import axios from "axios";
import { buildKeymap } from "prosemirror-example-setup";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import { LinkMark } from "prosemirror-model";
import { extract } from "oembed-parser";
import SectionView from "./views/sectionview";
let urlex = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;
function linkRule(markType) {
  const urlRegEx = urlex; // ... //Work in progress
  return new InputRule(urlRegEx, (state, match, start, end) => {
    const link = markType.create({ href: match[0] });
    const displayUrl = "TEST"; //Part of the url to display to the user
    const tr = state.tr
      .insertText(displayUrl, start, start + displayUrl.length)
      .delete(start + displayUrl.length - 1, end - 1)
      .insertText(" ", start + displayUrl.length);

    return tr.addMark(start, start + displayUrl.length, link);
  });
}
const PlaceholderPlugin = new Plugin({
  props: {
    decorations: state => {
      const decorations = [];

      const decorate = (node, pos) => {
        if (node.type.isBlock && node.childCount === 0) {
          decorations.push(
            Decoration.node(pos, pos + node.nodeSize, {
              class: "empty-node"
            })
          );
        }
      };

      state.doc.descendants(decorate);

      return DecorationSet.create(state.doc, decorations);
    }
  }
});

export class MarkdownView {
  constructor(target, content) {
    this.textarea = target.appendChild(document.createElement("textarea"));
    this.textarea.value = content;
  }

  get content() {
    return this.textarea.value;
  }
  focus() {
    this.textarea.focus();
  }
  destroy() {
    this.textarea.remove();
  }
}
let transactionCounter = keymap({
  Enter: function(state, dispatch, ed) {
    const prevNode = state.doc.nodeAt(state.tr.selection.$anchor.pos - 1);
    if (prevNode && prevNode.text) {
      const matches = prevNode.text.match(
        /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/
      );
      if (matches && matches.length > 0) {
        const id = matches[1];
        const resolvedPos = state.doc.resolve(
          state.tr.selection.$anchor.pos - 1
        );
        if (
          id.indexOf("unsplash") >= 0 ||
          id.indexOf("jpg") >= 0 ||
          id.indexOf("png") >= 0
        ) {
          const deserialized = schema.nodes.image.create({
            src: id
          });
          const insertTransaction = ed.state.tr.replaceRangeWith(
            resolvedPos.start(),
            resolvedPos.end(),
            deserialized
          );

          ed.dispatch(insertTransaction);
          return;
        }
        axios("https://noembed.com/embed?url=" + encodeURIComponent(id))
          .then(r => {
            const deserialized = schema.nodes.embed.create({
              src: id,
              html: r.data.html
            });

            const insertTransaction = ed.state.tr.replaceRangeWith(
              resolvedPos.start(),
              resolvedPos.end(),
              deserialized
            );

            ed.dispatch(insertTransaction);
          })
          .catch(ex => {
            debugger;
          });
      }
    }
  }
});

export class ProseMirrorView {
  constructor(target, content) {
    this.view = new EditorView(target, {
      state: EditorState.create({
        doc: DOMParser.fromSchema(schema).parse(content),
        schema: schema,
        plugins: [
          transactionCounter,
          PlaceholderPlugin,
          keymap(buildKeymap(schema)),
          keymap(baseKeymap),
          tooltip({
            content: menu(schema)
          }),

          buildInputRules(schema)
        ]
      }),
      nodeViews: {
        section(node, view, getPos) {
          return new SectionView(node, view, getPos);
        }
      }
    });
  }

  get content() {
    return defaultMarkdownSerializer.serialize(this.view.state.doc);
  }
  focus() {
    this.view.focus();
  }
  destroy() {
    this.view.destroy();
  }
}
window.DOMParser = DOMParser;
window.Schema = EmbedSchema;
