import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ReactComponent from "./components/dropdown";
import { PersistenceManager } from "./utils/persistence";
import { useEffect, useState } from "react";

const TiptapEditor = () => {
  const [initialContent, setInitialContent] = useState<string>("");

  // 组件挂载时加载持久化数据
  useEffect(() => {
    const persistedData = PersistenceManager.loadEditorData();
    const content = PersistenceManager.generateInitialContent(
      persistedData?.dropdowns
    );
    setInitialContent(content);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, ReactComponent],
    content: initialContent, // 使用持久化内容
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 p-5 focus:outline-none border border-gray-300 rounded-md",
      },
    },
    onUpdate: ({ editor }) => {
      const editorJSON = editor.getJSON();
      console.log("📝 编辑器内容更新:", editorJSON);

      // 自动保存到 localStorage
      PersistenceManager.saveEditorData(editorJSON);
    },
  });

  // 插入新的下拉菜单
  const insertDropdown = () => {
    if (editor) {
      editor.commands.insertContent({
        type: "dropdown",
        attrs: {
          options: ["选项1", "选项2", "选项3"],
          selectedValue: "",
          placeholder: "请选择...",
        },
      });
    }
  };

  // 清除所有数据
  const clearAllData = () => {
    if (confirm("确定要清除所有保存的数据吗？此操作不可撤销。")) {
      PersistenceManager.clearStoredData();
      window.location.reload(); // 重新加载页面
    }
  };

  // 导出数据
  const exportData = () => {
    const data = PersistenceManager.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tiptap-data-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 显示当前数据状态
  const showCurrentData = () => {
    if (editor) {
      const editorJSON = editor.getJSON();
      const dropdowns = PersistenceManager.extractDropdownData(editorJSON);
      console.log("🔍 当前下拉菜单数据:", dropdowns);

      alert(
        `当前编辑器中有 ${dropdowns.length} 个下拉菜单\n详细信息请查看控制台`
      );
    }
  };

  return (
    <div>
      {/* 操作按钮栏 */}
      <div
        style={{
          marginBottom: "15px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={insertDropdown}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007cba",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          📝 插入下拉菜单
        </button>

        <button
          onClick={showCurrentData}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔍 查看数据
        </button>

        <button
          onClick={exportData}
          style={{
            padding: "8px 16px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          💾 导出数据
        </button>

        <button
          onClick={clearAllData}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🗑️ 清除数据
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

function App() {
  return (
    <div>
      <h1>Tiptap React 编辑器</h1>
      <hr />
      <TiptapEditor />
    </div>
  );
}

export default App;
