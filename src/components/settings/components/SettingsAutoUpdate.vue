<script setup lang="ts">
import "mdui/components/list-item.js";
import "mdui/components/switch.js";

import "@mdui/icons/update--outlined.js";
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
        :headline="t('settings.auto-update.label')"
        :description="t('settings.auto-update.description')"
        @click.self="$emit('change', !checked)"
    >
        <mdui-icon-update--outlined slot="icon"></mdui-icon-update--outlined>
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
