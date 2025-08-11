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
import ClipboardSelector from "./components/main/ClipboardCheckbox.vue";
import FileSelector from "./components/main/FileSelector.vue";
import HashTopBar from "./components/main/HashTopBar.vue";
import ModeDropdown from "./components/main/ModeSelect.vue";
import SettingsDrawer from "./components/settings/SettingsDrawer.vue";

import { onMounted, onUnmounted, ref, toValue, watchEffect } from "vue";

import { setColorScheme } from "mdui";

import { useWebWorker } from "@vueuse/core";
import { FileItem } from "./components/file/FileItem";
import { toAlgorithm } from "./interfaces/Algorithms";
import { FileStatus } from "./interfaces/FileStatus";
import { toMode } from "./interfaces/Modes";
import type { MainPostData, ProgressInfo, WorkerPostData } from "./interfaces/WorkerMessage";
import { WorkerResult } from "./interfaces/WorkerResults";
import { useThemeColorStore } from "./stores/settings/themeColor";
import { useDrawerStore } from "./stores/ui/drawer";
import { useFileConfigurationStore } from "./stores/ui/file-configuration";

let fileList = ref<FileItem[]>([]);

// 各种 Store
const drawerStore = useDrawerStore();
const fileConfigurationStore = useFileConfigurationStore();
const themeColorStore = useThemeColorStore();

// Web Worker
const {
    data: workerData,
    post,
    terminate,
    worker,
} = useWebWorker("/src/worker/FileWorker.ts", {
    type: "module",
});

const processFile = (file: File) => {
    const currentFile = new FileItem(Date.now(), file);
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
        alert("请选择一个文件");
        return;
    }
    if (!fileConfigurationStore.isAlgorithmValid) {
        alert("请选择一个算法");
        return;
    }
    if (!fileConfigurationStore.isModeValid) {
        alert("请选择一个模式");
        return;
    }
    if (fileConfigurationStore.mode === "check" && !fileConfigurationStore.isCheckSumValid) {
        alert("请输入校验值");
        return;
    }
    fileList.value[fileList.value.length - 1].file = fileConfigurationStore.file!;
    fileList.value[fileList.value.length - 1].status = FileStatus.Computing;
    fileList.value[fileList.value.length - 1].algorithm = toAlgorithm(
        fileConfigurationStore.algorithm,
    );
    fileList.value[fileList.value.length - 1].mode = toMode(fileConfigurationStore.mode);

    drawerStore.openOnlyFileOutputDrawer();

    const msg: MainPostData = {
        file: fileConfigurationStore.file!,
        algorithm: toAlgorithm(fileConfigurationStore.algorithm),
        chunkSize: 2048,
    };
    post(msg);
};

watchEffect(() => {
    const workerResult = workerData.value as WorkerPostData;
    if (!workerResult) return;
    switch (workerResult.type) {
        case WorkerResult.Progress:
            const progressData = workerResult.data as ProgressInfo;
            fileList.value[fileList.value.length - 1].progress = progressData.progress;
            break;

        case WorkerResult.Result:
            fileList.value[fileList.value.length - 1].hash = workerResult.data.toString();
            break;

        default:
            break;
    }
});

watchEffect(() => {
    setColorScheme(toValue(themeColorStore.color));
});

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
            <ClipboardSelector />
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
                :enabled="fileConfigurationStore.mode === 'check'"
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
}

@media (max-width: 500px) {
    .options-container {
        flex-direction: column;
        /* gap: 10px; */
    }
}
</style>
