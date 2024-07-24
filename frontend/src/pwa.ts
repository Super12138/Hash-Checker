import { registerSW } from 'virtual:pwa-register';
import { snackbar } from "mdui/functions/snackbar.js";

export function initPWA() {
    let refreshSW: (reloadPage?: boolean) => Promise<void> | undefined

    let swActivated = false
    // 每小时检查一次更新
    const period = 60 * 60 * 1000

    refreshSW = registerSW({
        immediate: true,
        onOfflineReady() {
            snackbar({
                message: "Hash Checker 已准备好在离线环境下运行"
            })
        },
        onNeedRefresh() {
            snackbar({
                message: "Hash Checker 有新版本",
                action: "立即更新",
                onActionClick: () => refreshSW?.(true)
            });
        },
        onRegisteredSW(swUrl, r) {
            if (period <= 0) return

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
    })
}

/**
 * 每小时进行一次定期同步检查，可根据需要修改时间间隔
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
    }, period)
}
