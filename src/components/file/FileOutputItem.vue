<script setup lang="ts">
import "mdui/components/circular-progress.js";
import "mdui/components/list-item.js";

import { FileStatus } from "@/interfaces/FileStatus";
import type { FileItem } from "./FileItem";

import { computed, openBlock, ref } from "vue";
import { Teleport } from "vue";

import RichDialog from "../shared/RichDialog.vue";

const props = defineProps<{
    fileItem: FileItem;
}>();

const dialogOpen = ref<boolean>(false);

const fileStatus = computed(() => {
    let text = "";
    switch (props.fileItem.status) {
        case FileStatus.WAITING:
            text = "等待中";
            break;
        case FileStatus.COMPUTING:
            text = "计算中";
            break;
        case FileStatus.FINISHED:
            text = "计算成功";
            break;
        case FileStatus.ERROR:
            text = "计算失败";
            break;
        case FileStatus.CANCELED:
            text = "计算已取消";
        default:
            break;
    }
    return text;
});
</script>

<template>
    <mdui-list-item :headline="fileItem.name" :description="fileStatus" @click="dialogOpen = true">
        <mdui-circular-progress :value="fileItem.progress" slot="end-icon"></mdui-circular-progress>
    </mdui-list-item>

    <Teleport to="body">
        <RichDialog headline="文件信息" :enable-cancel-button="false" v-model="dialogOpen">
            <p>{{ fileItem.name }}</p>
            <p>{{ `Time: ${fileItem.addTime}` }}</p>
        </RichDialog>
    </Teleport>
</template>
