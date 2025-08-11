<script setup lang="ts">
import "mdui/components/button-icon.js";
import "mdui/components/list.js";
import "mdui/components/navigation-drawer.js";

import "@mdui/icons/close--outlined.js";

import FileOutputItem from "./FileOutputItem.vue";

import FadeOutInTransition from "../shared/FadeOutInTransition.vue";
import EmptyTip from "./EmptyTip.vue";
import type { FileItem } from "./FileItem";

defineProps<{
    open: boolean;
    fileList: FileItem[];
}>();

defineEmits<{
    close: () => void;
}>();
</script>

<template>
    <mdui-navigation-drawer placement="left" close-on-esc close-on-overlay-click :open="open">
        <div class="drawer-title">
            <span>文件列表</span>
            <mdui-button-icon @click="$emit('close')">
                <mdui-icon-close--outlined></mdui-icon-close--outlined>
            </mdui-button-icon>
        </div>
        <FadeOutInTransition>
            <EmptyTip tip="没有文件" v-if="fileList.length == 0" />
            <mdui-list v-else>
                <FileOutputItem v-for="file in fileList" :key="file.addTime" :file-item="file" />
            </mdui-list>
        </FadeOutInTransition>
    </mdui-navigation-drawer>
</template>
