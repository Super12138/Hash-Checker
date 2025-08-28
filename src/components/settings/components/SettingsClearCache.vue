<script setup lang="ts">
import "mdui/components/list-item.js";

import "@mdui/icons/cleaning-services--outlined.js";

import { useI18n } from "vue-i18n";
import { ref, Teleport } from "vue";
import SimpleDialog from "@/components/shared/SimpleDialog.vue";

const { t } = useI18n();
const dialogOpen = ref(false);

const clearCache = () => {
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
    <mdui-list-item :headline="t('settings.clear-cache.label')" @click="dialogOpen = true">
        <mdui-icon-cleaning-services--outlined slot="icon"></mdui-icon-cleaning-services--outlined>
    </mdui-list-item>
    <Teleport to="body">
        <SimpleDialog
            :headline="t('tip')"
            :description="t('settings.clear-cache.dialog.description')"
            v-model="dialogOpen"
            :close-on-overlay-click="true"
            :enable-cancel-button="true"
            @confirm="clearCache()"
        />
    </Teleport>
</template>
