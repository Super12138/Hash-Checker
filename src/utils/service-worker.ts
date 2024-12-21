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