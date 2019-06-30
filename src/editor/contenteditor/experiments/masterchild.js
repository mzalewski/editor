const { EditorState } = require("prosemirror-state");
const { EditorView } = require("prosemirror-view");
const { Schema, DOMParser } = require("prosemirror-model");
const { schema } = require("prosemirror-schema-basic");
const { addListNodes } = require("prosemirror-schema-list");
const { exampleSetup } = require("prosemirror-example-setup");

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
});
console.log("lets go1");
const transactionList = [];
const dispatch2 = tr => {
  const newState2 = window.view2.state.apply(tr.transaction);
  transactionList.push(tr.transaction);
  window.view2.updateState(newState2);
};
const applyMaps = (step, maps) => {
  if (step == null) return step;
  return maps
    .filter(map => map)
    .reduce((step, map) => (step != null ? step.map(map) : null), step);
};
const dispatch = tr => {
  console.log(tr);

  // Expand steps to include word boundaries:
  const alteredSteps = tr.transaction.steps.map(r => {
    const $start = window.view.state.doc.resolve(r.from);
    const nonAlpha = /[^A-Za-z0-9]/gi;
    if (
      $start.parent.textContent
        .substr($start.parentOffset - 1, 1)
        .match(nonAlpha)
    ) {
      r.from = r.from - 1;
    }
    const $end = window.view.state.doc.resolve(r.to);
    if ($end.parent.textContent.substr($end.parentOffset, 1).match(nonAlpha)) {
      r.to = r.to + 1;
    }
    return r;
  });
  const newTr1 = window.view.state.tr;

  const newState = window.view.state.apply(tr.transaction);
  const updateResult = window.view.updateState(newState);
  var maps = transactionList
    .reduce((arr, r) => [...arr, ...r.steps], [])
    .map(r => r.getMap());
  var mappedSteps = alteredSteps.map(t => applyMaps(t, maps));

  const newTr = window.view2.state.tr;
  mappedSteps
    .filter(step => step)
    .forEach(step => {
      newTr.maybeStep(step);
    });
  if (newTr.steps.length) {
    const newState2 = window.view2.state.apply(newTr);
    window.view2.updateState(newState2);
  }
};
window.view = new EditorView(document.querySelector("#editor"), {
  dispatchTransaction: transaction =>
    dispatch({ type: "transaction", transaction }),
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(
      document.querySelector("#content")
    ),
    plugins: exampleSetup({ schema: mySchema })
  })
});
window.view2 = new EditorView(document.querySelector("#editor2"), {
  dispatchTransaction: transaction =>
    dispatch2({ type: "transaction", transaction }),
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(
      document.querySelector("#content")
    ),
    plugins: exampleSetup({ schema: mySchema })
  })
});
