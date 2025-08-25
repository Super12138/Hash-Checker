<script setup lang="ts">
import "mdui/components/dialog.js";
import type { Dialog } from "mdui/components/dialog.js";

import { APP_LANGUAGES } from "@/interfaces/constants";
import { useLanguageStore } from "@/stores/settings/language";

import SettingsLanguageItem from "./SettingsLanguageItem.vue";

import { onMounted, useTemplateRef } from "vue";

import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const open = defineModel<boolean>({ required: true });
const dialogRef = useTemplateRef<Dialog>("dialog");
const languageStore = useLanguageStore();

const onClosed = () => {
    open.value = false;
};

const setLanguage = (languageTag: string) => {
    console.log(`Selected: ${languageTag}`);
    if (dialogRef.value) {
        dialogRef.value.open = false;
    }
    if (languageStore.language !== languageTag) {
        console.log(`Apply: ${languageTag}`);
        languageStore.setLanguage(languageTag);
        locale.value = languageTag;
    }
};

languageStore.$subscribe((mutation, state) => {
    locale.value = state.language;
});

// TODO: 确认一下这种写法和 immediate 的效果一样
onMounted(() => {
    locale.value = languageStore.language;
});
</script>

<template>
    <mdui-dialog
        :headline="t('settings.language.dialog.headline')"
        :description="t('settings.language.dialog.description')"
        :open="open"
        close-on-overlay-click="true"
        @closed.self="onClosed()"
        ref="dialog"
    >
        <mdui-list>
            <SettingsLanguageItem
                v-for="language in APP_LANGUAGES"
                :key="language.languageTag"
                :display-name="language.displayName"
                :checked="locale === language.languageTag"
                @select="setLanguage(language.languageTag)"
            />
        </mdui-list>
    </mdui-dialog>
</template>
