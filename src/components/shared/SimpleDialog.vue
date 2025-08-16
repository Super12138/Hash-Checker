<script setup lang="ts">
import "mdui/components/dialog.js";
import type { Dialog } from "mdui/components/dialog.js";
import { useTemplateRef } from "vue";

defineProps<{
    headline: string;
    desctiption?: string;
    closeOnOverlayClick: boolean;
    enableCancelButton: boolean;
}>();

const emit = defineEmits<{
    (e: "confirm"): void;
    (e: "cancel"): void;
}>();

const open = defineModel<boolean>({ required: true });

const dialogRef = useTemplateRef<Dialog>("dialog");

const onClosed = () => {
    open.value = false;
};

const onConfirm = () => {
    if (dialogRef.value) {
        dialogRef.value.open = false;
    }
    emit("confirm");
};

const onCancel = () => {
    if (dialogRef.value) {
        dialogRef.value.open = false;
    }
    emit("cancel");
};
</script>

<template>
    <mdui-dialog
        :headline="headline"
        :description="desctiption"
        :open="open"
        :close-on-overlay-click="closeOnOverlayClick"
        @closed.self="onClosed()"
        ref="dialog"
    >
        <mdui-button v-if="enableCancelButton" slot="action" variant="text" @click="onCancel()">
            取消
        </mdui-button>
        <mdui-button slot="action" variant="tonal" @click="onConfirm()">确定</mdui-button>
    </mdui-dialog>
</template>
