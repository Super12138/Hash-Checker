export function sendNotification(title, content) {
    const options = {
        body: content,
        lang: "zh-Hans-CN",
    }
    const notification = new Notification(title, options);
}