import type { Language } from "./Language";

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
