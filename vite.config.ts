import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { dayjs } from "element-plus";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  process.env.VITE_APP_BUILD_TIME = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return {
    base: env.VITE_APP_BASE_URL,
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
    ],
    css: {
      preprocessorOptions: {
        scss: { api: "modern-compiler" },
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
