<script setup lang="ts">
import "mdui/components/list-item.js";

import "@mdui/icons/info--outlined.js";

import { computed, ref, Teleport } from "vue";

import { useI18n } from "vue-i18n";

import RichDialog from "@/components/shared/RichDialog.vue";
import SettingsAboutDialog from "./SettingsAboutDialog.vue";

const { t } = useI18n();

const dialogOpen = ref(false);
</script>

<template>
    <mdui-list-item :headline="t('settings.about.label')" @click="dialogOpen = true">
        <mdui-icon-info--outlined slot="icon"></mdui-icon-info--outlined>
    </mdui-list-item>
    <Teleport to="body">
        <SettingsAboutDialog v-model="dialogOpen" />
    </Teleport>
</template>
