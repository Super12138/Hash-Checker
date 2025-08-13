<script setup lang="ts">
import "mdui/components/card.js";

import "@mdui/icons/upload-file--outlined.js";

import { useFileInfo } from "@/utils/file";
import { useDropZone, useFileDialog } from "@vueuse/core";

import { Teleport, watchEffect } from "vue";

import FadeOutInTransition from "../shared/FadeOutInTransition.vue";
import DragTip from "./DragTip.vue";

const props = defineProps<{
    file: File | null;
}>();

const emit = defineEmits<{
    (e: "changed", file: File): void;
}>();

const fileInfo = useFileInfo(() => props.file);

// 拖拽文件
const { isOverDropZone } = useDropZone(() => document.body, {
    onDrop: (files: File[] | null) => {
        if (files !== null) {
            emit("changed", files[0]);
        }
    },
    multiple: false,
});

// 文件选择器
const { files, open, reset, onCancel, onChange } = useFileDialog({
    multiple: false,
});
watchEffect(() => {
    if (files.value !== null) {
        emit("changed", files.value[0]);
    }
});
</script>

<template>
    <mdui-card variant="outlined" clickable @click="open()">
        <mdui-icon-upload-file--outlined></mdui-icon-upload-file--outlined>
        <p>{{ $t("labels.choose-file") }}</p>
        <small>{{ $t("labels.choose-file-tip") }}</small>
        <p class="file-info">{{ fileInfo }}</p>
    </mdui-card>

    <Teleport to="body">
        <FadeOutInTransition>
            <DragTip v-if="isOverDropZone" />
        </FadeOutInTransition>
    </Teleport>
</template>

<style lang="css" scoped>
.file-info {
    margin-top: 0.3rem;
    color: rgb(var(--mdui-color-on-surface-variant));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    width: 100%;
}

small {
    color: rgb(var(--mdui-color-on-surface-variant));
}

p {
    margin: 0;
}

mdui-icon-upload-file--outlined {
    font-size: var(--mdui-typescale-headline-large-size);
    display: block;
    margin-bottom: 1rem;
}

mdui-card {
    width: auto;
    max-width: 400px;
    height: auto;
    max-height: 200px;
    user-select: none;
    padding: 1rem 2.5rem 1rem 2.5rem;
    margin: 1rem auto 0.5rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
}
</style>
