export function sendNotification(title, content) {
    const options = {
        body: content,
        lang: "zh-Hans-CN",
    };

    if ('Notification' in window && 'serviceWorker' in navigator) {
        if (Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(title, options);
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    navigator.serviceWorker.ready.then(function (registration) {
                        registration.showNotification(title, options);
                    });
                }
            });
        }
    } else {
        console.log('浏览器不支持通知');
    }
}