<script setup lang="ts">
import "mdui/components/list-item.js";
import "mdui/components/switch.js";

import "@mdui/icons/tips-and-updates--outlined.js";

import { useI18n } from "vue-i18n";

defineProps<{
    checked: boolean;
}>();

defineEmits<{
    (e: "change", value: boolean): void;
}>();

const { t } = useI18n();
</script>

<template>
    <mdui-list-item
        :headline="t('settings.algorithm-suggest.label')"
        :description="t('settings.algorithm-suggest.description')"
        @click.self="$emit('change', !checked)"
    >
        <mdui-icon-tips-and-updates--outlined slot="icon"></mdui-icon-tips-and-updates--outlined>
        <mdui-switch
            slot="end-icon"
            :checked="checked"
            @change.self="
                (e: CustomEvent<void> & Event) => {
                    if (e.target && 'checked' in e.target) {
                        $emit('change', (e.target as HTMLInputElement).checked);
                    }
                }
            "
        ></mdui-switch>
    </mdui-list-item>
</template>
