import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true, // 👈 Bắt buộc nếu dùng Docker trên Windows/macOS
      interval: 100, // 👈 Khoảng thời gian polling
    },
  },
});
