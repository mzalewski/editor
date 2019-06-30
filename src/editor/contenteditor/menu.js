import {
  wrapItem,
  blockTypeItem,
  Dropdown,
  DropdownSubmenu,
  joinUpItem,
  liftItem,
  selectParentNodeItem,
  undoItem,
  redoItem,
  icons,
  MenuItem
} from "prosemirror-menu";
import { createGlobalStyle } from "styled-components";

import { toggleMark } from "prosemirror-commands";

function cmdItem(cmd, options) {
  let passedOptions = {
    label: options.title,
    run: cmd
  };
  for (let prop in options) passedOptions[prop] = options[prop];
  if ((!options.enable || options.enable === true) && !options.select)
    passedOptions[options.enable ? "enable" : "select"] = state => cmd(state);

  return new MenuItem(passedOptions);
}

function markActive(state, type) {
  let { from, $from, to, empty } = state.selection;
  if (empty) return type.isInSet(state.storedMarks || $from.marks());
  else return state.doc.rangeHasMark(from, to, type);
}

function markItem(markType, options) {
  let passedOptions = {
    active(state) {
      return markActive(state, markType);
    },
    enable: true
  };
  for (let prop in options) passedOptions[prop] = options[prop];
  return cmdItem(toggleMark(markType), passedOptions);
}
export const MenuStyles = createGlobalStyle`
.ProseMirror { outline: none;
  
    padding: 20px;
    border-radius: 2px;
    background: white;
    
  > * { margin: 0px auto; max-width:800px; }
} 


h4.empty-node:before { 
  position:absolute;
  pointer-events:none;
  font-weight:normal;
  content: "Optional subtitle";
  color: #e0e0e0;

}
h1.empty-node:before { 
  position:absolute;
  pointer-events:none;
  font-weight:normal;
  content: "Add your title";
  color: #e0e0e0;

}
h1:after {
    position: absolute;
    top:0px;
    right:100%;
    padding-right:20px;
    font-weight:normal;
    margin-right:20px;
    font-size:12px;
    line-height:44px;
    text-transform:uppercase;
    font-weight:bold;
    pointer-events: none;
    content: "Title";
    color: #888;
}
h4:after {
    
    position: absolute;
    top:0px;
    right:100%;
    padding-right:20px;
    margin-right:20px;
    font-size:12px;
    font-weight:normal;
    line-height:22px;
    pointer-events: none;
    content: "Subtitle";
    text-transform:uppercase;
    font-weight:bold;
    color: #aaa;
}
.ProseMirror h1, .ProseMirror h4 { margin-bottom:1rem; position:relative; }
.ProseMirror { 
    margin: 30px auto;
    width: 100%;
    padding:0px;
    flex: 1 1 100%;
    }
.codeblock { margin:10px 0px; border:1px solid #333; padding:10px; }
.ProseMirror-textblock-dropdown {
  min-width: 3em;
}

.ProseMirror-menu {
  margin: 0 -4px;
  line-height: 1;
}

.ProseMirror-tooltip .ProseMirror-menu {
  width: -webkit-fit-content;
  width: fit-content;
  white-space: pre;
}

.ProseMirror-menuitem {
  margin-right: 3px;
  display: inline-block;
}

.ProseMirror-menuseparator {
  border-right: 1px solid #ddd;
  margin-right: 3px;
}

.ProseMirror-menu-dropdown, .ProseMirror-menu-dropdown-menu {
  font-size: 90%;
  white-space: nowrap;
}

.ProseMirror-menu-dropdown {
  vertical-align: 1px;
  cursor: pointer;
  position: relative;
  padding-right: 15px;
}

.ProseMirror-menu-dropdown-wrap {
  padding: 1px 0 1px 4px;
  display: inline-block;
  position: relative;
}

.ProseMirror-menu-dropdown:after {
  content: "";
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid currentColor;
  opacity: .6;
  position: absolute;
  right: 4px;
  top: calc(50% - 2px);
}

.ProseMirror-menu-dropdown-menu, .ProseMirror-menu-submenu {
  position: absolute;
  background: white;
  color: #666;
  border: 1px solid #aaa;
  padding: 2px;
}

.ProseMirror-menu-dropdown-menu {
  z-index: 15;
  min-width: 6em;
}

.ProseMirror-menu-dropdown-item {
  cursor: pointer;
  padding: 2px 8px 2px 4px;
}

.ProseMirror-menu-dropdown-item:hover {
  background: #f2f2f2;
}

.ProseMirror-menu-submenu-wrap {
  position: relative;
  margin-right: -4px;
}

.ProseMirror-menu-submenu-label:after {
  content: "";
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 4px solid currentColor;
  opacity: .6;
  position: absolute;
  right: 4px;
  top: calc(50% - 4px);
}

.ProseMirror-menu-submenu {
  display: none;
  min-width: 4em;
  left: 100%;
  top: -3px;
}

.ProseMirror-menu-active {
  background: #212936;
  border-radius: 4px;
}

.ProseMirror-menu-active {
  background: #212936;
  border-radius: 4px;
}

.ProseMirror-menu-disabled {
  opacity: .3;
}

.ProseMirror-menu-submenu-wrap:hover .ProseMirror-menu-submenu, .ProseMirror-menu-submenu-wrap-active .ProseMirror-menu-submenu {
  display: block;
}

.tooltip .ProseMirror-menubar-wrapper .ProseMirror-menubar {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  position: relative;
  min-height: 1em;
  color: #c9e0f3;
  padding: 1px 6px;
  top: 0; left: 0; right: 0;
  /* border-bottom: 1px solid silver; */
  background: transparent;
  z-index: 10;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  overflow: visible;
  .ProseMirror-menuitem:hover { color: #c9e0f3; }
  .ProseMirror-menu-active { background:transparent; color: white;}
}

.ProseMirror-icon {
  display: inline-block;
  line-height: .8;
  vertical-align: -2px; /* Compensate for padding */
  padding: 2px 8px;
  cursor: pointer;
}

.ProseMirror-menu-disabled.ProseMirror-icon {
  cursor: default;
}

.ProseMirror-icon svg {
  fill: currentColor;
  height: 1em;
}

.ProseMirror-icon span {
  vertical-align: text-top;
}
`;

const h1Icon = {
  width: 21,
  height: 21,
  path:
    "M3 2v4.747h1.656l.383-2.568.384-.311h3.88V15.82l-.408.38-1.56.12V18h7.174v-1.68l-1.56-.12-.407-.38V3.868h3.879l.36.311.407 2.568h1.656V2z"
};
const h2Icon = {
  width: 21,
  height: 21,
  path:
    "M4 5.5v4.74h1.657l.384-2.569.384-.312h2.733v8.461l-.41.38-1.91.12V18h7.179v-1.68l-1.912-.12-.405-.38V7.359h2.729l.36.312.408 2.57h1.657V5.5z"
};
const menu = schema => [
  [
    blockTypeItem(schema.nodes.title, {
      title: "H1",
      icon: h1Icon
    }),

    blockTypeItem(schema.nodes.title, {
      title: "Toggle strong style",
      icon: h2Icon
    })
  ],
  [
    markItem(schema.marks.strong, {
      title: "Toggle strong style",
      icon: icons.strong
    }),
    markItem(schema.marks.em, { title: "Toggle strong style", icon: icons.em }),
    markItem(schema.marks.link, {
      title: "Toggle strong style",
      icon: icons.link
    })
  ]
];
export default menu;
