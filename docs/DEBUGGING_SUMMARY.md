# Tiptap 源码调试配置总结

## 问题背景

在尝试配置本地 Tiptap 源码调试时，遇到了复杂的路径解析问题。主要问题包括：

1. **@tiptap/pm 模块解析失败**：Tiptap 源码内部大量使用 `@tiptap/pm/*` 导入，但这些是虚拟包，实际指向 ProseMirror 包
2. **循环依赖**：复杂的路径映射导致 Vite 解析循环依赖
3. **扩展包缺失**：源码中的扩展包在开发环境中不完整

## 解决方案

### 最终配置（vite.config.ts）

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5175,
    open: true,
  },

  build: {
    sourcemap: true, // 启用源码映射，便于调试
  },
});
```

### 关键决策

1. **完全移除路径映射**：不再尝试映射 `@tiptap` 包到源码
2. **使用 node_modules**：让应用使用已发布的稳定版本
3. **保留源码映射**：通过 `sourcemap: true` 仍然可以看到编译后的代码映射

## 为什么复杂映射失败

### 1. ProseMirror 依赖问题
Tiptap 源码内部使用：
```typescript
import { EditorState } from "@tiptap/pm/state";
import { Node } from "@tiptap/pm/model";
```

但 `@tiptap/pm` 是虚拟包，实际映射到：
- `prosemirror-state`
- `prosemirror-model`
- 等等...

### 2. 扩展包依赖
Starter Kit 依赖大量扩展包：
```typescript
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
// ... 20+ 扩展包
```

每个都需要正确配置路径映射，极其复杂。

### 3. 开发环境不完整
Tiptap 源码仓库是 monorepo，需要完整的构建流程才能正常工作。

## 替代调试方案

### 1. 使用已发布版本 + Source Maps
- ✅ 简单可靠
- ✅ 避免复杂配置
- ✅ 保留调试能力
- ❌ 无法修改源码实时调试

### 2. 本地构建后链接
```bash
# 在 tiptap 仓库中
cd /path/to/tiptap
npm run build
npm link

# 在项目中
npm link @tiptap/core @tiptap/react @tiptap/starter-kit
```

### 3. Fork 仓库开发
- Fork Tiptap 仓库
- 在 fork 中开发和测试
- 提交 PR 到主仓库

## 经验教训

1. **现代框架的复杂性**：即使是配置调试环境也可能非常复杂
2. **依赖管理**：monorepo 的依赖关系比预期复杂
3. **工具选择**：有时简单的方案更可靠
4. **调试策略**：不一定需要源码级别的调试

## 当前状态

- ✅ 应用正常运行
- ✅ Dropdown 组件功能完整
- ✅ 持久化系统工作正常
- ✅ TypeScript 类型检查通过
- ❌ 无法直接调试 Tiptap 源码（但可通过 Source Maps 定位问题）

## 推荐

对于大多数开发场景，建议：
1. 使用已发布的 npm 包
2. 启用 source maps
3. 通过控制台和断点调试
4. 只在需要修改源码时才配置复杂的开发环境
