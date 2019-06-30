import { Plugin } from "prosemirror-state";
import { createGlobalStyle } from "styled-components";

import { renderGrouped } from "prosemirror-menu";
import crel from "crel";

const prefix = "ProseMirror-menubar";
export const TooltipStyles = createGlobalStyle`
.tooltip {
    position: absolute;
    /* pointer-events: none; */
    z-index: 20;
    background: #49a1e9;
    border:1px solid transparent;
    border-radius: 3px;
    padding: 2px 10px;
    margin-bottom: 7px;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }
  .tooltip:before {
    content: "";
    height: 0; width: 0;
    position: absolute;
    left: 50%;
    margin-left: -5px;
    bottom: -6px;
    border: 5px solid transparent;
    border-bottom-width: 0;
    border-top-color: #49a1e9;
  }
  .tooltip:after {
    content: "";
    height: 0; width: 0;
    position: absolute;
    left: 50%;
    margin-left: -5px;
    bottom: -4.5px;
    border: 5px solid transparent;
    border-bottom-width: 0;
    border-top-color: #49a1e9;
  }
  #editor { position: relative; }
`;
function isIOS() {
  if (typeof navigator == "undefined") return false;
  let agent = navigator.userAgent;
  return (
    !/Edge\/\d/.test(agent) &&
    /AppleWebKit/.test(agent) &&
    /Mobile\/\w+/.test(agent)
  );
}

class MenuBarView {
  constructor(editorView, options) {
    this.editorView = editorView;
    this.options = options;

    this.wrapper = crel("div", { class: prefix + "-wrapper" });
    this.menu = this.wrapper.appendChild(crel("div", { class: prefix }));
    this.menu.className = prefix;
    this.spacer = null;

    // editorView.dom.parentNode.replaceChild(this.wrapper, editorView.dom)
    // this.wrapper.appendChild(editorView.dom)

    this.maxHeight = 0;
    this.widthForMaxHeight = 0;
    this.floating = false;

    let { dom, update } = renderGrouped(this.editorView, this.options.content);
    this.contentUpdate = update;
    this.menu.appendChild(dom);
    this.update();
  }

  update() {
    this.contentUpdate(this.editorView.state);

    if (this.floating) {
      this.updateScrollCursor();
    } else {
      if (this.menu.offsetWidth != this.widthForMaxHeight) {
        this.widthForMaxHeight = this.menu.offsetWidth;
        this.maxHeight = 0;
      }
      if (this.menu.offsetHeight > this.maxHeight) {
        this.maxHeight = this.menu.offsetHeight;
        this.menu.style.minHeight = this.maxHeight + "px";
      }
    }
  }

  updateScrollCursor() {
    let selection = this.editorView.root.getSelection();
    if (!selection.focusNode) return;
    let rects = selection.getRangeAt(0).getClientRects();
    let selRect = rects[selectionIsInverted(selection) ? 0 : rects.length - 1];
    if (!selRect) return;
    let menuRect = this.menu.getBoundingClientRect();
    if (selRect.top < menuRect.bottom && selRect.bottom > menuRect.top) {
      let scrollable = findWrappingScrollable(this.wrapper);
      if (scrollable) scrollable.scrollTop -= menuRect.bottom - selRect.top;
    }
  }

  updateFloat() {
    let parent = this.wrapper,
      editorRect = parent.getBoundingClientRect();
    if (this.floating) {
      if (
        editorRect.top >= 0 ||
        editorRect.bottom < this.menu.offsetHeight + 10
      ) {
        this.floating = false;
        this.menu.style.position = this.menu.style.left = this.menu.style.width =
          "";
        this.menu.style.display = "";
        this.spacer.parentNode.removeChild(this.spacer);
        this.spacer = null;
      } else {
        let border = (parent.offsetWidth - parent.clientWidth) / 2;
        this.menu.style.left = editorRect.left + border + "px";
        this.menu.style.display =
          editorRect.top > window.innerHeight ? "none" : "";
      }
    } else {
      if (
        editorRect.top < 0 &&
        editorRect.bottom >= this.menu.offsetHeight + 10
      ) {
        this.floating = true;
        let menuRect = this.menu.getBoundingClientRect();
        this.menu.style.left = menuRect.left + "px";
        this.menu.style.width = menuRect.width + "px";
        this.menu.style.position = "fixed";
        this.spacer = crel("div", {
          class: prefix + "-spacer",
          style: `height: ${menuRect.height}px`
        });
        parent.insertBefore(this.spacer, this.menu);
      }
    }
  }

  destroy() {
    if (this.wrapper.parentNode)
      this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper);
  }
}

// Not precise, but close enough
function selectionIsInverted(selection) {
  if (selection.anchorNode == selection.focusNode)
    return selection.anchorOffset > selection.focusOffset;
  return (
    selection.anchorNode.compareDocumentPosition(selection.focusNode) ==
    Node.DOCUMENT_POSITION_FOLLOWING
  );
}

function findWrappingScrollable(node) {
  for (let cur = node.parentNode; cur; cur = cur.parentNode)
    if (cur.scrollHeight > cur.clientHeight) return cur;
}

//----------

let selectionSizePlugin = option =>
  new Plugin({
    view(editorView) {
      return new SelectionSizeTooltip(editorView, option);
    }
  });

class SelectionSizeTooltip {
  constructor(view, option) {
    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip";
    view.dom.parentNode.appendChild(this.tooltip);

    this.menu = new MenuBarView(view, option);

    this.update(view, null);
  }

  update(view, lastState) {
    let state = view.state;
    this.menu.update();
    // Don't do anything if the document/selection didn't change
    if (
      lastState &&
      lastState.doc.eq(state.doc) &&
      lastState.selection.eq(state.selection)
    )
      return;

    // Hide the tooltip if the selection is empty
    if (state.selection.empty) {
      this.tooltip.style.display = "none";
      return;
    }

    // Otherwise, reposition it and update its content
    this.tooltip.style.display = "";
    let { from, to } = state.selection;
    // These are in screen coordinates
    let start = view.coordsAtPos(from),
      end = view.coordsAtPos(to);
    // The box in which the tooltip is positioned, to use as base
    let box = this.tooltip.offsetParent.getBoundingClientRect();
    // Find a center-ish x position from the selection endpoints (when
    // crossing lines, end may be more to the left)
    let left = Math.max((start.left + end.left) / 2, start.left + 3);
    this.tooltip.style.left = left - box.left + "px";
    this.tooltip.style.bottom = box.bottom - start.top + "px";
    // this.tooltip.textContent = to - from

    this.tooltip.appendChild(this.menu.wrapper);
  }

  destroy() {
    this.tooltip.remove();
  }
}

export default selectionSizePlugin;
