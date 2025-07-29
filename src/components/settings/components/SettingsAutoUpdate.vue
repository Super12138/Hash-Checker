<script setup lang="ts">
import "mdui/components/list-item.js";
import "mdui/components/switch.js";

import "@mdui/icons/update--outlined.js";

defineProps<{
    checked: boolean;
}>();

defineEmits<{
    (e: "change", value: boolean): void;
}>();
</script>

<template>
    <mdui-list-item
        headline="自动更新"
        description="应用启动时将自动检查更新"
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
