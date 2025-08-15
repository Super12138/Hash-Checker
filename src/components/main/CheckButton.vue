<script setup lang="ts">
import "mdui/components/button.js";

import { useI18n } from "vue-i18n";

defineEmits<{
    (e: "click"): void;
}>();

const { t } = useI18n();
</script>

<template>
    <mdui-button full-width @click="$emit('click')">{{ t("check-btn-label") }}</mdui-button>
</template>
