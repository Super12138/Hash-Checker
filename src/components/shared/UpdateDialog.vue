<script setup lang="ts">
import { UPDATE_URL } from "@/interfaces/constants";
import type { GitHubRelease } from "@/interfaces/GitHubRelease";
import { useAutoUpdateStore } from "@/stores/settings/autoUpdate";
import { useFetch } from "@vueuse/core";
import MarkdownIt from "markdown-it";
import { snackbar } from "mdui";
import { lt } from "semver";
import { onUnmounted, ref, watch } from "vue";

import RichDialog from "./RichDialog.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const markdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});

const autoUpdateStore = useAutoUpdateStore(); // autoUpdateStore.enable是一个常量，用于控制是否启用自动更新

const dialogOpen = ref<boolean>(false);
const updateContent = ref<string>("");
const currentVersion = VERSION_NAME;
const newVersion = ref<string>("");

const { isFetching, error, data, abort, execute } = useFetch(UPDATE_URL, {
    immediate: false,
    timeout: 5000,
});

watch(
    () => autoUpdateStore.enable,
    (enabled) => {
        if (enabled) execute();
        else if (isFetching.value) abort();
    },
    { immediate: true },
);

watch(data, (d) => {
    if (!d || !autoUpdateStore.enable) return;
    const json = JSON.parse(d as string) as GitHubRelease;
    const remoteVersion = json.name;
    newVersion.value = json.name;
    if (lt(VERSION_NAME, remoteVersion)) {
        console.log("检测到新版本");
        // TODO: 不要直接用字符串切割
        const text = json.body.split("# 🚀 更新内容")[1].split("# ⬇️ 下载")[0];
        updateContent.value = markdownIt.render(text);
        dialogOpen.value = true;
    } else {
        console.log("当前版本已是最新");
        snackbar({ message: "当前已是最新版本" });
    }
});

watch(error, (err) => {
    if (!err || !autoUpdateStore.enable) return;
    if (err.name !== "AbortError") {
        // 过滤掉主动取消的错误 @DeepSeek
        console.error(err);
        snackbar({ message: `检查更新时出错（${err}）` });
    }
});

const openUpdateURLInBrowser = () => {
    // TODO: 替换成 Tauri 方法
    window.open("https://github.com/Super12138/Hash-Checker/releases/", "_blank");
};

onUnmounted(() => {
    if (isFetching.value) abort();
});
</script>

<template>
    <RichDialog
        :headline="t('update-dialog.headline', { version: newVersion })"
        :description="t('update-dialog.description', { version: currentVersion })"
        v-model="dialogOpen"
        :close-on-overlay-click="false"
        @confirm="openUpdateURLInBrowser()"
    >
        <div v-html="updateContent"></div>
    </RichDialog>
</template>
