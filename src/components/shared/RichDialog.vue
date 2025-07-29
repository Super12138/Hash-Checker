<script setup lang="ts">
import "mdui/components/dialog.js";

defineProps<{
    headline: string;
    closeOnOverlayClick: boolean;
    enableCancelButton: boolean;
}>();

const emit = defineEmits<{
    (e: "confirm"): void;
    (e: "cancel"): void;
}>();

const open = defineModel<boolean>({ required: true });

const onConfirm = () => {
    open.value = false;
    emit("confirm");
};

const onCancel = () => {
    open.value = false;
    emit("cancel");
};
</script>

<template>
    <mdui-dialog :headline="headline" :open="open" :close-on-overlay-click="closeOnOverlayClick">
        <slot></slot>
        <mdui-button v-if="enableCancelButton" slot="action" variant="text" @click="onCancel()">取消</mdui-button>
        <mdui-button slot="action" variant="tonal" @click="onConfirm()">确定</mdui-button>
    </mdui-dialog>
</template>
