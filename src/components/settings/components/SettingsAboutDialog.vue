<script setup lang="ts">
import "mdui/components/dialog.js";
import "mdui/components/divider.js";

import type { Dialog } from "mdui/components/dialog.js";
import { computed } from "vue";

import { useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";
import { OPEN_SOURCE_LIBRARIES } from "@/interfaces/constants";

const open = defineModel<boolean>({ required: true });
const dialogRef = useTemplateRef<Dialog>("dialog");

const { t } = useI18n();

const onClosed = () => {
    open.value = false;
};

const onConfirm = () => {
    if (dialogRef.value) {
        dialogRef.value.open = false;
    }
};

const version = computed(() => {
    return `${VERSION_NAME}-${VARIANT}-${COMMIT_HASH} (${VERSION_CODE})${STORE ? " [store]" : ""}`;
});
</script>

<template>
    <mdui-dialog
        :headline="t('settings.about.label')"
        :open="open"
        close-on-overlay-click="true"
        @closed.self="onClosed()"
        ref="dialog"
        style="text-align: center"
    >
        <img width="120px" src="/icon.png" />
        <h2 style="margin-top: 10px">Super Hash</h2>
        <p id="version" style="margin-top: 5px">
            版本：
            <mdui-tooltip content="单击即可复制">
                <span style="cursor: pointer">{{ version }}</span>
            </mdui-tooltip>
        </p>
        <p>
            本应用在
            <a target="_blank" href="https://github.com/Super12138/Hash-Checker/">GitHub</a> 上开源
            <br />
            由 <a target="_blank" href="https://github.com/Super12138/">Super12138</a> 开发
        </p>
        <img width="45%" src="../../../assets/gpl.svg" />
        <p>遵循 GPL-3.0 协议</p>
        <mdui-divider></mdui-divider>
        <p>
            开源库
            <br />
            <template v-for="library in OPEN_SOURCE_LIBRARIES" :key="library.name">
                <a target="_blank" :href="library.url">{{ library.name }}</a>
                <br />
            </template>
        </p>
        <p>
            感谢
            <br />
            <a target="_blank" href="https://icon.kitchen/">IconKitchen</a>
        </p>
        <mdui-button slot="action" variant="tonal" @click="onConfirm()">确定</mdui-button>
    </mdui-dialog>
</template>
