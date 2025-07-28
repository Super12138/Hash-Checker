<script setup lang="ts">
// MDUI 组件
// MDUI 图标
// 自定义组件
// Vue 导入
// 自定义函数导入
// 程序代码
// 事件绑定以及 Props
// 自己写的代码
// 生命周期钩子

import "mdui/components/button.js";
import "mdui/components/layout-main.js";
import "mdui/components/layout.js";
import "mdui/components/text-field.js";

import FileOutputDrawer from "./components/file/FileOutputDrawer.vue";
import AlgorithmDropdown from "./components/main/AlgorithmSelect.vue";
import CheckButton from "./components/main/CheckButton.vue";
import ClipboardSelector from "./components/main/ClipboardCheckbox.vue";
import FileSelector from "./components/main/FileSelector.vue";
import HashInput from "./components/main/HashInput.vue";
import HashTopBar from "./components/main/HashTopBar.vue";
import ModeDropdown from "./components/main/ModeSelect.vue";
import SettingsDrawer from "./components/settings/SettingsDrawer.vue";

import { onMounted } from "vue";

import { useDrawerStore } from "./stores/drawer";

const drawerStore = useDrawerStore();

/*watchEffect(() => {
    console.log(`File: ${drawerStore.openFileDrawer}; Settings ${drawerStore.openSettingsDrawer}`);
});*/

onMounted(() => {
    document.body.classList.add("ready");
});
</script>

<template>
    <mdui-layout>
        <HashTopBar @toggle-output="drawerStore.toggleFileOutputDrawer()" @toggle-settings="drawerStore.toggleSettingsDrawer()" />

        <mdui-layout-main class="container">
            <FileSelector />
            <ClipboardSelector />
            <div class="options-container">
                <AlgorithmDropdown />
                <ModeDropdown />
            </div>
            <HashInput />
            <CheckButton @click="" />
        </mdui-layout-main>
    </mdui-layout>
    <FileOutputDrawer :open="drawerStore.openFileDrawer" @close="drawerStore.toggleFileOutputDrawer()" />
    <SettingsDrawer :open="drawerStore.openSettingsDrawer" @close="drawerStore.toggleSettingsDrawer()" />
</template>

<style lang="css">
mdui-layout {
    height: 100vh;
}

/* 网格布局 */
.container {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-right: auto;
    margin-left: auto;
    padding-right: 8px;
    padding-left: 8px;
}

.container::after {
    display: table;
    clear: both;
    content: "";
}

.container {
    width: 90%;
    padding-left: 5% !important;
    padding-right: 5% !important;
}

@media (min-width: 600px) {
    .container {
        width: 94%;
        padding-left: 3% !important;
        padding-right: 3% !important;
    }
}

.options-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 1rem;
}

@media (max-width: 500px) {
    .options-container {
        flex-direction: column;
        /* gap: 10px; */
    }
}
</style>
