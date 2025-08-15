<script setup lang="ts">
import "mdui/components/menu-item.js";
import "mdui/components/select.js";

import { useI18n } from "vue-i18n";

defineProps<{
    value: string;
}>();

defineEmits<{
    (e: "change", value: string): void;
}>();

const { t } = useI18n();
</script>

<template>
    <div class="select">
        <span class="select-label">{{ t("mode.label") }}</span>
        <mdui-select
            :value="value"
            @change="
                (e: CustomEvent<void> & Event) => {
                    $emit('change', (e.target as HTMLSelectElement).value);
                }
            "
            :placeholder="t('mode.placeholder')"
            required
        >
            <mdui-menu-item value="Check">{{ t("mode.check") }}</mdui-menu-item>
            <mdui-menu-item value="Generate">{{ t("mode.generate") }}</mdui-menu-item>
        </mdui-select>
    </div>
</template>
