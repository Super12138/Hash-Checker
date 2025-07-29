<script setup lang="ts">
import "mdui/components/list-item.js";
import "mdui/components/switch.js";

import "@mdui/icons/notifications-active--outlined.js";

defineProps<{
    checked: boolean;
}>();

defineEmits<{
    (e: "change", value: boolean): void;
}>();
</script>

<template>
    <mdui-list-item
        headline="系统通知"
        description="使用系统通知代替操作后弹出的提示框"
        @click.self="$emit('change', !checked)"
    >
        <mdui-icon-notifications-active--outlined
            slot="icon"
        ></mdui-icon-notifications-active--outlined>
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
    <mdui-button v-if="checked" variant="tonal" full-width>点击发送一条测试通知</mdui-button>
</template>

<style lang="css" scoped>
mdui-button {
    margin: 0.5rem 1rem;
}
</style>
