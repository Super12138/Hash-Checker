import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import vueDevTools from "vite-plugin-vue-devtools";

const execPromise = promisify(exec);

/**
 * 获取版本信息
 *
 * * 版本号：Git 提交计数
 * * 提交哈希：Git 短哈希
 *
 * @returns { versionCode: string, commitHash: string }
 */
const getVersionInfo = async () => {
    try {
        const { stdout: versionCode } = await execPromise("git rev-list --count HEAD");
        const { stdout: commitHash } = await execPromise("git rev-parse --short HEAD");
        return {
            versionCode: versionCode.trim(),
            commitHash: commitHash.trim(),
        };
    } catch (error) {
        console.error(`执行命令时发生错误: ${error}`);
        throw error;
    }
};

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // 所有以 mdui- 开头的标签名都是 mdui 组件
                    isCustomElement: (tag) => tag.startsWith('mdui-')
                }
            }
        }),
        vueDevTools(),
        createHtmlPlugin({
            minify: true,
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        open: true
    }
});
