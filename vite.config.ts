import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { dayjs } from "element-plus";
import tailwindcss from "@tailwindcss/vite";
import compression from "vite-plugin-compression";
// import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_APP_BASE_URL,
    define: {
      __BUILD_TIME__: `'${dayjs().format("YYYY-MM-DD HH:mm:ss")}'`,
    },
    plugins: [
      vue(),
      // vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      tailwindcss(),
      compression({
        ext: ".gz",
        deleteOriginFile: false,
      }),
      // br 压缩
      //   compression({
      //     ext: '.br',
      //     algorithm: 'brotliCompress',
      //     deleteOriginFile: false
      // })
      //  分析页面大小
      // visualizer({
      //   gzipSize: true,
      //   brotliSize: true,
      //   emitFile: false,
      //   filename: "test.html", //分析图生成的文件名
      //   open: true //如果存在本地服务端口，将在打包后自动展示
      // })
    ],
    build: {
      assetsDir: "static",
      rollupOptions: {
        output: {
          entryFileNames: "static/js/[name]-[hash].js",
          chunkFileNames: "static/js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            if (assetInfo?.name?.endsWith(".css")) {
              return "static/css/[name]-[hash].css";
            } else {
              return "static/assets/[name]-[hash].[ext]";
            }
          },
          manualChunks: {
            "element-plus": ["element-plus"],
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: { api: "modern-compiler" },
      },
      //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      hmr: true,
      port: 5179,
      open: true,
      proxy: {
        [env.VITE_APP_API]: {
          target: env.VITE_APP_HOST,
          changeOrigin: true,
          rewrite: (path) => `${path}`.split(env.VITE_APP_API).join(""),
        },
      },
    },
  };
});
