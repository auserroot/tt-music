import { fileURLToPath, URL } from 'node:url'

import { defineConfig ,loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { resolve } from 'path' // 主要用于alias文件路径别名
const pathResolve = (dir:any) => resolve(__dirname, '.', dir)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '/@': resolve(__dirname, '.', 'src')
    }
  },
  server:{
    host:'0.0.0.0',
    port:8010,
    proxy:{
      '/api':{
        target:'http://localhost:3000',
        changeOrigin:true,
        rewrite:path=>path.replace(/^\/api/,'')
      }
    }
  },
  base: './',
  // 打包配置
  build: {
    sourcemap: false,
    outDir: 'dist', // 指定输出路径，要和库的包区分开
    assetsDir: 'static/img/', // 指定生成静态资源的存放路径
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      },
      // brotliSize: false, // 不统计
      // target: 'esnext', 
      // minify: 'esbuild' // 混淆器，terser构建后文件体积更小
    }
  }
})