<script setup lang="ts">
// MDUI 组件
import "mdui/components/layout-main.js";
import "mdui/components/layout.js";

// MDUI 图标
// ...

// 自定义组件
import HashTopBar from "./components/HashTopBar.vue";
import FileOutputDrawer from "./components/file/FileOutputDrawer.vue";
import SettingsDrawer from "./components/settings/SettingsDrawer.vue";

// Vue 导入
import { onMounted } from "vue";

// 自定义函数导入
// ...

// 程序代码

// 事件绑定以及 Props
// ...

// 自己写的代码
// ...

// 生命周期代码
onMounted(() => {
    document.body.classList.add("ready");
});
</script>

<template>
    <mdui-layout>
        <HashTopBar @toggle-output="" @toggle-settings="" />
        <mdui-layout-main class="container"> </mdui-layout-main>
    </mdui-layout>
    <FileOutputDrawer :open="true" @close="" />
    <SettingsDrawer :open="false" @close="" />
</template>

<style lang="css">
mdui-layout {
    height: 100vh;
}
</style>
