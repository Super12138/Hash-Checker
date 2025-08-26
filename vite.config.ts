import vue from "@vitejs/plugin-vue";
import { defineConfig, UserConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";
import vueDevTools from "vite-plugin-vue-devtools";

import { exec } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import { promisify } from "node:util";

import packageJson from "./package.json";

const execPromise = promisify(exec);

const host = process.env.TAURI_DEV_HOST;

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
export default defineConfig(async ({ command, mode, isSsrBuild, isPreview }) => {
    const { versionCode, commitHash } = await getVersionInfo();

    const baseConfig: UserConfig = {
        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        // 所有以 mdui- 开头的标签名都是 mdui 组件
                        isCustomElement: (tag) => tag.startsWith("mdui-"),
                    },
                },
            }),
            vueDevTools(),
            createHtmlPlugin({
                minify: true,
            }),
            VitePWA({
                strategies: "injectManifest",
                srcDir: "src/pwa",
                filename: "sw.ts",
                registerType: "prompt",
                injectRegister: false,
                disable: mode === "desktop",

                pwaAssets: {
                    disabled: false,
                    config: true,
                },

                manifest: {
                    name: "Super Hash",
                    short_name: "Super Hash",
                    start_url: "/Hash-Checker/",
                    description: "一个快速、随时可用，且遵循 Material Design 3 的跨平台文件校验器",
                    lang: "zh",
                    theme_color: "#ffffff",
                    orientation: "any",
                    dir: "ltr",
                    categories: ["security"],
                    shortcuts: [
                        {
                            name: "Super Hash",
                            url: "index.html",
                            description: "Super Hash",
                        },
                    ],
                },

                injectManifest: {
                    globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
                },

                devOptions: {
                    enabled: false,
                    navigateFallback: "index.html",
                    suppressWarnings: true,
                    type: "module",
                },
            }),
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
    };
    if (command === "serve") {
        return {
            ...baseConfig,
            clearScreen: false,
            server: {
                port: 5173,
                strictPort: true,
                host: host || false,
                hmr: host
                    ? {
                          protocol: "ws",
                          host,
                          port: 1421,
                      }
                    : undefined,
                watch: {
                    // 3. tell Vite to ignore watching `src-tauri`
                    ignored: ["**/src-tauri/**"],
                },
            },
            define: {
                VERSION_NAME: JSON.stringify(packageJson.version),
                VARIANT: JSON.stringify("dev"),
                STORE: JSON.stringify(false),
                COMMIT_HASH: JSON.stringify(commitHash),
                VERSION_CODE: JSON.stringify(versionCode),
            },
        };
    } else {
        switch (mode) {
            case "web":
                return {
                    ...baseConfig,
                    base: "/Hash-Checker/",
                    define: {
                        VERSION_NAME: JSON.stringify(packageJson.version),
                        VARIANT: JSON.stringify("web"),
                        STORE: JSON.stringify(false),
                        COMMIT_HASH: JSON.stringify(commitHash),
                        VERSION_CODE: JSON.stringify(versionCode),
                    },
                };
            case "desktop":
                return {
                    ...baseConfig,
                    base: "/",
                    define: {
                        VERSION_NAME: JSON.stringify(packageJson.version),
                        VARIANT: JSON.stringify("desktop"),
                        STORE: JSON.stringify(false),
                        COMMIT_HASH: JSON.stringify(commitHash),
                        VERSION_CODE: JSON.stringify(versionCode),
                    },
                };
            case "store":
                return {
                    ...baseConfig,
                    base: "/",
                    define: {
                        VERSION_NAME: JSON.stringify(packageJson.version),
                        VARIANT: JSON.stringify("desktop"),
                        STORE: JSON.stringify(true),
                        COMMIT_HASH: JSON.stringify(commitHash),
                        VERSION_CODE: JSON.stringify(versionCode),
                    },
                };
            default:
                return {
                    ...baseConfig,
                    base: "/",
                    define: {
                        VERSION_NAME: JSON.stringify(packageJson.version),
                        VARIANT: JSON.stringify("unknown"),
                        STORE: JSON.stringify(false),
                        COMMIT_HASH: JSON.stringify(commitHash),
                        VERSION_CODE: JSON.stringify(versionCode),
                    },
                };
        }
    }
});
