import { Node } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  NodeViewProps,
} from "@tiptap/react";
import { useState } from "react";

// React 组件 - 下拉菜单
const DropdownComponent = ({ node, updateAttributes }: NodeViewProps) => {
  const { options, selectedValue, placeholder } = node.attrs;
  const [isEditing, setIsEditing] = useState(false);
  const [newOption, setNewOption] = useState("");

  // 处理选择变化
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateAttributes({ selectedValue: e.target.value });
  };

  // 添加新选项
  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      const updatedOptions = [...options, newOption.trim()];
      updateAttributes({
        options: updatedOptions,
        selectedValue: newOption.trim(), // 自动选中新添加的选项
      });
      setNewOption("");
      setIsEditing(false);
    }
  };

  // 删除选项
  const handleDeleteOption = (optionToDelete: string) => {
    const updatedOptions = options.filter(
      (option: string) => option !== optionToDelete
    );
    const newSelectedValue =
      selectedValue === optionToDelete ? "" : selectedValue;
    updateAttributes({
      options: updatedOptions,
      selectedValue: newSelectedValue,
    });
  };

  return (
    <NodeViewWrapper
      className="dropdown-node"
      style={{ display: "inline-block", margin: "4px" }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "8px",
          backgroundColor: "#f9f9f9",
          minWidth: "200px",
        }}
      >
        {/* 主下拉菜单 */}
        <select
          value={selectedValue}
          onChange={handleSelectChange}
          style={{
            width: "100%",
            padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginBottom: "8px",
          }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option: string, index: number) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* 选项管理区域 */}
        <div style={{ fontSize: "12px" }}>
          {/* 当前选项列表 */}
          <div style={{ marginBottom: "8px" }}>
            <strong>选项列表：</strong>
            {options.map((option: string, index: number) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  margin: "2px",
                  padding: "2px 6px",
                  backgroundColor:
                    selectedValue === option ? "#007cba" : "#e0e0e0",
                  color: selectedValue === option ? "white" : "black",
                  borderRadius: "3px",
                  fontSize: "11px",
                }}
              >
                {option}
                <button
                  onClick={() => handleDeleteOption(option)}
                  style={{
                    marginLeft: "4px",
                    border: "none",
                    background: "transparent",
                    color: selectedValue === option ? "white" : "red",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* 添加新选项 */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: "4px 8px",
                border: "1px solid #007cba",
                backgroundColor: "#007cba",
                color: "white",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "11px",
              }}
            >
              + 添加选项
            </button>
          ) : (
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="输入新选项..."
                style={{
                  flex: 1,
                  padding: "2px 4px",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  fontSize: "11px",
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddOption();
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleAddOption}
                style={{
                  padding: "2px 6px",
                  border: "1px solid #007cba",
                  backgroundColor: "#007cba",
                  color: "white",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
              >
                ✓
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewOption("");
                }}
                style={{
                  padding: "2px 6px",
                  border: "1px solid #ccc",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* 显示当前选中值 */}
        {selectedValue && (
          <div
            style={{
              marginTop: "8px",
              padding: "4px",
              backgroundColor: "#e8f4fd",
              borderRadius: "3px",
              fontSize: "11px",
            }}
          >
            <strong>当前选中：</strong> {selectedValue}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

// Tiptap Node 插件
const DropdownExtension = Node.create({
  name: "dropdown",

  // 定义节点属性
  addAttributes() {
    return {
      options: {
        default: ["选项1", "选项2", "选项3"],
        parseHTML: (element) => {
          const optionsAttr = element.getAttribute("data-options");
          return optionsAttr
            ? JSON.parse(optionsAttr)
            : ["选项1", "选项2", "选项3"];
        },
        renderHTML: (attributes) => {
          return {
            "data-options": JSON.stringify(attributes.options),
          };
        },
      },
      selectedValue: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-selected") || "",
        renderHTML: (attributes) => {
          return {
            "data-selected": attributes.selectedValue,
          };
        },
      },
      placeholder: {
        default: "请选择...",
        parseHTML: (element) =>
          element.getAttribute("data-placeholder") || "请选择...",
        renderHTML: (attributes) => {
          return {
            "data-placeholder": attributes.placeholder,
          };
        },
      },
    };
  },

  // HTML 解析 - 支持从 HTML 完整恢复数据
  parseHTML() {
    return [
      {
        tag: 'div[data-type="dropdown"]',
        getAttrs: (element) => {
          // 优先从完整状态数据恢复
          const dropdownState = element.getAttribute("data-dropdown-state");
          if (dropdownState) {
            try {
              const state = JSON.parse(dropdownState);
              return {
                options: state.options || ["选项1", "选项2", "选项3"],
                selectedValue: state.selectedValue || "",
                placeholder: state.placeholder || "请选择...",
              };
            } catch (e) {
              console.warn("Failed to parse dropdown state:", e);
            }
          }

          // 兼容旧格式：从单独的属性恢复
          const optionsAttr = element.getAttribute("data-options");
          const selectedAttr = element.getAttribute("data-selected");
          const placeholderAttr = element.getAttribute("data-placeholder");

          return {
            options: optionsAttr
              ? JSON.parse(optionsAttr)
              : ["选项1", "选项2", "选项3"],
            selectedValue: selectedAttr || "",
            placeholder: placeholderAttr || "请选择...",
          };
        },
      },
    ];
  },

  // HTML 渲染 - 完整保存数据用于持久化
  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      {
        "data-type": "dropdown",
        "data-options": JSON.stringify(node.attrs.options),
        "data-selected": node.attrs.selectedValue,
        "data-placeholder": node.attrs.placeholder,
        "data-dropdown-state": JSON.stringify({
          options: node.attrs.options,
          selectedValue: node.attrs.selectedValue,
          placeholder: node.attrs.placeholder,
          timestamp: Date.now(), // 添加时间戳用于调试
        }),
        ...HTMLAttributes,
      },
      `下拉菜单: ${node.attrs.selectedValue || "未选择"}`,
    ];
  },

  // 使用 React NodeView
  addNodeView() {
    return ReactNodeViewRenderer(DropdownComponent);
  },

  // 标记为原子节点
  atom: true,

  // 设置为内联节点
  inline: true,

  // 设置组
  group: "inline",

  // 可拖拽
  draggable: true,
});

export default DropdownExtension;
