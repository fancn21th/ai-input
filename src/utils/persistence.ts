// 持久化管理工具
export interface DropdownData {
  type: "dropdown";
  id: string;
  options: string[];
  selectedValue: string;
  placeholder: string;
  timestamp: number;
}

export interface EditorPersistenceData {
  dropdowns: DropdownData[];
  lastUpdated: number;
  version: string;
}

const STORAGE_KEY = "tiptap-editor-data";
const CURRENT_VERSION = "1.0.0";

// 定义编辑器节点类型
interface EditorNode {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: EditorNode[];
}

interface EditorJSON {
  type?: string;
  content?: EditorNode[];
}

export class PersistenceManager {
  // 保存编辑器完整数据
  static saveEditorData(editorJSON: EditorJSON): void {
    try {
      const dropdowns = this.extractDropdownData(editorJSON);
      const persistenceData: EditorPersistenceData = {
        dropdowns,
        lastUpdated: Date.now(),
        version: CURRENT_VERSION,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistenceData));
      console.log("💾 编辑器数据已保存:", persistenceData);
    } catch (error) {
      console.error("保存数据失败:", error);
    }
  }

  // 加载编辑器数据
  static loadEditorData(): EditorPersistenceData | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored) as EditorPersistenceData;
      console.log("📁 已加载编辑器数据:", data);
      return data;
    } catch (error) {
      console.error("加载数据失败:", error);
      return null;
    }
  }

  // 从编辑器 JSON 中提取下拉菜单数据
  static extractDropdownData(editorJSON: EditorJSON): DropdownData[] {
    const dropdowns: DropdownData[] = [];

    const traverse = (node: EditorNode) => {
      if (node.type === "dropdown" && node.attrs) {
        dropdowns.push({
          type: "dropdown",
          id: `dropdown_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          options: (node.attrs.options as string[]) || [],
          selectedValue: (node.attrs.selectedValue as string) || "",
          placeholder: (node.attrs.placeholder as string) || "请选择...",
          timestamp: Date.now(),
        });
      }

      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };

    if (editorJSON && editorJSON.content) {
      editorJSON.content.forEach(traverse);
    }

    return dropdowns;
  }

  // 生成包含下拉菜单的初始内容
  static generateInitialContent(persistedDropdowns?: DropdownData[]): string {
    if (!persistedDropdowns || persistedDropdowns.length === 0) {
      return `
        <h2>Tiptap 下拉菜单演示</h2>
        <p>点击"插入下拉菜单"按钮来添加下拉菜单组件。</p>
        <p>所有的选择和修改都会自动保存。</p>
      `;
    }

    let content = `
      <h2>已恢复的下拉菜单数据</h2>
      <p>检测到 ${persistedDropdowns.length} 个已保存的下拉菜单：</p>
    `;

    persistedDropdowns.forEach((dropdown, index) => {
      content += `
        <div
          data-type="dropdown"
          data-dropdown-state='${JSON.stringify(dropdown)}'
          data-options='${JSON.stringify(dropdown.options)}'
          data-selected="${dropdown.selectedValue}"
          data-placeholder="${dropdown.placeholder}"
        >
          下拉菜单: ${dropdown.selectedValue || "未选择"}
        </div>
        ${index < persistedDropdowns.length - 1 ? "<p></p>" : ""}
      `;
    });

    content += `
      <p>你可以继续添加新的下拉菜单或修改现有的菜单。</p>
    `;

    return content;
  }

  // 清除保存的数据
  static clearStoredData(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log("🗑️ 已清除保存的数据");
  }

  // 导出数据为 JSON
  static exportData(): string {
    const data = this.loadEditorData();
    return JSON.stringify(data, null, 2);
  }

  // 导入数据
  static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as EditorPersistenceData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log("📥 数据导入成功");
      return true;
    } catch (error) {
      console.error("数据导入失败:", error);
      return false;
    }
  }
}
