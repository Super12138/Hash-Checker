<script setup lang="ts">
import "mdui/components/list-item.js";

import "@mdui/icons/cleaning-services--outlined.js";

import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
    <mdui-list-item :headline="t('settings.clear-cache.label')">
        <mdui-icon-cleaning-services--outlined slot="icon"></mdui-icon-cleaning-services--outlined>
    </mdui-list-item>
</template>
