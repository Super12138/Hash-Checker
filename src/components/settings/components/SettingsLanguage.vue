<script setup lang="ts">
import "mdui/components/list-item.js";

import "@mdui/icons/language--outlined.js";

import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
    <mdui-list-item
        :headline="t('settings.language.label')"
        :description="t('settings.language.description')"
    >
        <mdui-icon-language--outlined slot="icon"></mdui-icon-language--outlined>
    </mdui-list-item>
</template>
