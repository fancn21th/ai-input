import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import Component from "./ReactComponent.jsx";

export default Node.create({
  name: "reactComponent",

  group: "inline",

  inline: true, // 行内元素

  atom: true, // 表示该节点是原子节点，不能拆分

  addAttributes() {
    return {
      placeholder: {
        default: "请输入内容...", // 占位符文本
      },
      text: {
        default: "", // 文本内容
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "react-component",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["react-component", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
