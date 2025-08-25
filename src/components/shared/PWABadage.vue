<script setup lang="ts">
// import { snackbar } from 'mdui';
import "mdui/components/snackbar.js";

import { useRegisterSW } from "virtual:pwa-register/vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// check for updates every hour
const period = 60 * 60 * 1000;

const swActivated = ref(false);

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(swUrl: string, r: ServiceWorkerRegistration) {
    if (period <= 0) return;

    setInterval(async () => {
        if ("onLine" in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
            cache: "no-store",
            headers: {
                cache: "no-store",
                "cache-control": "no-cache",
            },
        });

        if (resp?.status === 200) await r.update();
    }, period);
}

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl, r) {
        if (period <= 0) return;
        if (r?.active?.state === "activated") {
            swActivated.value = true;
            registerPeriodicSync(swUrl, r);
        } else if (r?.installing) {
            r.installing.addEventListener("statechange", (e) => {
                const sw = e.target as ServiceWorker;
                swActivated.value = sw.state === "activated";
                if (swActivated.value) registerPeriodicSync(swUrl, r);
            });
        }
    },
    /* onOfflineReady() {
        snackbar({
            message: "Super Hash 已准备好在离线环境下运行",
        });
    },
    onNeedRefresh() {
        snackbar({
            message: "Super Hash 有新版本",
            action: "立即更新",
            onActionClick: () => updateServiceWorker(true),
        });
    }, */
});
</script>

<template>
    <mdui-snackbar :open="offlineReady">{{ t("pwa.offline-ready") }}</mdui-snackbar>
    <mdui-snackbar :open="needRefresh">
        {{ t("pwa.new-version.tip") }}
        <mdui-button slot="action" variant="text" @click="updateServiceWorker()">
            {{ t("pwa.new-version.action") }}
        </mdui-button>
    </mdui-snackbar>
</template>
