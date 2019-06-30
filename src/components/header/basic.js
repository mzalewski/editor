import React from "react";
import styled from "styled-components";
import {
  EditorPanel,
  EditorField,
  Editable,
  EditableBackground
} from "../../editor/editorpanels";
const backgroundLayersToStyle = layers => {
  return layers
    .map(layer => {
      if (layer.color) return layer.color;
      if (layer.image) return `url("${layer.image}")`;
      if (layer.to) return `linear-gradient(${layer.from}, ${layer.to})`;
      return "";
    })
    .join(",");
};
const Header = styled("header")`
  color: white;
  background: ${({ background }) => backgroundLayersToStyle(background)};
`;
const Container = styled.div`
  width: ${({ width }) => width}px;
  margin: 0px auto;
  padding: 12rem 2rem;
`;
const Lead = styled("p")`
  letter-spacing: -0.02em;
  line-height: 1.4;
  font-size: 1.4rem;
  color: inherit;
  margin-bottom: 2rem;
`;
const H1 = styled("h1")`
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  word-wrap: break-word;
  font-size: 4rem;
  color: inherit;
  margin-bottom: 1rem;
`;
const EditableH1 = Editable(H1);
const EditableLead = Editable(Lead);

const EditableHeader = EditableBackground(Header);
export default ({ editable, background, headerText, leadText }) => (
  <EditableHeader
    background={background}
    onChange={e => editable.onChange({ background: e })}
  >
    <Container width={800}>
      <EditableH1
        onChange={e => editable.onChange({ headerText: e.target.value })}
        class="display-4"
      >
        {headerText}
      </EditableH1>
      <EditableLead
        onChange={e => editable.onChange({ leadText: e.target.value })}
        class="lead mt-5"
      >
        {leadText}
      </EditableLead>
    </Container>
  </EditableHeader>
);
export const TextField = ({ label, value, onChange }) => {
  return (
    <EditorField label={label}>
      <input
        type="text"
        onChange={e => onChange(e.target.value)}
        value={value}
      />
    </EditorField>
  );
};
const Layer = styled.div`
  margin: 10px 0px;
  background: #181818;
  color: white;
`;
const Button = styled.button`
  background: #333;
  border: 1px solid #111;
  color: white;
  text-align: center;
  margin: 10px auto;
  padding: 5px 10px;
  border-radius: 2px;
  display: block;
`;
export const Editor = ({ data, updateData }) => {
  const updateLayerData = (i, toUpdate) => {
    const newLayers = [...data.background];
    newLayers[i] = { ...newLayers[i], ...toUpdate };
    return updateData({ background: newLayers });
  };
  return (
    <React.Fragment>
      <EditorPanel title="Header">
        <TextField
          label="Headline"
          value={data.headerText}
          onChange={value => updateData({ headerText: value })}
        />
        <TextField
          label="Lead Text"
          value={data.leadText}
          onChange={value => updateData({ leadText: value })}
        />
      </EditorPanel>
      <EditorPanel title="Background">
        {data.background.map((layer, i) => (
          <Layer label="Layer">
            {layer.image && (
              <div>
                <h6>Image</h6>
                <TextField
                  label="Image Url"
                  value={layer.image}
                  onChange={value => updateLayerData(i, { image: value })}
                />
              </div>
            )}
            {layer.from && (
              <div>
                <h6>Gradient</h6>
                <TextField
                  label="From Color"
                  value={layer.from}
                  onChange={value => updateLayerData(i, { from: value })}
                />
                <TextField
                  label="To Color"
                  value={layer.to}
                  onChange={value => updateLayerData(i, { to: value })}
                />
              </div>
            )}
          </Layer>
        ))}
        <Button>+ Add Layer</Button>
      </EditorPanel>
    </React.Fragment>
  );
};
Editor.defaultProps = {
  updateData: () => {},
  data: {}
};
