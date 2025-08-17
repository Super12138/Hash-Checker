<script setup lang="ts">
import { useThemeColorStore } from "@/stores/settings/themeColor";
import { setColorScheme } from "mdui";
import "mdui/components/dialog.js";

import type { Dialog } from "mdui/components/dialog.js";
import { ref, useTemplateRef, watch } from "vue";

const open = defineModel<boolean>({ required: true });
const dialogRef = useTemplateRef<Dialog>("dialog");
const themeColorStore = useThemeColorStore();

const inputColor = ref<string>(themeColorStore.color);

const onClosed = () => {
    open.value = false;
};

const onConfirm = () => {
    if (dialogRef.value) {
        dialogRef.value.open = false;
    }
    if (themeColorStore.color !== inputColor.value) {
        themeColorStore.setColor(inputColor.value);
    }
};

const onCancel = () => {
    if (dialogRef.value) {
        dialogRef.value.open = false;
    }
    if (themeColorStore.color !== inputColor.value) {
        setColorScheme(themeColorStore.color);
        inputColor.value = themeColorStore.color;
    }
};

const resetToDefault = () => {
    if (inputColor.value !== "#0f032b") {
        themeColorStore.$reset();
        inputColor.value = themeColorStore.color;
    }
};

watch(inputColor, (newColor) => {
    setColorScheme(newColor);
});
</script>

<template>
    <mdui-dialog
        headline="选择主题色"
        description="选择一个你心仪的主题色"
        :open="open"
        close-on-overlay-click="true"
        @closed.self="onClosed()"
        ref="dialog"
    >
        <input type="color" v-model="inputColor" />
        <mdui-button @click="resetToDefault()">重置到默认颜色</mdui-button>
        <mdui-button slot="action" variant="text" @click="onCancel()">取消</mdui-button>
        <mdui-button slot="action" variant="tonal" @click="onConfirm()">确定</mdui-button>
    </mdui-dialog>
</template>
