import React from "react";
import AutoReplace from "slate-auto-replace";
import styled from "styled-components";
import HtmlSerializer from "slate-html-serializer";
import axios from "axios";

export const config = {
  rules: [
    {
      deserialize(el, next) {
        debugger;
        switch (el.tagName.toLowerCase()) {
          case "p": {
            return {
              object: "block",
              type: "paragraph",
              nodes: next(el.childNodes)
            };
          }
          case "iframe": {
            return {
              object: "block",
              type: "iframe",
              data: { src: el.src },
              nodes: next(el.childNodes)
            };
          }
          default:
            return null;
        }
      }
    }
  ]
};
const serializer = new HtmlSerializer(config);
const getHtmlFrom = id => {
  console.log(id);
  return axios("https://noembed.com/embed?url=" + encodeURIComponent(id))
    .then(r => {
      const result = serializer.deserialize(r.data.html);
      return result.document.nodes;
    })
    .catch(ex => {
      debugger;
    });
};
export default function UrlAutoInsert() {
  return AutoReplace({
    trigger: "enter",
    before: /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/i,
    change: async (change, e, matches) => {
      const nodes = await getHtmlFrom(matches.before[1]);
      if (nodes && nodes.size > 0) {
        change.setBlocks(nodes.first());
      }
    }
  });
}
