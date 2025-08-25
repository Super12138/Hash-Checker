<script setup lang="ts">
import "mdui/components/dialog.js";
import type { Dialog } from "mdui/components/dialog.js";

import { formatDate } from "@/utils/text";
import { useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

const { t, d, locale } = useI18n();

const open = defineModel<boolean>({ required: true });
const dialogRef = useTemplateRef<Dialog>("dialog");

defineProps<{
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

defineEmits<{
    (e: "copy-hash"): void;
}>();

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
        :headline="t('file-dialog.headline')"
        :open="open"
        close-on-overlay-click="true"
        @closed.self="onClosed()"
        ref="dialog"
    >
        <div>
            <h3>{{ t("file-dialog.basic-info.title") }}</h3>
            <p>{{ t("file-dialog.basic-info.file-name") + fileName }}</p>
            <p>{{ t("file-dialog.basic-info.mode") + fileMode }}</p>
            <p>{{ t("file-dialog.basic-info.algorithm") + fileAlgorithm }}</p>
            <p>{{ t("file-dialog.basic-info.status") + fileStatus }}</p>
            <p>{{ t("file-dialog.basic-info.add-time") + d(addTime, "long", locale) }}</p>
        </div>
        <div class="check-info" v-if="hash !== undefined">
            <h3>{{ t("file-dialog.checksum-info.headline") }}</h3>
            <p v-if="checkSum?.trim() != ''">
                {{ t("file-dialog.checksum-info.checksum-user") }}<code>{{ checkSum }}</code>
            </p>
            <p>
                {{ t("file-dialog.checksum-info.checksum-generate") }}
                <mdui-tooltip :content="t('click-to-copy')">
                    <code @click="$emit('copy-hash')">{{ hash }}</code>
                </mdui-tooltip>
            </p>
            <p v-if="showCompare">
                {{ t("file-dialog.checksum-info.verification-result") }}
                <strong :class="isCheckSumMatch ? 'green' : 'red'">
                    {{
                        isCheckSumMatch
                            ? t("file-dialog.checksum-info.success")
                            : t("file-dialog.checksum-info.failed")
                    }}
                </strong>
            </p>
        </div>

        <mdui-button slot="action" variant="tonal" @click="onConfirm()">
            {{ t("confirm") }}
        </mdui-button>
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

.check-info {
    margin-top: 2rem;
}
</style>
