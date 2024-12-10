import type { Dialog } from 'mdui/components/dialog.js';

import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import { dialog } from 'mdui/functions/dialog.js';
import { LogHelper } from './LogHelper';

const settingsDialog: Dialog = document.querySelector('#settings')!;

const logHelper: LogHelper = LogHelper.getInstance();

/**
 * 发送一个通知
 * @param title 通知标题
 * @param content 通知内容
 */
export function sendAppNotification(title: string, content: string) {
    if (VARIANT === 'desktop') {
        // 桌面端适配 Tauri
        sendNotificationDesktop(title, content);
    } else {
        if (navigator.serviceWorker.controller) {
            // PWA 环境
            sendNotificationPWA(title, content);
        } else {
            // 普通浏览器环境
            sendNotificationBrowser(title, content);
        }
    }
}

/**
 * 在 PWA 中发送一条通知
 * * 通知默认带 Hash Checker 应用图标
 * * 在发送前自动检查通知权限是否获取，没有获取则显示提示框
 * @param title 通知标题
 * @param content 通知内容
 */
function sendNotificationPWA(title: string, content: string) {
    const options = {
        body: content,
        icon: "./icon-512.png",
        lang: "zh-Hans-CN"
    }
    navigator.serviceWorker.ready.then((registration) => {
        if (Notification.permission === 'granted') {
            registration.showNotification(title, options);
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

/**
 * 在浏览器中发送一条通知
 * * 通知默认带 Hash Checker 应用图标
 * * 在发送前自动检查通知权限是否获取，没有获取则显示提示框
 * * 用户点击通知支持自动返回（聚焦）Hash Checker 标签页（窗口）
 * @param title 通知标题
 * @param content 通知内容
 */
function sendNotificationBrowser(title: string, content: string) {
    if (Notification.permission === 'granted') {
        const options = {
            body: content,
            icon: "./icon-512.png",
            lang: "zh-Hans-CN"
        }
        const notification = new Notification(title, options);
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

/**
 * 在 Tauri 中发送一条通知
 * * 通知默认带 Hash Checker 应用图标
 * * 在发送前自动检查通知权限是否获取，没有获取则提示用户授予权限并显示提示框
 * @param title 通知标题
 * @param content 通知内容
 */
async function sendNotificationDesktop(title: string, content: string) {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
        sendNotification({
            title: title,
            body: content,
            icon: "./icon-512.png"
        })
    }
}

/**
 * 显示提示用户授予通知权限的对话框
 */
function showPermissionDeniedDialog() {
    logHelper.log("没有获取到通知权限");
    settingsDialog.open = false;
    dialog({
        headline: '错误',
        description: '请先授予通知权限',
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