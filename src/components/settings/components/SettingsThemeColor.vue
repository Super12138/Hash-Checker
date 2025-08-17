<script setup lang="ts">
import "mdui/components/list-item.js";

import "@mdui/icons/color-lens--outlined.js";

import { ref, Teleport } from "vue";
import { useI18n } from "vue-i18n";
import SettingsThemeColorDialog from "./SettingsThemeColorDialog.vue";

const { t } = useI18n();
const dialogOpen = ref(false);
</script>

<template>
    <mdui-list-item
        :headline="t('settings.theme-color.label')"
        :description="t('settings.theme-color.description')"
        @click="dialogOpen = true"
    >
        <mdui-icon-color-lens--outlined slot="icon"></mdui-icon-color-lens--outlined>
    </mdui-list-item>

    <Teleport to="body">
        <SettingsThemeColorDialog v-model="dialogOpen" />
    </Teleport>
</template>
