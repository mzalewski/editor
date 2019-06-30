import { Schema, DOMParser } from "prosemirror-model";
let t = 1;
const pDOM = ["p", 0],
  blockquoteDOM = ["blockquote", 0],
  hrDOM = ["hr"],
  preDOM = ["pre", ["code", 0]],
  brDOM = ["br"];

// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
  // :: NodeSpec The top level document node.
  doc: {
    content: "section+"
  },
  blockquote: {
    parseDOM: [{ tag: "blockquote" }],
    content: "inline*",
    toDOM: () => blockquoteDOM
  },
  section: {
    selectable: false,
    draggable: false,
    atom: true,
    parseDOM: [{ tag: "section" }],
    attrs: {
      width: { default: "800px" }
    },
    content: "image heading",
    toDOM: node => ["section", { style: `max-width:${node.attrs.width}` }, 0]
  },

  embed: {
    atom: true,
    attrs: {
      html: { default: "" },
      src: { default: "" }
    },
    content: "",
    toDOM: node => {
      const d = document.createElement("div");
      d.className = "embed";
      d.setAttribute("data-src", node.attrs.src);
      d.innerHTML = node.attrs.html;
      const scripts = Array.from(d.querySelectorAll("script"));
      if (scripts && scripts.length) {
        for (var i = 0; i < scripts.length; i++) {
          const scriptEl = document.createElement("script");
          scriptEl.src = scripts[i].src;

          document.head.appendChild(scriptEl);
        }
      }
      return d;
    }
  },
  iframe: {
    attrs: {
      allowfullscreen: { default: -1 },
      src: { default: "abc" },
      end: { default: -1 }
    },
    content: "",
    parseDOM: [
      {
        tag: "iframe",
        getAttrs(dom) {
          return { src: dom.src };
        }
      }
    ],
    toDOM(node) {
      return [
        "iframe",
        {
          width: "560",
          height: "315",
          src: node.attrs.src,
          allowfullscreen: "true"
        }
      ];
    }
  },
  bullet_list: {
    content: "list_item+",
    parseDOM: [{ tag: "ul" }],
    toDOM() {
      return ["ul", 0];
    }
  },
  list_item: {
    content: "inline*",
    parseDOM: [{ tag: "li" }],
    toDOM() {
      return ["li", 0];
    }
  },
  // :: NodeSpec A plain paragraph textblock. Represented in the DOM
  // as a `<p>` element.
  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{ tag: "p" }],
    toDOM() {
      return pDOM;
    }
  },

  // :: NodeSpec A heading textblock, with a `level` attribute that
  // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
  // `<h6>` elements.
  heading: {
    attrs: { level: { default: 1 } },
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [
      { tag: "h1", attrs: { level: 1 } },
      { tag: "h2", attrs: { level: 2 } },
      { tag: "h3", attrs: { level: 3 } },
      { tag: "h4", attrs: { level: 4 } },
      { tag: "h5", attrs: { level: 5 } },
      { tag: "h6", attrs: { level: 6 } }
    ],
    toDOM(node) {
      return ["h" + node.attrs.level, 0];
    }
  },
  caption: {
    attrs: { level: { default: 1 } },
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [
      { tag: "h1", attrs: { level: 1 } },
      { tag: "h2", attrs: { level: 2 } },
      { tag: "h3", attrs: { level: 3 } },
      { tag: "h4", attrs: { level: 4 } },
      { tag: "h5", attrs: { level: 5 } },
      { tag: "h6", attrs: { level: 6 } }
    ],
    toDOM(node) {
      console.log(node.content);
      const attr = !node.content.size ? { class: "test" } : {};
      return ["h4", attr, 0];
    }
  },
  title: {
    attrs: { level: { default: 1 } },
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [
      { tag: "h1", attrs: { level: 1 } },
      { tag: "h2", attrs: { level: 2 } },
      { tag: "h3", attrs: { level: 3 } },
      { tag: "h4", attrs: { level: 4 } },
      { tag: "h5", attrs: { level: 5 } },
      { tag: "h6", attrs: { level: 6 } }
    ],
    toDOM(node) {
      console.log(node.content);
      const attr = !node.content.size ? { class: "test" } : {};
      return ["h1", attr, 0];
    }
  },

  // :: NodeSpec A code listing. Disallows marks or non-text inline
  // nodes by default. Represented as a `<pre>` element with a
  // `<code>` element inside of it.
  code_block: {
    content: "inline*",
    marks: "codesection",
    group: "block",
    code: false,
    defining: true,
    parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
    toDOM(node) {
      const div = document.createElement("div");

      div.className = "codeblock";
      return div;
      return ["div", ["div", "test"], ["div", "test"]];
    }
  },

  // :: NodeSpec The text node.
  text: {
    group: "inline"
  },

  // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
  // `alt`, and `href` attributes. The latter two default to the empty
  // string.
  image: {
    inline: false,
    attrs: {
      src: { default: "https://placeimg.com/1920/1000/any" },
      alt: { default: null },
      title: { default: null }
    },
    group: "block",
    draggable: true,
    parseDOM: [
      {
        tag: "img[src]",
        getAttrs(dom) {
          return {
            src: dom.getAttribute("src"),
            title: dom.getAttribute("title"),
            alt: dom.getAttribute("alt")
          };
        }
      }
    ],
    toDOM(node) {
      let { src, alt, title } = node.attrs;
      return ["img", { src, alt, title }];
    }
  },

  // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{ tag: "br" }],
    toDOM() {
      return brDOM;
    }
  }
};

const emDOM = ["em", 0],
  strongDOM = ["strong", 0],
  codeDOM = ["code", 0];

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
export const marks = {
  // :: MarkSpec A link. Has `href` and `title` attributes. `title`
  // defaults to the empty string. Rendered and parsed as an `<a>`
  // element.
  link: {
    attrs: {
      href: {},
      title: { default: null }
    },
    inclusive: false,
    parseDOM: [
      {
        tag: "a[href]",
        getAttrs(dom) {
          return {
            href: dom.getAttribute("href"),
            title: dom.getAttribute("title")
          };
        }
      }
    ],
    toDOM(node) {
      let { href, title } = node.attrs;
      return ["a", { href, title }, 0];
    }
  },

  // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
  // Has parse rules that also match `<i>` and `font-style: italic`.
  em: {
    parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
    toDOM() {
      return emDOM;
    }
  },
  codesection: {
    toDOM() {
      return ["div", ["h1", "test"]];
    }
  },
  // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
  // also match `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [
      { tag: "strong" },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      { tag: "b", getAttrs: node => node.style.fontWeight != "normal" && null },
      {
        style: "font-weight",
        getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
      }
    ],
    toDOM() {
      return strongDOM;
    }
  },

  // :: MarkSpec Code font mark. Represented as a `<code>` element.
  code: {
    parseDOM: [{ tag: "code" }],
    toDOM() {
      return codeDOM;
    }
  }
};

// :: Schema
// This schema rougly corresponds to the document schema used by
// [CommonMark](http://commonmark.org/), minus the list elements,
// which are defined in the [`prosemirror-schema-list`](#schema-list)
// module.
//
// To reuse elements from this schema, extend or read from its
// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
export default new Schema({ nodes, marks });

const embedNodes = {
  doc: {
    content: "(blockquote|iframe)"
  },
  blockquote: nodes.blockquote,
  iframe: nodes.iframe,
  text: nodes.text
};
export const EmbedSchema = new Schema({ nodes: embedNodes });
