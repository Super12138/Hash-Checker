<script setup lang="ts">
import "mdui/components/button-icon.js";
import "mdui/components/list.js";
import "mdui/components/navigation-drawer.js";

import "@mdui/icons/close--outlined.js";

import { useI18n } from "vue-i18n";

import EmptyTip from "../shared/EmptyTip.vue";
import FadeOutInTransition from "../shared/FadeOutInTransition.vue";
import FileOutputItem from "./FileOutputItem.vue";

import type { FileItem } from "./FileItem";
import { useTemplateRef } from "vue";
import type { NavigationDrawer } from "mdui/components/navigation-drawer.js";

defineProps<{ fileList: FileItem[] }>();

defineEmits<{
    close: () => void;
}>();
const open = defineModel<boolean>({ required: true });

const { t } = useI18n();
const fileDrawer = useTemplateRef<NavigationDrawer>("file-drawer");

const onClosed = () => {
    open.value = false;
};

const closeDrawer = () => {
    if (fileDrawer.value) {
        fileDrawer.value.open = false;
    }
};
</script>

<template>
    <mdui-navigation-drawer
        placement="left"
        close-on-esc
        close-on-overlay-click
        :open="open"
        ref="file-drawer"
        @closed="onClosed()"
    >
        <div class="drawer-title">
            <span>{{ t("file-list.label") }}</span>
            <mdui-button-icon @click="closeDrawer()">
                <mdui-icon-close--outlined></mdui-icon-close--outlined>
            </mdui-button-icon>
        </div>
        <FadeOutInTransition>
            <EmptyTip :tip="t('file-list.empty-tip')" v-if="fileList.length == 0" />
            <mdui-list v-else>
                <FileOutputItem v-for="file in fileList" :key="file.addTime" :file-item="file" />
            </mdui-list>
        </FadeOutInTransition>
    </mdui-navigation-drawer>
</template>
