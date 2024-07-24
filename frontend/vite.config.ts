import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
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
        }
    } else {
        if (mode == "web") {
            return {
                ...baseConfig,
                base: '/Hash-Checker/',
            }
        } else {
            return {
                ...baseConfig,
                base: '/',
            }
        }
    }
})