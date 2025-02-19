import { NodeViewWrapper } from "@tiptap/react";
import React, { useState } from "react";

export default (props) => {
  const [value, setValue] = useState(props.node.attrs.text || "");

  return (
    <NodeViewWrapper className="react-component" as={"span"}>
      <span
        contentEditable
        suppressContentEditableWarning
        className="border border-b-amber-500 border-t-0 border-x-0"
        onInput={(e) => {
          const text = e.currentTarget.textContent;
          setValue(text);
          props.updateAttributes({ text });
        }}
      >
        {value || props.node.attrs.placeholder}
      </span>
    </NodeViewWrapper>
  );
};
