import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React from "react";

export default (props) => {
  return (
    <NodeViewWrapper className="react-component" as={"span"}>
      <span
        className="border border-t-0 border-x-0 border-b-green-600-200"
        contentEditable={true}
      >
        Pls input something...
      </span>
    </NodeViewWrapper>
  );
};
