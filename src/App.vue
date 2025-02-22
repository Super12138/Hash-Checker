<script setup lang="ts">
import PWABadge from './components/PWABadge.vue';
import TopAppBar from './components/TopAppBar.vue';

// MDUI 组件
import 'mdui/components/layout-item.js';
import 'mdui/components/layout-main.js';
import 'mdui/components/layout.js';
</script>

<template>
    <mdui-layout>
        <mdui-layout-main id="container"> </mdui-layout-main>
        <TopAppBar />
    </mdui-layout>
    <PWABadge />
</template>

<style lang="css">
mdui-layout {
    height: 100vh;
}
</style>
