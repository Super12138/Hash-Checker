<script setup lang="ts">
import "mdui/components/list-item.js";

import "@mdui/icons/delete-forever--outlined.js";

import { useI18n } from "vue-i18n";
import { ref } from "vue";
import SimpleDialog from "@/components/shared/SimpleDialog.vue";

const { t } = useI18n();
const dialogOpen = ref(false);

const resetApp = () => {
    localStorage.clear();
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (let registration of registrations) {
                registration.unregister();
            }
        });
    }
    if ("caches" in window) {
        caches.keys().then((names) => {
            for (let name of names) caches.delete(name);
        });
    }
    window.location.reload();
};
</script>

<template>
    <mdui-list-item :headline="t('settings.reset.label')" @click="dialogOpen = true">
        <mdui-icon-delete-forever--outlined slot="icon"></mdui-icon-delete-forever--outlined>
    </mdui-list-item>
    <Teleport to="body">
        <SimpleDialog
            headline="警告"
            description="即将重置应用，重置应用后缓存、个人设置都将被清除，应用将恢复到初始状态。此外，重置后应用将会立即重载以应用数据，确定继续？"
            v-model="dialogOpen"
            :close-on-overlay-click="true"
            :enable-cancel-button="true"
            @confirm="resetApp()"
        />
    </Teleport>
</template>
