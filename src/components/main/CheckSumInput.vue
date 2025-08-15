<script setup lang="ts">
import "mdui/components/text-field.js";

import { useI18n } from "vue-i18n";

defineProps<{
    value: string;
    enabled: boolean;
}>();

defineEmits<{
    (e: "input", value: string): void;
}>();

const { t } = useI18n();
</script>

<template>
    <mdui-text-field
        :label="t('checkSum-input.label')"
        :helper="t('checkSum-input.helper')"
        clearable
        :disabled="!enabled"
        :value="value"
        @input="
            (event: CustomEvent<void> & Event) => {
                $emit('input', (event.target as HTMLInputElement).value);
            }
        "
    ></mdui-text-field>
</template>

<style lang="css" scoped>
mdui-text-field {
    margin-bottom: 1.5rem;
}
</style>
