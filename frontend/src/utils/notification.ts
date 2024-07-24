import { dialog } from 'mdui/functions/dialog.js';
import type { Dialog } from 'mdui/components/dialog.js';

const settingsDialog: Dialog = document.querySelector('#settings')!;

/**
 * 发送一个通知
 * @param title 通知标题
 * @param content 通知内容
 */
export function sendNotification(title: string, content: string) {
    
    if (navigator.serviceWorker.controller) {
        // PWA 环境
        sendNotificationPWA(title, content);
    } else {
        // 普通浏览器环境
        sendNotificationBrowser(title, content);
    }
}

function sendNotificationPWA(title: string, content: string) {
    navigator.serviceWorker.ready.then((registration) => {
        if (Notification.permission === 'granted') {
            registration.showNotification(title, {
                body: content,
                icon: "./icon-512.png",
                lang: "zh-Hans-CN"
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    registration.showNotification(title, {
                        body: content,
                        icon: "./icon-512.png",
                        lang: "zh-Hans-CN"
                    });
                } else {
                    showPermissionDeniedDialog();
                }
            });
        }
    });
}

function sendNotificationBrowser(title: string, content: string) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: content,
            icon: "./icon-512.png",
            lang: "zh-Hans-CN"
        });
        notification.addEventListener('click', () => {
            window.focus();
            notification.close();
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                sendNotificationBrowser(title, content);
            } else {
                showPermissionDeniedDialog();
            }
        });
    }
}

function showPermissionDeniedDialog() {
    console.log("没有获取到通知权限");
    settingsDialog.open = false;
    dialog({
        headline: '错误',
        description: '请先开启通知权限，再点击本按钮',
        actions: [
            {
                text: '确定',
                onClick: () => {
                    settingsDialog.open = true;
                }
            }
        ]
    });
}