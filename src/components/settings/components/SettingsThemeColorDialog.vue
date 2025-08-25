<script setup lang="ts">
import "mdui/components/dialog.js";
import { setColorScheme } from "mdui";
import type { Dialog } from "mdui/components/dialog.js";

import { useThemeColorStore } from "@/stores/settings/themeColor";

import { ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
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
        :headline="t('settings.theme-color.dialog.headline')"
        :description="t('settings.theme-color.dialog.description')"
        :open="open"
        close-on-overlay-click="true"
        @closed.self="onClosed()"
        ref="dialog"
    >
        <input type="color" v-model="inputColor" />
        <br />
        <mdui-button @click="resetToDefault()" full-width style="margin-top: 1rem">
            {{ t("settings.theme-color.dialog.reset") }}
        </mdui-button>
        <mdui-button slot="action" variant="text" @click="onCancel()">
            {{ t("cancel") }}
        </mdui-button>
        <mdui-button slot="action" variant="tonal" @click="onConfirm()">
            {{ t("confirm") }}
        </mdui-button>
    </mdui-dialog>
</template>
