# Tiptap 源码调试配置指南

## 📖 概述

这个配置允许你在 ai-input 项目中直接调试 Tiptap 的源代码，而不是使用编译后的 npm 包。

## 🛠️ 配置说明

### 1. 目录结构
确保你的目录结构如下：
```
2025-fancn21th-github/
├── tiptap/                  # Tiptap 源码仓库
│   ├── packages/
│   │   ├── core/
│   │   ├── react/
│   │   ├── starter-kit/
│   │   └── extension-*/
│   └── packages-deprecated/
└── ai-input/               # 你的项目
    ├── src/
    └── vite.config.ts      # 已配置别名
```

### 2. Vite 别名配置

在 `vite.config.ts` 中已配置以下别名：

```typescript
resolve: {
  alias: {
    "@tiptap/core": "../tiptap/packages/core/src",
    "@tiptap/react": "../tiptap/packages/react/src",
    "@tiptap/starter-kit": "../tiptap/packages/starter-kit/src",
    // ... 其他扩展
  }
}
```

### 3. 关键配置项

- **`fs.allow: ['..']`** - 允许访问上级目录
- **`build.sourcemap: true`** - 启用源码映射
- **`optimizeDeps.exclude`** - 排除 Tiptap 包，保持源码形式
- **`optimizeDeps.include`** - 包含 ProseMirror 依赖

## 🔍 调试步骤

### 1. 构建 Tiptap 源码
首先需要构建 Tiptap 源码：

```bash
cd ../tiptap
pnpm install
pnpm build
```

### 2. 启动开发服务器
```bash
cd ai-input
npm run dev
```

### 3. 开始调试

现在你可以：

1. **在 Tiptap 源码中设置断点**
   - 打开 `../tiptap/packages/core/src/Editor.ts`
   - 设置断点

2. **修改源码并实时查看效果**
   - 修改任何 Tiptap 源文件
   - 保存后会自动热重载

3. **查看完整调用栈**
   - 在浏览器开发工具中可以看到完整的源码调用栈

## 🎯 常用调试目标

### 核心文件
- `../tiptap/packages/core/src/Editor.ts` - 编辑器主类
- `../tiptap/packages/core/src/CommandManager.ts` - 命令管理
- `../tiptap/packages/core/src/ExtensionManager.ts` - 扩展管理
- `../tiptap/packages/core/src/Node.ts` - Node 基类
- `../tiptap/packages/core/src/Mark.ts` - Mark 基类

### React 集成
- `../tiptap/packages/react/src/useEditor.ts` - React Hook
- `../tiptap/packages/react/src/EditorContent.tsx` - 编辑器组件
- `../tiptap/packages/react/src/NodeViewWrapper.tsx` - NodeView 包装器

### 扩展示例
- `../tiptap/packages/extension-bold/src/bold.ts` - Bold 扩展
- `../tiptap/packages/extension-heading/src/heading.ts` - Heading 扩展

## 🚨 注意事项

### 1. 依赖问题
如果遇到模块找不到的错误，可能需要：

```bash
# 在 tiptap 目录下
cd ../tiptap
pnpm install
pnpm build

# 在 ai-input 目录下
npm install
```

### 2. TypeScript 错误
如果有 TypeScript 类型错误，可以：

1. 重启 TypeScript 服务器
2. 清除 Vite 缓存：`rm -rf node_modules/.vite`

### 3. 热重载问题
如果修改 Tiptap 源码后没有热重载：

1. 重启开发服务器
2. 检查文件路径是否正确

## 🔧 高级调试技巧

### 1. 条件断点
在复杂的调用中使用条件断点：
```javascript
// 在源码中设置条件断点
if (node.type.name === 'dropdown') {
  debugger; // 只在处理 dropdown 节点时停止
}
```

### 2. 控制台日志
在关键位置添加日志：
```javascript
console.log('🔍 Editor state:', this.state);
console.log('📝 Command executed:', command);
```

### 3. React DevTools
结合 React DevTools 查看组件状态和 props。

## 📝 调试示例

假设你想调试下拉菜单的 `updateAttributes` 过程：

1. 在 `../tiptap/packages/react/src/useEditor.ts` 中找到相关代码
2. 设置断点
3. 在下拉菜单中选择选项
4. 查看调用栈和变量值

这样你就能完全理解 Tiptap 的内部工作机制了！

## 🎉 开始调试

配置完成后，你就可以：
- 直接在 Tiptap 源码中设置断点
- 修改源码查看效果
- 理解 Tiptap 的内部实现机制
- 为 Tiptap 贡献代码

Happy Debugging! 🚀
