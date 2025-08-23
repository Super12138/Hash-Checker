<script setup lang="ts">
import "mdui/components/dialog.js";
import type { Dialog } from "mdui/components/dialog.js";

import { formatDate } from "@/utils/text";
import { useClipboard } from "@vueuse/core";
import { snackbar } from "mdui";
import { useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { copy, copied, isSupported } = useClipboard();

const open = defineModel<boolean>({ required: true });
const dialogRef = useTemplateRef<Dialog>("dialog");

const props = defineProps<{
    fileName: string;
    fileMode: string;
    fileAlgorithm: string;
    fileStatus: string;
    addTime: number;
    hash: string | undefined;
    checkSum: string | undefined;
    showCompare: boolean;
    isCheckSumMatch: boolean;
}>();

const copyHash = () => {
    if (!isSupported.value) {
        snackbar({ message: "当前浏览器不支持复制功能" });
        return;
    }
    if (props.hash !== undefined) {
        copy(props.hash);
        if (copied) {
            snackbar({ message: "成功将哈希值写入剪贴板" });
        } else {
            snackbar({ message: "无法写入到剪贴板" });
        }
    }
};

const onClosed = () => {
    open.value = false;
};

const onConfirm = () => {
    if (dialogRef.value) {
        dialogRef.value.open = false;
    }
};
</script>

<template>
    <mdui-dialog
        headline="文件信息"
        :open="open"
        close-on-overlay-click="true"
        @closed.self="onClosed()"
        ref="dialog"
    >
        <p>文件名：{{ fileName }}</p>
        <p>计算模式：{{ fileMode }}</p>
        <p>计算算法：{{ fileAlgorithm }}</p>
        <p>计算状态：{{ fileStatus }}</p>
        <p>添加时间：{{ formatDate(addTime) }}</p>
        <p v-if="checkSum?.trim() != ''">校验值：{{ checkSum }}</p>
        <p v-if="hash !== undefined">
            哈希值：
            <mdui-tooltip content="单击即可复制">
                <code @click="copyHash()">{{ hash }}</code>
            </mdui-tooltip>
        </p>
        <p v-if="showCompare">
            校验状态：
            <strong :class="isCheckSumMatch ? 'green' : 'red'">
                {{ isCheckSumMatch ? "校验成功" : "校验失败" }}
            </strong>
        </p>

        <mdui-button slot="action" variant="tonal" @click="onConfirm()">确定</mdui-button>
    </mdui-dialog>
</template>

<style lang="css" scoped>
.red {
    color: #d32f2f !important;
}

.green {
    color: #00c853 !important;
}

code {
    word-break: break-all;
    cursor: pointer;
}
</style>
