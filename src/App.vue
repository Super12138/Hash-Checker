<script setup lang="ts">
// MDUI 组件
import "mdui/components/button.js";
import "mdui/components/layout-main.js";
import "mdui/components/layout.js";
import "mdui/components/text-field.js";

// MDUI 图标
// ...

// 自定义组件
import HashTopBar from "./components/main/HashTopBar.vue";
import FileOutputDrawer from "./components/file/FileOutputDrawer.vue";
import SettingsDrawer from "./components/settings/SettingsDrawer.vue";

// Vue 导入
import { onMounted } from "vue";
import FileSelector from "./components/main/FileSelector.vue";
import ClipboardSelector from "./components/main/ClipboardCheckbox.vue";
import AlgorithmDropdown from "./components/main/AlgorithmSelect.vue";
import ModeDropdown from "./components/main/ModeSelect.vue";

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
        <mdui-layout-main class="container">
            <FileSelector />
            <ClipboardSelector />
            <div>
                <AlgorithmDropdown />
                <ModeDropdown />
            </div>
            <mdui-text-field label="校验值" helper="在此处粘贴您获取到的校验值" clearable></mdui-text-field>
            <mdui-button full-width>检查</mdui-button>
        </mdui-layout-main>
    </mdui-layout>
    <FileOutputDrawer :open="false" @close="" />
    <SettingsDrawer :open="false" @close="" />
</template>

<style lang="css">
mdui-layout {
    height: 100vh;
}
</style>
