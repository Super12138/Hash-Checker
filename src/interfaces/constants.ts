import type { Language } from "./Language";
import type { OpenSourceLibrary } from "./OpenSourceLibrary";

export const UPDATE_URL = "https://api.github.com/repos/Super12138/Hash-Checker/releases/latest";

export const APP_LANGUAGES: Language[] = [
    {
        displayName: "中文（简体）",
        languageTag: "zh-CN",
    },
    {
        displayName: "English (United States)",
        languageTag: "en-US",
    },
];

export const OPEN_SOURCE_LIBRARIES: OpenSourceLibrary[] = [
    {
        name: "Vue.js",
        url: "https://github.com/vuejs/core",
    },
    {
        name: "Pinia",
        url: "https://github.com/vuejs/pinia",
    },
    {
        name: "Vite",
        url: "https://github.com/vitejs/vite",
    },
    {
        name: "CryptoJS",
        url: "https://github.com/brix/crypto-js",
    },
    {
        name: "MDUI",
        url: "https://github.com/zdhxiong/mdui",
    },
    {
        name: "Tauri",
        url: "https://github.com/tauri-apps/tauri",
    },
    {
        name: "SemVer",
        url: "https://github.com/semver/semver",
    },
    {
        name: "markdown-it",
        url: "https://github.com/markdown-it/markdown-it",
    },
    {
        name: "pinia-plugin-persistedstate",
        url: "https://github.com/prazdevs/pinia-plugin-persistedstate",
    },
    {
        name: "Vue I18n",
        url: "https://github.com/intlify/vue-i18n",
    },
    {
        name: "VueUse",
        url: "https://github.com/vueuse/vueuse",
    },
    {
        name: "Vite PWA",
        url: "https://github.com/vite-pwa/vite-plugin-pwa",
    },
];

export const NOTIFICATION_TAG = "super-hash-notification";
