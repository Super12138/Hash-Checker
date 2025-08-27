<script setup lang="ts">
import { UPDATE_URL } from "@/interfaces/constants";
import { DownloadStatus } from "@/interfaces/DownloadingStatus";
import type { GitHubRelease } from "@/interfaces/GitHubRelease";
import { useAutoUpdateStore } from "@/stores/settings/autoUpdate";
import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import { useFetch } from "@vueuse/core";
import MarkdownIt from "markdown-it";
import { snackbar } from "mdui";
import { lt } from "semver";
import { onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import RichDialog from "../shared/RichDialog.vue";
import UpdateProgressDialog from "./UpdateProgressDialog.vue";

const { t } = useI18n();
const markdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});

const autoUpdateStore = useAutoUpdateStore(); // autoUpdateStore.enable是一个常量，用于控制是否启用自动更新

const showUpdateDialog = ref<boolean>(false);
const showProgressDialog = ref<boolean>(false);
const updateContent = ref<string>("");
const currentVersion = VERSION_NAME;
const newVersion = ref<string>("");

const downloadStatus = ref<DownloadStatus>(DownloadStatus.Fetching);
const downloadProgress = ref<number | undefined>(undefined);

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
        showUpdateDialog.value = true;
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

const downloadAndIntallUpdate = async () => {
    try {
        downloadStatus.value = DownloadStatus.Fetching;
        showProgressDialog.value = true;

        const update = await check();
        if (update) {
            console.log(`Tauri Updater：发现更新 ${update.version}`);
            let downloaded = 0;
            let contentLength = 0;
            downloadStatus.value = DownloadStatus.Started;
            // alternatively we could also call update.download() and update.install() separately
            await update.downloadAndInstall((event) => {
                switch (event.event) {
                    case "Started":
                        if (event.data.contentLength) {
                            contentLength = event.data.contentLength;
                            console.log(`Tauri Updater：文件大小 ${contentLength} 字节`);
                        }
                        downloadStatus.value = DownloadStatus.Downloading;
                        break;
                    case "Progress":
                        downloaded += event.data.chunkLength;
                        downloadProgress.value = contentLength > 0 ? downloaded / contentLength : 0;
                        break;
                    case "Finished":
                        downloadStatus.value = DownloadStatus.Finished;
                        break;
                }
            });

            console.log("Tauri Updater：更新包下载完成");
            await relaunch();
        }
    } catch (error) {
        downloadStatus.value = DownloadStatus.Error;
        downloadProgress.value = 0;
        console.error("Tauri Updater：更新失败", error);
        snackbar({ message: `更新失败: ${error}` });
    }
};

onUnmounted(() => {
    if (isFetching.value) abort();
});
</script>

<template>
    <RichDialog
        :headline="t('update-dialog.headline', { version: newVersion })"
        :description="t('update-dialog.description', { version: currentVersion })"
        v-model="showUpdateDialog"
        :close-on-overlay-click="false"
        @confirm="downloadAndIntallUpdate()"
    >
        <div v-html="updateContent"></div>
    </RichDialog>
    <UpdateProgressDialog
        :progress="downloadProgress"
        :status="downloadStatus"
        v-model="showProgressDialog"
    />
</template>
