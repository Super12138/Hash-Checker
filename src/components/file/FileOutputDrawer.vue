<script setup lang="ts">
import "mdui/components/button-icon.js";
import "mdui/components/list.js";
import "mdui/components/navigation-drawer.js";

import "@mdui/icons/close--outlined.js";

import FileOutputItem from "./FileOutputItem.vue";

import { ref } from "vue";

defineProps<{
    open: boolean;
}>();

defineEmits<{
    close: () => void;
}>();

const fileList = ref([1, 2, 3, 4, 5]);
</script>

<template>
    <mdui-navigation-drawer placement="left" close-on-esc close-on-overlay-click :open="open">
        <div class="drawer-title">
            <span>文件列表</span>
            <mdui-button-icon @click="$emit('close')">
                <mdui-icon-close--outlined></mdui-icon-close--outlined>
            </mdui-button-icon>
        </div>
        <mdui-list>
            <!--TODO: 进行具体实现-->
            <FileOutputItem v-for="(file, index) in fileList" :key="file" :name="index.toString()" :status="`Item ${index}`" :progress="Math.random()" />
        </mdui-list>
    </mdui-navigation-drawer>
</template>
