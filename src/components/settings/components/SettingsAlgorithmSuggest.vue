<script setup lang="ts">
import "mdui/components/list-item.js";
import "mdui/components/switch.js";

import "@mdui/icons/tips-and-updates--outlined.js";

defineProps<{
    checked: boolean;
}>();

defineEmits<{
    (e: "change", value: boolean): void;
}>();
</script>

<template>
    <mdui-list-item
        headline="自动匹配校验方法"
        description="根据输入的校验值自动匹配校验方法"
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
