<script setup lang="ts">
import "mdui/components/button-icon.js";
import "mdui/components/top-app-bar-title.js";
import "mdui/components/top-app-bar.js";

import "@mdui/icons/menu--outlined.js";
import "@mdui/icons/settings--outlined.js";

defineEmits<{
    (e: "toggle-output"): void;
    (e: "toggle-settings"): void;
}>();
</script>

<template>
    <mdui-top-app-bar scroll-behavior="elevate" scroll-target=".container">
        <mdui-button-icon @click="$emit('toggle-output')">
            <mdui-icon-menu--outlined></mdui-icon-menu--outlined>
        </mdui-button-icon>
        <mdui-top-app-bar-title>Super Hash</mdui-top-app-bar-title>
        <div style="flex-grow: 1"></div>
        <mdui-button-icon @click="$emit('toggle-settings')">
            <mdui-icon-settings--outlined></mdui-icon-settings--outlined>
        </mdui-button-icon>
    </mdui-top-app-bar>
</template>

<style lang="css">
mdui-top-app-bar {
    padding: 1rem 0.9rem;
}

mdui-top-app-bar[scrolling] {
    background-color: rgb(var(--mdui-color-surface-container-low)) !important;
    box-shadow: 0 0 0;
}
</style>
