<script setup lang="ts">
import "mdui/components/list-item.js";

import "@mdui/icons/delete-forever--outlined.js";

import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
    <mdui-list-item :headline="t('settings.reset.label')">
        <mdui-icon-delete-forever--outlined slot="icon"></mdui-icon-delete-forever--outlined>
    </mdui-list-item>
</template>
