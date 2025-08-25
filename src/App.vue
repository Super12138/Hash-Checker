<script setup lang="ts">
/*
    顺序：
    导入
        MDUI 组件
        MDUI 图标
        自定义组件
        Vue 导入
        自定义函数导入
    代码
        事件绑定以及 Props
        自己写的代码
        生命周期钩子 
*/

import "mdui/components/layout-main.js";
import "mdui/components/layout.js";

import FileOutputDrawer from "./components/file/FileOutputDrawer.vue";
import AlgorithmDropdown from "./components/main/AlgorithmSelect.vue";
import CheckButton from "./components/main/CheckButton.vue";
import CheckSumInput from "./components/main/CheckSumInput.vue";
import FileSelector from "./components/main/FileSelector.vue";
import HashTopBar from "./components/main/HashTopBar.vue";
import ModeDropdown from "./components/main/ModeSelect.vue";
import SettingsDrawer from "./components/settings/SettingsDrawer.vue";
import PWABadage from "./components/shared/PWABadage.vue";
import SimpleDialog from "./components/shared/SimpleDialog.vue";

import { computed, onMounted, onUnmounted, ref, watch } from "vue";

import { setColorScheme } from "mdui";

import { FileItem } from "./components/file/FileItem";
import { toAlgorithm } from "./interfaces/Algorithms";
import { FileStatus } from "./interfaces/FileStatus";
import { toMode } from "./interfaces/Modes";
import type { MainPostData, ProgressInfo, WorkerPostData } from "./interfaces/WorkerMessage";
import { WorkerResult } from "./interfaces/WorkerResults";

import { useCacheSizeStore } from "./stores/settings/cacheSize";
import { useThemeColorStore } from "./stores/settings/themeColor";
import { useDrawerStore } from "./stores/ui/drawer";
import { useFileConfigurationStore } from "./stores/ui/file-configuration";

import { useWebWorker } from "@vueuse/core";
import UpdateDialog from "./components/shared/UpdateDialog.vue";
import { useI18n } from "vue-i18n";

let fileList = ref<FileItem[]>([]);
const openTipDialog = ref(false);
const tipDesc = ref("");

const { t } = useI18n();

// 各种 Store
const drawerStore = useDrawerStore();
const fileConfigurationStore = useFileConfigurationStore();
const themeColorStore = useThemeColorStore();
const cacheSizeStore = useCacheSizeStore();

// Web Worker
const fileWorker = new Worker(new URL("worker/FileWorker.ts", import.meta.url), { type: "module" });
const { data: workerData, post, terminate, worker } = useWebWorker(fileWorker);

const isCheckMode = computed(() => {
    return fileConfigurationStore.mode === "Check";
});

const processFile = (file: File) => {
    const currentFile = new FileItem(Date.now(), file.name);
    if (
        fileList.value.length > 0 &&
        fileList.value[fileList.value.length - 1].status === FileStatus.Waiting
    ) {
        fileList.value[fileList.value.length - 1] = currentFile;
    } else {
        fileList.value.push(currentFile);
    }
    fileConfigurationStore.setFile(file);
};

const checkConfigurationIsVaild = () => {
    if (!fileConfigurationStore.hasFile) {
        tipDesc.value = t("errors.no-file");
        openTipDialog.value = true;
        return;
    }
    if (!fileConfigurationStore.isAlgorithmValid) {
        tipDesc.value = t("errors.no-algorithm");
        openTipDialog.value = true;
        return;
    }
    if (!fileConfigurationStore.isModeValid) {
        tipDesc.value = t("errors.no-mode");
        openTipDialog.value = true;
        return;
    }
    if (isCheckMode.value) {
        if (!fileConfigurationStore.isCheckSumValid) {
            tipDesc.value = t("errors.no-checksum");
            openTipDialog.value = true;
            return;
        }
    }

    fileList.value[fileList.value.length - 1].status = FileStatus.Computing;
    fileList.value[fileList.value.length - 1].algorithm = toAlgorithm(
        fileConfigurationStore.algorithm,
    );
    fileList.value[fileList.value.length - 1].mode = toMode(fileConfigurationStore.mode);
    fileList.value[fileList.value.length - 1].checkSum = fileConfigurationStore.checkSum;

    drawerStore.openOnlyFileOutputDrawer();

    const msg: MainPostData = {
        file: fileConfigurationStore.file!,
        algorithm: toAlgorithm(fileConfigurationStore.algorithm),
        chunkSize: cacheSizeStore.size,
    };

    post(msg);

    fileList.value[fileList.value.length - 1].progress = undefined;
    fileConfigurationStore.$reset();
};

watch(workerData, (workerResult: WorkerPostData) => {
    //if (!workerResult) return;
    switch (workerResult.type) {
        case WorkerResult.Progress:
            const progressData = workerResult.data as ProgressInfo;
            fileList.value[fileList.value.length - 1].progress = progressData.progress;
            fileList.value[fileList.value.length - 1].estimetedTime =
                progressData.estimatedRemainingTime;
            break;

        case WorkerResult.Result:
            fileList.value[fileList.value.length - 1].status = FileStatus.Finished;
            fileList.value[fileList.value.length - 1].hash = workerResult.data.toString();
            break;

        default:
            break;
    }
});

themeColorStore.$subscribe(
    (mutation, state) => {
        setColorScheme(state.color);
    },
    { immediate: true },
);

onMounted(() => {
    document.body.classList.add("ready");
});

onUnmounted(() => {
    terminate();
});
</script>

<template>
    <mdui-layout>
        <HashTopBar
            @toggle-output="drawerStore.toggleFileOutputDrawer()"
            @toggle-settings="drawerStore.toggleSettingsDrawer()"
        />

        <mdui-layout-main class="container">
            <FileSelector :file="fileConfigurationStore.file" @changed="processFile" />
            <div class="options-container">
                <AlgorithmDropdown
                    :value="fileConfigurationStore.algorithm"
                    @change="
                        (value: string) => {
                            fileConfigurationStore.setAlgorithm(value);
                        }
                    "
                />
                <ModeDropdown
                    :value="fileConfigurationStore.mode"
                    @change="
                        (value: string) => {
                            fileConfigurationStore.setMode(value);
                        }
                    "
                />
            </div>
            <CheckSumInput
                :value="fileConfigurationStore.checkSum"
                :enabled="isCheckMode"
                @input="
                    (value: string) => {
                        fileConfigurationStore.setCheckSum(value);
                    }
                "
            />
            <CheckButton @click="checkConfigurationIsVaild()" />
        </mdui-layout-main>
    </mdui-layout>
    <FileOutputDrawer
        :file-list="fileList"
        :open="drawerStore.openFileOutputDrawer"
        @close="drawerStore.toggleFileOutputDrawer()"
    />
    <SettingsDrawer
        :open="drawerStore.openSettingsDrawer"
        @close="drawerStore.toggleSettingsDrawer()"
    />

    <SimpleDialog
        v-model="openTipDialog"
        :headline="t('error')"
        :description="tipDesc"
        :enable-cancel-button="false"
        :close-on-overlay-click="true"
    />

    <PWABadage />
    <UpdateDialog />
</template>

<style lang="css">
mdui-layout {
    height: 100vh;
}

/* 网格布局 */
.container {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-right: auto;
    margin-left: auto;
    padding-right: 8px;
    padding-left: 8px;
}

.container::after {
    display: table;
    clear: both;
    content: "";
}

.container {
    width: 90%;
    padding-left: 5% !important;
    padding-right: 5% !important;
}

@media (min-width: 600px) {
    .container {
        width: 94%;
        padding-left: 3% !important;
        padding-right: 3% !important;
    }
}

.options-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 1rem;
    margin-top: 2rem;
}

@media (max-width: 500px) {
    .options-container {
        flex-direction: column;
        /* gap: 10px; */
    }
}
</style>
