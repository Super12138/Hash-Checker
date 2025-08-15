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
        <span class="select-label">{{ t("algorithm.label") }}</span>
        <mdui-select
            :value="value"
            @change="
                (e: CustomEvent<void> & Event) => {
                    $emit('change', (e.target as HTMLSelectElement).value);
                }
            "
            :placeholder="t('algorithm.placeholder')"
            required
        >
            <mdui-menu-item value="MD5">MD5</mdui-menu-item>
            <mdui-menu-item value="SHA1">SHA1</mdui-menu-item>
            <mdui-menu-item value="SHA3">SHA3</mdui-menu-item>
            <mdui-menu-item value="SHA256">SHA256</mdui-menu-item>
            <mdui-menu-item value="SHA384">SHA384</mdui-menu-item>
            <mdui-menu-item value="SHA512">SHA512</mdui-menu-item>
        </mdui-select>
    </div>
</template>
