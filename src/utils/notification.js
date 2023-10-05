export function sendNotification(title, content) {
    const options = {
        body: content,
        lang: "zh-Hans-CN",
        icon: "icons/icon-512.png",
    };

    const notification = new Notification(title, options);
    notification.addEventListener('click', () => {
        window.focus();
        notification.close();
    })
}