<script setup lang="ts">
import "mdui/components/list-item.js";

import "@mdui/icons/language--outlined.js";

import { useI18n } from "vue-i18n";
import { ref, Teleport } from "vue";
import SettingsLanguageDialog from "./SettingsLanguageDialog.vue";

const { t } = useI18n();
const dialogOpen = ref(false);
</script>

<template>
    <mdui-list-item
        :headline="t('settings.language.label')"
        :description="t('settings.language.description')"
        @click="dialogOpen = true"
    >
        <mdui-icon-language--outlined slot="icon"></mdui-icon-language--outlined>
    </mdui-list-item>
    <Teleport to="body">
        <SettingsLanguageDialog v-model="dialogOpen" />
    </Teleport>
</template>
