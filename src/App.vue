<script setup lang="ts">
import "mdui/components/layout-main.js";
import "mdui/components/layout.js";

import HashTopBar from "./components/HashTopBar.vue";
import FileOutputDrawer from "./components/file/FileOutputDrawer.vue";
import SettingsDrawer from "./components/settings/SettingsDrawer.vue";

import { onMounted } from "vue";

onMounted(() => {
    document.body.classList.add("ready");
});
</script>

<template>
    <mdui-layout>
        <HashTopBar />
        <mdui-layout-main class="container"> </mdui-layout-main>
    </mdui-layout>
    <FileOutputDrawer />
    <SettingsDrawer />
</template>

<style lang="css">
mdui-layout {
    height: 100vh;
}
</style>
