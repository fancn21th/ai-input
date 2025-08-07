# Tiptap 源码调试配置完成！

## ✅ 已完成的配置

### 1. Vite 配置 (`vite.config.ts`)
- ✅ 设置了 `resolve.alias` 指向本地 Tiptap 源码
- ✅ 启用了源码映射 (`sourcemap: true`)
- ✅ 排除了 Tiptap 包避免预优化
- ✅ 允许访问上级目录文件

### 2. TypeScript 配置 (`tsconfig.app.json`)
- ✅ 添加了 `baseUrl` 和 `paths` 路径映射
- ✅ 支持完整的类型检查和智能提示

### 3. 路径映射
```typescript
// Vite 和 TypeScript 都已配置以下映射：
"@tiptap/core" → "../tiptap/packages/core/src"
"@tiptap/react" → "../tiptap/packages/react/src"
"@tiptap/starter-kit" → "../tiptap/packages/starter-kit/src"
"@tiptap/extension-*" → "../tiptap/packages/extension-*/src"
```

## 🚀 现在你可以：

### 1. 在浏览器中调试
- 打开开发者工具，Sources 面板可以看到 Tiptap 源码
- 在任何 Tiptap 源文件中设置断点
- 实时调试你的下拉菜单组件与 Tiptap 的交互

### 2. 在 VS Code 中开发
- 从 `@tiptap/core` 导入时，会直接跳转到源码
- 完整的 TypeScript 类型支持
- 修改 Tiptap 源码会立即热重载

### 3. 深入理解 Tiptap
- 跟踪 `updateAttributes` 如何更新编辑器状态
- 观察 `onUpdate` 事件的触发机制
- 研究扩展系统的注册和执行过程

## 🔍 调试你的下拉菜单

现在你可以：
1. 在 `dropdown.tsx` 的 `updateAttributes` 调用处设置断点
2. 跟踪到 `@tiptap/core` 的状态管理
3. 观察 ProseMirror 事务的处理过程
4. 理解节点视图的渲染机制

开始你的 Tiptap 源码探索之旅吧！🎯
