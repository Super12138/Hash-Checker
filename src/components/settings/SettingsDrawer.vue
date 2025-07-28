<script setup lang="ts">
import "mdui/components/button-icon.js";
import "mdui/components/list.js";
import "mdui/components/navigation-drawer.js";

import "@mdui/icons/close--outlined.js";

defineProps<{
    open: boolean;
}>();

defineEmits<{
    close: () => void;
}>();
</script>

<template>
    <mdui-navigation-drawer
        placement="right"
        close-on-esc
        close-on-overlay-click
        :open="open"
    >
        <div class="drawer-title">
            <span>设置</span>
            <mdui-button-icon @click="$emit('close')">
                <mdui-icon-close--outlined></mdui-icon-close--outlined>
            </mdui-button-icon>
        </div>
        <mdui-list> </mdui-list>
    </mdui-navigation-drawer>
</template>
