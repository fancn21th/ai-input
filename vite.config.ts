import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // 开发服务器配置
  server: {
    port: 5175,
    open: true,
  },

  // 构建配置
  build: {
    sourcemap: true, // 启用源码映射，便于调试
  },
});
