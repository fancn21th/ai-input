# Tiptap 调试配置修复说明

## 🔧 修复的问题

### 问题描述
```
[plugin:vite:import-analysis] Failed to resolve import "@tiptap/pm/state" from "../tiptap/packages/core/src/NodeView.ts"
```

这个错误是因为 `@tiptap/pm` 包的子模块路径映射不完整导致的。

## ✅ 修复内容

### 1. 增加了 @tiptap/pm 子模块的路径映射

在 `vite.config.ts` 中新增：
```typescript
"@tiptap/pm/state": resolve(__dirname, "../tiptap/packages/pm/state"),
"@tiptap/pm/model": resolve(__dirname, "../tiptap/packages/pm/model"),
"@tiptap/pm/view": resolve(__dirname, "../tiptap/packages/pm/view"),
"@tiptap/pm/transform": resolve(__dirname, "../tiptap/packages/pm/transform"),
"@tiptap/pm/commands": resolve(__dirname, "../tiptap/packages/pm/commands"),
"@tiptap/pm/keymap": resolve(__dirname, "../tiptap/packages/pm/keymap"),
"@tiptap/pm/history": resolve(__dirname, "../tiptap/packages/pm/history"),
"@tiptap/pm/inputrules": resolve(__dirname, "../tiptap/packages/pm/inputrules"),
"@tiptap/pm/dropcursor": resolve(__dirname, "../tiptap/packages/pm/dropcursor"),
"@tiptap/pm/gapcursor": resolve(__dirname, "../tiptap/packages/pm/gapcursor"),
```

### 2. 更新了 TypeScript 路径配置

在 `tsconfig.app.json` 中添加：
```json
"@tiptap/pm": ["../tiptap/packages/pm/src"],
"@tiptap/pm/*": ["../tiptap/packages/pm/*"]
```

### 3. 扩展了 optimizeDeps.exclude 配置

排除更多的 @tiptap/pm 子包，确保它们保持源码形式：
```typescript
exclude: [
  "@tiptap/core",
  "@tiptap/react",
  "@tiptap/starter-kit",
  "@tiptap/pm",
  "@tiptap/pm/state",
  "@tiptap/pm/model",
  // ... 其他子包
],
```

## 🎯 为什么需要这样配置？

### Tiptap PM 包结构
Tiptap 的 `@tiptap/pm` 包实际上是对 ProseMirror 各个子包的重新打包：

```
packages/pm/
├── state/       → prosemirror-state
├── model/       → prosemirror-model
├── view/        → prosemirror-view
├── transform/   → prosemirror-transform
├── commands/    → prosemirror-commands
└── ...
```

当 Tiptap 源码中使用 `import { NodeSelection } from "@tiptap/pm/state"` 时，我们需要确保这个路径能正确解析到对应的源文件。

## 🧪 测试修复

现在你可以重新启动开发服务器：

```bash
npm run dev
```

应该不会再看到路径解析错误了。

## 🔍 额外的调试优势

通过这个配置，你现在可以：

1. **调试 ProseMirror 层面的代码** - 直接看到 state、model、view 等的源码实现
2. **理解 Tiptap 如何封装 ProseMirror** - 看到 Tiptap 是如何在 ProseMirror 基础上构建的
3. **完整的调用栈** - 从你的下拉菜单组件一直到 ProseMirror 核心的完整调用链

这为深入理解富文本编辑器的底层原理提供了极好的机会！🚀
