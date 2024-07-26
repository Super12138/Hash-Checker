import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import packageJson from './package.json';
import { exec } from 'child_process';
import { promisify } from 'util';

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
        console.error(`Error executing command: ${error}`);
        throw error;
    }
}

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode, isSsrBuild, isPreview }) => {
    const { versionCode, commitHash } = await getVersionInfo();
    const baseConfig = {
        plugins: [
            VitePWA({
                strategies: 'injectManifest',
                srcDir: 'src/service-worker',
                filename: 'sw.ts',
                registerType: 'autoUpdate',
                injectRegister: false,

                pwaAssets: {
                    disabled: false,
                    config: true,
                },

                manifest: {
                    name: 'Hash Checker',
                    short_name: 'Hash Checker',
                    start_url: '/Hash-Checker/',
                    description: '检查文件是否被修改',
                    lang: "zh",
                    theme_color: '#ffffff',
                    orientation: "any",
                    dir: "ltr",
                    categories: [
                        "security"
                    ],
                    shortcuts: [
                        {
                            "name": "Hash Checker",
                            "url": "index.html",
                            "description": "Hash Checker"
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
            server: {
                open: true,
                hmr: {
                    protocol: "ws",
                }
            },
            define: {
                APP_VERSION: JSON.stringify(`${packageJson.version}-dev-${commitHash} (${versionCode})`)
            },
        }
    } else {
        if (mode == "web") {
            return {
                ...baseConfig,
                base: '/Hash-Checker/',
                define: {
                    APP_VERSION: JSON.stringify(`${packageJson.version}-web-${commitHash} (${versionCode})`)
                },
            }
        } else {
            return {
                ...baseConfig,
                base: '/',
                define: {
                    APP_VERSION: JSON.stringify(`${packageJson.version}-desktop-${commitHash} (${versionCode})`)
                },
            }
        }
    }
})