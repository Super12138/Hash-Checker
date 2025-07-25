import { exec } from 'child_process';
import { promisify } from 'util';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import packageJson from './package.json';

const execPromise = promisify(exec);

async function getVersionInfo() {
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
}

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode, isSsrBuild, isPreview }) => {
    const { versionCode, commitHash } = await getVersionInfo();
    const baseConfig = {
        plugins: [
            createHtmlPlugin({
                minify: true,
            }),
            VitePWA({
                strategies: 'injectManifest',
                srcDir: 'src/pwa',
                filename: 'sw.ts',
                registerType: 'prompt',
                injectRegister: false,

                pwaAssets: {
                    disabled: false,
                    config: true,
                },

                manifest: {
                    name: 'Super Hash',
                    short_name: 'Super Hash',
                    start_url: '/Hash-Checker/',
                    description: '一个快速、随时可用，且遵循 Material Design 3 的跨平台文件校验器',
                    lang: "zh",
                    theme_color: '#ffffff',
                    orientation: "any",
                    dir: "ltr",
                    categories: [
                        "security"
                    ],
                    shortcuts: [
                        {
                            "name": "Super Hash",
                            "url": "index.html",
                            "description": "Super Hash"
                        }
                    ],
                },

                injectManifest: {
                    globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
                },

                devOptions: {
                    enabled: false,
                    navigateFallback: 'index.html',
                    suppressWarnings: true,
                    type: 'module',
                },
            })
        ],
    }

    if (command === 'serve') {
        return {
            ...baseConfig,
            base: '/',
            // Tauri相关配置
            // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
            //
            // 1. prevent vite from obscuring rust errors
            clearScreen: false,
            // 2. tauri expects a fixed port, fail if that port is not available
            server: {
                port: 5173,
                strictPort: true,
                host: host || false,
                hmr: host
                    ? {
                        protocol: "ws",
                        host,
                        port: 5174,
                    }
                    : undefined,
                watch: {
                    // 3. tell vite to ignore watching `src-tauri`
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
        }
    } else {
        switch (mode) {
            case 'web':
                return {
                    ...baseConfig,
                    base: '/Hash-Checker/',
                    define: {
                        VERSION_NAME: JSON.stringify(packageJson.version),
                        VARIANT: JSON.stringify("web"),
                        STORE: JSON.stringify(false),
                        COMMIT_HASH: JSON.stringify(commitHash),
                        VERSION_CODE: JSON.stringify(versionCode),
                    },
                }
            case 'desktop':
                return {
                    ...baseConfig,
                    base: '/',
                    define: {
                        VERSION_NAME: JSON.stringify(packageJson.version),
                        VARIANT: JSON.stringify("desktop"),
                        STORE: JSON.stringify(false),
                        COMMIT_HASH: JSON.stringify(commitHash),
                        VERSION_CODE: JSON.stringify(versionCode),
                    },
                }
            case 'store':
                return {
                    ...baseConfig,
                    base: '/',
                    define: {
                        VERSION_NAME: JSON.stringify(packageJson.version),
                        VARIANT: JSON.stringify("desktop"),
                        STORE: JSON.stringify(true),
                        COMMIT_HASH: JSON.stringify(commitHash),
                        VERSION_CODE: JSON.stringify(versionCode),
                    },
                }
            default:
                return {
                    ...baseConfig,
                    base: '/',
                    define: {
                        VERSION_NAME: JSON.stringify(packageJson.version),
                        VARIANT: JSON.stringify("unknown"),
                        STORE: JSON.stringify(false),
                        COMMIT_HASH: JSON.stringify(commitHash),
                        VERSION_CODE: JSON.stringify(versionCode),
                    },
                }
        }
    }
});