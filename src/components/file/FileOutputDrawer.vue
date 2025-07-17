<script setup lang="ts">
import "mdui/components/button-icon.js";
import "mdui/components/list.js";
import "mdui/components/navigation-drawer.js";

import "@mdui/icons/close--outlined.js";

import FileOutputItem from "./FileOutputItem.vue";

import { ref } from "vue";

const fileList = ref([1, 2, 3, 4, 5]);
</script>

<template>
    <mdui-navigation-drawer placement="left" close-on-esc close-on-overlay-click>
        <div class="drawer-title">
            <span>文件列表</span>
            <mdui-button-icon>
                <mdui-icon-close--outlined></mdui-icon-close--outlined>
            </mdui-button-icon>
        </div>
        <mdui-list>
            <FileOutputItem v-for="file in fileList" :key="file" />
        </mdui-list>
    </mdui-navigation-drawer>
</template>
