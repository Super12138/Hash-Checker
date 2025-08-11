<script setup lang="ts">
import "mdui/components/circular-progress.js";
import "mdui/components/list-item.js";

import { FileStatus } from "@/interfaces/FileStatus";
import type { FileItem } from "./FileItem";

import { computed, ref, Teleport } from "vue";

import RichDialog from "../shared/RichDialog.vue";
import { Modes } from "@/interfaces/Modes";
import { Algorithms } from "@/interfaces/Algorithms";

const props = defineProps<{
    fileItem: FileItem;
}>();

const dialogOpen = ref<boolean>(false);

const fileStatus = computed(() => {
    switch (props.fileItem.status) {
        case FileStatus.Waiting:
            return "等待中";

        case FileStatus.Computing:
            return "计算中";

        case FileStatus.Finished:
            return "计算成功";

        case FileStatus.Error:
            return "计算失败";

        case FileStatus.Canceled:
            return "计算已取消";

        default:
            return "状态错误";
    }
});

const fileMode = computed(() => {
    switch (props.fileItem.mode) {
        case Modes.Check:
            return "校验";
        case Modes.Generate:
            return "生成";
        case Modes.Unselected:
            return "未选择（未接收）";
    }
});

const fileAlgorithm = computed(() => {
    switch (props.fileItem.algorithm) {
        case Algorithms.MD5:
            return "MD5";
        case Algorithms.SHA1:
            return "SHA1";
        case Algorithms.SHA3:
            return "SHA3";
        case Algorithms.SHA256:
            return "SHA256";
        case Algorithms.SHA384:
            return "SHA384";
        case Algorithms.SHA512:
            return "SHA512";
        case Algorithms.Unselected:
            return "未选择（未接收）";
    }
});
</script>

<template>
    <mdui-list-item :headline="fileItem.name" :description="fileStatus" @click="dialogOpen = true">
        <mdui-circular-progress
            :value="fileItem.progress"
            min="0"
            max="1"
            slot="end-icon"
        ></mdui-circular-progress>
    </mdui-list-item>

    <Teleport to="body">
        <RichDialog headline="文件信息" :enable-cancel-button="false" v-model="dialogOpen">
            <p>{{ `文件名：${fileItem.name}` }}</p>
            <p>{{ `添加事件: ${fileItem.addTime}` }}</p>
            <p>{{ `当前状态：${fileStatus}` }}</p>
            <p>{{ `模式：${fileMode}` }}</p>
            <p>{{ `算法：${fileAlgorithm}` }}</p>
            <p>{{ `哈希值：${fileItem.hash}` }}</p>
        </RichDialog>
    </Teleport>
</template>
