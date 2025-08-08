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

  // 导出完整编辑器数据为 JSON 文件
  const exportData = () => {
    if (editor) {
      const editorJSON = editor.getJSON(); // 获取完整编辑器 JSON
      const exportData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        content: editorJSON,
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tiptap-editor-${new Date().getTime()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      console.log("📤 导出的编辑器数据:", exportData);
      alert("编辑器内容已导出为 JSON 文件！");
    }
  };

  // 从 JSON 文件导入并恢复编辑器内容
  const importFromFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonString = e.target?.result as string;
            const importData = JSON.parse(jsonString);

            console.log("� 导入的数据:", importData);

            // 验证数据格式
            if (importData.content && typeof importData.content === "object") {
              if (editor) {
                // 清空当前内容
                editor.commands.clearContent();

                // 恢复导入的内容
                editor.commands.setContent(importData.content);

                console.log("✅ 内容已从文件恢复到编辑器");
                alert(
                  `内容已从文件恢复！\n导出时间: ${
                    importData.timestamp || "未知"
                  }`
                );
              }
            } else {
              throw new Error("无效的文件格式");
            }
          } catch (error) {
            console.error("❌ 导入失败:", error);
            alert("导入失败：文件格式不正确或已损坏");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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

  // 测试导出导入流程
  const testExportImport = () => {
    if (editor) {
      const currentJSON = editor.getJSON();
      console.log("🧪 当前编辑器内容:", currentJSON);

      // 模拟导出导入流程
      const exportData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        content: currentJSON,
      };

      // 清空编辑器
      editor.commands.clearContent();

      // 立即恢复
      setTimeout(() => {
        editor.commands.setContent(exportData.content);
        console.log("✅ 测试完成：内容已恢复");
        alert("测试完成！编辑器内容已清空后恢复");
      }, 500);
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
          onClick={testExportImport}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6f42c1",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🧪 测试导入导出
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
          onClick={importFromFile}
          style={{
            padding: "8px 16px",
            backgroundColor: "#fd7e14",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          � 从文件导入
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
