<script setup lang="ts">
import 'mdui/components/snackbar.js';

import { useRegisterSW } from "virtual:pwa-register/vue";
import { ref } from "vue";

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
});
</script>

<template>
    <mdui-snackbar :open="offlineReady">Super Hash 已准备好在离线环境下运行</mdui-snackbar>
    <mdui-snackbar :open="needRefresh">
        Super Hash 有新版本
        <mdui-button slot="action" variant="text" @click="updateServiceWorker()">立即更新</mdui-button>
    </mdui-snackbar>
</template>
