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
        <h2 style="margin-top: 10px; margin-bottom: 5px">Super Hash</h2>

        <p style="margin-top: 5px">
            {{ t("settings.about.dialog.version") }}
            <mdui-tooltip :content="t('click-to-copy')">
                <span style="cursor: pointer">{{ version }}</span>
            </mdui-tooltip>
        </p>

        <p style="margin-top: 1.5rem">
            {{ t("settings.about.dialog.source-code.prefix") }}
            <a target="_blank" href="https://github.com/Super12138/Hash-Checker/">GitHub</a>
            {{ t("settings.about.dialog.source-code.suffix") }}
            <br />
            {{ t("settings.about.dialog.author.prefix") }}
            <a target="_blank" href="https://github.com/Super12138/">Super12138</a>
            {{ t("settings.about.dialog.author.suffix") }}
        </p>
        <img width="35%" src="../../../assets/gpl.svg" />
        <p>{{ t("settings.about.dialog.licence") }}</p>

        <mdui-divider></mdui-divider>

        <p>
            {{ t("settings.about.dialog.open-source-libraries") }}
            <br />
            <template v-for="library in OPEN_SOURCE_LIBRARIES" :key="library.name">
                <a target="_blank" :href="library.url">{{ library.name }}</a>
                <br />
            </template>
        </p>
        <p>
            {{ t("settings.about.dialog.thanks") }}
            <br />
            <a target="_blank" href="https://icon.kitchen/">IconKitchen</a>
        </p>

        <mdui-button slot="action" variant="tonal" @click="onConfirm()">{{
            t("confirm")
        }}</mdui-button>
    </mdui-dialog>
</template>
