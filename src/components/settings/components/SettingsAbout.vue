<script setup lang="ts">
import "mdui/components/list-item.js";

import "@mdui/icons/info--outlined.js";

import { computed, ref, Teleport } from "vue";

import RichDialog from "@/components/shared/RichDialog.vue";

const dialogOpen = ref(false);

const version = computed(() => {
    return `版本：${VERSION_NAME}-${VARIANT}-${COMMIT_HASH} (${VERSION_CODE})${STORE ? " [store]" : ""}`;
});
</script>

<template>
    <mdui-list-item headline="关于" @click="dialogOpen = true">
        <mdui-icon-info--outlined slot="icon"></mdui-icon-info--outlined>
    </mdui-list-item>
    <Teleport to="body">
        <RichDialog headline="关于" v-model="dialogOpen" :enable-cancel-button="false">
            <p>{{ version }}</p>
        </RichDialog>
    </Teleport>
</template>
