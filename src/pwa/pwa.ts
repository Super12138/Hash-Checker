import { snackbar } from "mdui/functions/snackbar.js";
import { registerSW } from 'virtual:pwa-register';

/**
 * 初始化 PWA
 */
export function initPWA() {
    let refreshSW: (reloadPage?: boolean) => Promise<void> | undefined;

    let swActivated = false;
    // 每小时检查一次更新
    const period = 60 * 60 * 1000;

    window.addEventListener('load', () => {
        refreshSW = registerSW({
            immediate: true,
            onOfflineReady() {
                snackbar({
                    message: "Hash Checker 已准备好在离线环境下运行"
                });
            },
            onNeedRefresh() {
                snackbar({
                    message: "Hash Checker 有新版本",
                    action: "立即更新",
                    onActionClick: () => {
                        refreshSW?.(true)
                        true
                    }
                });
            },
            onRegisteredSW(swUrl, r) {
                if (period <= 0) return;

                if (r?.active?.state === 'activated') {
                    swActivated = true
                    registerPeriodicSync(period, swUrl, r)
                }
                else if (r?.installing) {
                    r.installing.addEventListener('statechange', (e) => {
                        const sw = e.target as ServiceWorker
                        swActivated = sw.state === 'activated'
                        if (swActivated)
                            registerPeriodicSync(period, swUrl, r)
                    })
                }
            },
        });
    });
}

/**
 * 定时进行同步检查，可根据需要修改时间间隔
 * @param period 检查时间间隔
 * @param swUrl Service Worker URL
 * @param r ServiceWorkerRegistration
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
    if (period <= 0) return

    setInterval(async () => {
        if ('onLine' in navigator && !navigator.onLine)
            return

        const resp = await fetch(swUrl, {
            cache: 'no-store',
            headers: {
                'cache': 'no-store',
                'cache-control': 'no-cache',
            },
        })

        if (resp?.status === 200)
            await r.update()
    }, period);
}

/**
 * 清除缓存并重新加载页面
 */
export function clearCacheAndReload() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (let registration of registrations) {
                registration.unregister();
            }
        });
    }
    if ('caches' in window) {
        caches.keys().then((names) => {
            for (let name of names)
                caches.delete(name);
        });
    }
    window.location.reload();
}