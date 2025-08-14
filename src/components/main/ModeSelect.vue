<script setup lang="ts">
import "mdui/components/menu-item.js";
import "mdui/components/select.js";

defineProps<{
    value: string;
}>();

defineEmits<{
    (e: "change", value: string): void;
}>();
</script>

<template>
    <div class="select">
        <span class="select-label">{{ $t("labels.mode.label") }}</span>
        <mdui-select
            :value="value"
            @change="
                (e: CustomEvent<void> & Event) => {
                    $emit('change', (e.target as HTMLSelectElement).value);
                }
            "
            :placeholder="$t('labels.mode.placeholder')"
            required
        >
            <mdui-menu-item value="Check">{{ $t("labels.mode.check") }}</mdui-menu-item>
            <mdui-menu-item value="Generate">{{ $t("labels.mode.generate") }}</mdui-menu-item>
        </mdui-select>
    </div>
</template>
