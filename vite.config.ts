import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueJsx from "@vitejs/plugin-vue-jsx"
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base:'./',
  plugins: [
    vue(),
    AutoImport({imports: ['vue', 'vue-router']}),
    Components({
      dts: true,
      dirs: ['src/components'], // 按需加载的文件夹

    }),
    vueJsx(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler" // or 'modern'
      }
    }
  },
  resolve: {
    // 设置文件./src路径为 @
    alias: {
      '@': path.resolve('./src'),
      'component': path.resolve('./src/component'),
      "store": path.resolve("./src/store"),
      "assets": path.resolve("./src/assets"),
      "language": path.resolve("./src/language"),
      "utils": path.resolve("./src/utils"),
      "views": path.resolve("./src/views"),
      "routes": path.resolve("./src/routes"),
    },
  },
  server:{
    host:'0.0.0.0',
  }

})
