import React from "react";
import OutsideClickHandler from "react-outside-click-handler";
import styled from "styled-components";
import ContentEditable from "react-contenteditable";
import { SketchPicker } from "react-color";
const Tools = styled.div`
  background: #222;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0px);
  display: none;
`;
const Img = styled.img`
  max-width: 50px;
`;
const Flex = styled.div`
  display: flex;
`;
const GetBackgroundLayerEditor = (layer, i, onChange) => {
  if (layer.image) {
    return (
      <Flex>
        <strong>Layer {i + 1}</strong>
        <div>
          <Img src={layer.image} />
        </div>
        <a href="#">Replace Image</a>
      </Flex>
    );
  }
  if (layer.from) {
    return (
      <Flex>
        <strong>Layer {i + 1}</strong>
        <div>
          <ColorPicker
            color={layer.from}
            onChange={v => onChange(i, { from: v })}
          />
        </div>
        <div>
          <ColorPicker
            color={layer.to}
            onChange={v => onChange(i, { to: v })}
          />
        </div>
      </Flex>
    );
  }
  return null;
};
const ColorBox = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid white;
  background: ${({ color }) => color};
`;
const Absolute = styled.div`
  position: absolute;
`;
const ColorPicker = ({ color, onChange }) => {
  const [shouldShow, setShouldShow] = React.useState(false);
  const [colorState, setColorState] = React.useState(null);
  const hide = () => {
    setShouldShow(false);
    if (colorState && colorState.rgb) {
      onChange(
        `rgba(${colorState.rgb.r},${colorState.rgb.g},${colorState.rgb.b},${
          colorState.rgb.a
        })`
      );
    }
  };
  return (
    <div>
      <OutsideClickHandler onOutsideClick={() => hide()}>
        <ColorBox onClick={() => setShouldShow(true)} color={color} />
        {shouldShow && (
          <Absolute>
            <SketchPicker
              color={
                colorState ? `rgba(${colorState.rgb.r},${colorState.rgb.g},${
                  colorState.rgb.b
                },${colorState.rgb.a})` : color
              }
              onChangeComplete={value => setColorState(value)}
            />
          </Absolute>
        )}
      </OutsideClickHandler>
    </div>
  );
};
const TagWithHover = styled.div`
  position: relative;
  &:hover:before {
    content: " ";
    pointer-events: none;
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    border: 2px dotted rgba(255, 255, 255, 0.5);
  }
  ${({ isSelected }) => (isSelected ? `${Tools} { display:block; }` : null)}
`;
export const EditableBackground = Tag => props => {
  const [isSelected, setSelected] = React.useState(false);
  const onChange = (i, state) => {
    const newBackground = [...props.background];
    newBackground[i] = { ...newBackground[i], ...state };

    props.onChange(newBackground);
  };
  return (
    <TagWithHover
      {...props}
      isSelected={isSelected}
      onClick={() => setSelected(true)}
    >
      <Tag {...props} />
      {isSelected && (
        <Tools>
          {props.background.map((layer, i) =>
            GetBackgroundLayerEditor(layer, i, onChange)
          )}
        </Tools>
      )}
    </TagWithHover>
  );
};
export const Editable = tag => props => {
  return (
    <ContentEditable
      tagName={tag}
      onChange={props.onChange}
      html={props.children}
    />
  );
};
const CollapsibleHeader = styled.div`
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: 0px solid black;
  padding: 5px;
  font-weight: bold;
`;
const Field = styled.div`
  padding: 5px;
`;
const Label = styled.label`
  font-size: 12px;
  color: #aaa;
  display: block;
`;
export const EditorPanel = ({ title, children }) => {
  return (
    <div>
      <CollapsibleHeader>{title}</CollapsibleHeader>
      <div>{children}</div>
    </div>
  );
};

export const EditorField = ({ label, children }) => {
  return (
    <Field>
      <Label>{label}</Label>
      {children}
    </Field>
  );
};
