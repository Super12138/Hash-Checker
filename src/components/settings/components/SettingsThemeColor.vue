<script setup lang="ts">
import "mdui/components/list-item.js";

import "@mdui/icons/color-lens--outlined.js";

import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
    <mdui-list-item
        :headline="t('settings.theme-color.label')"
        :description="t('settings.theme-color.description')"
    >
        <mdui-icon-color-lens--outlined slot="icon"></mdui-icon-color-lens--outlined>
    </mdui-list-item>
</template>
