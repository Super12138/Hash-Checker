import { getfileinfo } from "./file/file";
import { calc } from "./file/hash";
import { clearStorage, getStorageItem, removeStorageItem, setStorageItem, setUpStorage } from './store/localstorage';
import { sendNotification } from "./utils/notification";
import { clearCacheAndReload } from "./utils/service-worker";
import { string2Boolean } from './utils/text';
import { getFile, sendFile } from './utils/transfer';

// mdui
import { dialog } from 'mdui/functions/dialog.js';
import { removeColorScheme } from 'mdui/functions/removeColorScheme.js';
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

import type { ButtonIcon } from 'mdui/components/button-icon.js';
import type { Button } from 'mdui/components/button.js';
import type { Dialog } from 'mdui/components/dialog.js';
import type { ListItem } from 'mdui/components/list-item.js';
import type { Select } from 'mdui/components/select.js';
import type { Switch } from 'mdui/components/switch.js';
import type { TextField } from 'mdui/components/text-field.js';

import 'mdui/components/button.js';
import 'mdui/components/checkbox.js';
import 'mdui/components/layout-item.js';
import 'mdui/components/layout-main.js';
import 'mdui/components/layout.js';
import 'mdui/components/menu-item.js';
import 'mdui/components/select.js';
import 'mdui/components/switch.js';
import 'mdui/components/tooltip.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/top-app-bar.js';
import 'mdui/mdui.css';

import '@mdui/icons/cleaning-services--outlined.js';
import '@mdui/icons/color-lens--outlined.js';
import '@mdui/icons/delete-forever--outlined.js';
import '@mdui/icons/info--outlined.js';
import '@mdui/icons/notifications-active--outlined.js';
import '@mdui/icons/settings--outlined.js';
import '@mdui/icons/storage--outlined.js';
import '@mdui/icons/update--outlined.js';

// PWA
import { initPWA } from "./pwa";
import { LogHelper } from "./utils/LogHelper";
import { getUpdate } from "./utils/updater";

const openFileBtn: Button = document.querySelector("#openFile")!;
const fileInput: HTMLInputElement = document.querySelector('#fileInput')!;
const checkFileBtn: Button = document.querySelector('#checkFile')!;
const dragTip: HTMLHeadingElement = document.querySelector('#dragTip')!;
const methodSelect: Select = document.querySelector('#method')!;
const modeSelect: Select = document.querySelector('#mode')!;
const checkSumInput: TextField = document.querySelector("#checkSumInput")!;

const openSettingsBtn: ButtonIcon = document.querySelector('#settingsBtn')!;
const cacheSize: Select = document.querySelector('#cacheSize')!;
const sysNotification: Switch = document.querySelector('#systemNotification')!;

const settingsSaveBtn: Button = document.querySelector('#settingsSaveBtn')!;
const settingsCancelBtn: Button = document.querySelector('#settingsCancelBtn')!;
const deleteCache: ListItem = document.querySelector('#deleteCache')!;
const deleteAllData: ListItem = document.querySelector('#deleteAllData')!;
const sendTestNotification: Button = document.querySelector('#sendTestNotification')!;
const aboutBtn: ListItem = document.querySelector('#aboutBtn')!;

const aboutCloseBtn: Button = document.querySelector('#aboutCloseBtn')!;

const chooseColorBtn: ButtonIcon = document.querySelector('#chooseColorBtn')!;
const colorCancelBtn: Button = document.querySelector('#colorCancelBtn')!;
const setColorBtn: Button = document.querySelector('#setColorBtn')!;
const resetColorBtn: Button = document.querySelector('#resetColorBtn')!;
const dynamicColor: HTMLInputElement = document.querySelector('#dynamicColor')!;

const settingsDialog: Dialog = document.querySelector('#settings')!;
const aboutDialog: Dialog = document.querySelector('#about')!;
const colorDialog: Dialog = document.querySelector('#colors')!;

const dropZone: HTMLBodyElement = document.querySelector('#drop')!;
const versionElement: HTMLParagraphElement = document.querySelector('#version')!;

const logHelper: LogHelper = LogHelper.getInstance();

// 拖拽文件
dropZone.addEventListener('dragover', (e: DragEvent) => {
    e.preventDefault();
    dragTip.style.display = "block";
});

dropZone.addEventListener('drop', (e: DragEvent) => {
    e.preventDefault();
    dragTip.style.display = "none";
    let file: File = e.dataTransfer!.files[0];
    getfileinfo(file);
    sendFile(file);
});

// 初始化
window.addEventListener("load", () => {
    initPWA();

    const isFirstUse: boolean = string2Boolean(getStorageItem("firstUse"));
    logHelper.log(getStorageItem("firstUse"));
    const cacheSizeValue: string = getStorageItem("cacheSize") as string;
    let systemNotification: boolean = string2Boolean(getStorageItem("systemNotification"));
    const autoUpdate: boolean = string2Boolean(getStorageItem("autoUpdate"));
    logHelper.log(`firstUse: ${isFirstUse}, cacheSize: ${cacheSizeValue}, notification: ${systemNotification}, autoUpdate: ${autoUpdate}`);

    if (isFirstUse) {
        setUpStorage();
        window.location.reload();
    }

    if (cacheSizeValue == "") {
        setStorageItem("cacheSize", "2048");
    }

    if (systemNotification) {
        sendTestNotification.style.display = "block";
    } else {
        sendTestNotification.style.display = "none";
    }

    cacheSize.value = cacheSizeValue;
    sysNotification.checked = systemNotification;

    if (VARIANT === "desktop") {
        const autoUpdateItem: ListItem = document.createElement('mdui-list-item');
        autoUpdateItem.headline = "自动更新";
        autoUpdateItem.description = "应用启动时将自动检查更新";
        const updateIcon = document.createElement('mdui-icon-update--outlined');
        updateIcon.slot = "icon";
        autoUpdateItem.appendChild(updateIcon);
        const updateSwitch: Switch = document.createElement('mdui-switch');
        updateSwitch.slot = "end-icon";
        updateSwitch.id = "autoUpdateSwitch";
        updateSwitch.checked = autoUpdate;
        autoUpdateItem.appendChild(updateSwitch);

        sendTestNotification.parentNode?.insertBefore(autoUpdateItem, sendTestNotification.nextSibling);
    }
    // APP_VERSION：全局环境变量
    versionElement.innerHTML = `版本：${VERSION_NAME}-${VARIANT}-${COMMIT_HASH} (${VERSION_CODE})`;
});

window.addEventListener('DOMContentLoaded', () => {
    const dynamicColorValue: string = getStorageItem("dynamicColor") as string;
    dynamicColor.value = dynamicColorValue;
    if (dynamicColorValue) {
        setColorScheme(dynamicColorValue);
    }
    document.body.classList.add('ready');

    getUpdate();
});

// 选择文件
openFileBtn.addEventListener('click', () => {
    fileInput.click();
});

// 获取文件
fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files.length > 0) {
        const file: File = fileInput.files[0];
        getfileinfo(file);
        sendFile(file);
    }
});

// 计算文件 Hash 值
checkFileBtn.addEventListener('click', () => {
    const file: File = getFile();
    const method: string | string[] = methodSelect.value;
    const mode: string | string[] = modeSelect.value;
    const cacheSize: string = getStorageItem("cacheSize") as string;
    if (!file || file.size == 0) {
        dialog({
            headline: '错误',
            description: '请选择文件',
            actions: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }
    if (cacheSize == "") {
        dialog({
            headline: '错误',
            description: '分片单次缓存大小不能为空，请前往设置进行设置',
            actions: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }
    if (cacheSize == "0") {
        dialog({
            headline: '错误',
            description: '分片单次缓存大小不能为“0”，请前往设置进行设置',
            actions: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }
    if (method == "nullSelect" && mode == "nullSelect") {
        dialog({
            headline: '错误',
            description: '请选择方法及模式',
            actions: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }
    if (mode == "nullSelect" || mode == "") {
        dialog({
            headline: '错误',
            description: '请选择模式',
            actions: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }
    if (method == "nullSelect" || method == "") {
        dialog({
            headline: '错误',
            description: '请选择方法',
            actions: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }

    switch (mode) {
        case "generate":
            logHelper.log(mode + method + file);
            calc(mode, method.toString(), file);
            break;
        case "check":
            const checkSum: string = checkSumInput.value;

            if (!checkSum) {
                dialog({
                    headline: '错误',
                    description: '请输入校验值',
                    actions: [
                        {
                            text: '知道了'
                        }
                    ]
                });
                return;
            }
            logHelper.log(mode.toString() + method.toString() + file + checkSum);
            calc(mode.toString(), method.toString(), file, checkSum);
            break;
    }
});

// “设置”对话框
openSettingsBtn.addEventListener('click', () => {
    settingsDialog.open = true;
});

settingsSaveBtn.addEventListener('click', () => {
    const cacheSizeValue: string | string[] = cacheSize.value;
    const autoUpdateSwitch: Switch | null = document.querySelector('#autoUpdateSwitch');
    const autoUpdate = autoUpdateSwitch?.checked;
    if (cacheSizeValue == "0") {
        settingsDialog.open = false;
        dialog({
            headline: '错误',
            description: '分片单次缓存大小不能为“0”，请重新输入',
            actions: [
                {
                    text: '确定',
                    onClick: () => {
                        settingsDialog.open = true;
                    }
                }
            ]
        });
        return
    }

    if (cacheSizeValue == "") {
        settingsDialog.open = false;
        dialog({
            headline: '错误',
            description: '分片单次缓存大小不能为空，请重新输入',
            actions: [
                {
                    text: '确定',
                    onClick: () => {
                        settingsDialog.open = true;
                    }
                }
            ]
        });
        return;
    }

    if (cacheSizeValue.length > 10) {
        settingsDialog.open = false;
        dialog({
            headline: '错误',
            description: '分片单次缓存大小不能超过5位，请重新输入',
            actions: [
                {
                    text: '确定',
                    onClick: () => {
                        settingsDialog.open = true;
                    }
                }
            ]
        });
        return;
    }
    setStorageItem("cacheSize", cacheSizeValue.toString());
    setStorageItem("systemNotification", sysNotification.checked.toString());
    if (autoUpdate === undefined) {
        setStorageItem("autoUpdate", "false");
    } else {
        setStorageItem("autoUpdate", autoUpdate.toString());
    }
    settingsDialog.open = false;
});

settingsCancelBtn.addEventListener('click', () => {
    settingsDialog.open = false;
});

sysNotification.addEventListener('change', () => {
    if (!settingsDialog.open) return;
    if (sysNotification.checked) {
        sendNotification("测试通知", "这是一个测试通知");
        sendTestNotification.style.display = "block";
    }
    else {
        sendTestNotification.style.display = "none";
    }
});

sendTestNotification.addEventListener('click', () => {
    sendNotification("测试通知", "这是一个测试通知")
});

deleteCache.addEventListener('click', () => {
    settingsDialog.open = false;
    dialog({
        headline: '你真的要清除缓存吗',
        description: '这不会删除任何您的个人设置',
        actions: [
            {
                text: '取消',
                onClick: () => {
                    settingsDialog.open = true;
                }
            },
            {
                text: '清除缓存',
                onClick: () => {
                    dialog({
                        headline: '提示',
                        description: '清除缓存成功，应用即将重载',
                        actions: [
                            {
                                text: '确定'
                            }
                        ]
                    });
                    setTimeout(() => {
                        clearCacheAndReload();
                    }, 500);
                }
            }
        ]
    });
});

deleteAllData.addEventListener('click', () => {
    settingsDialog.open = false;
    dialog({
        headline: '是否清除全部应用数据',
        description: '这将清除应用缓存和您所有的个人设置',
        actions: [
            {
                text: '取消',
                onClick: () => {
                    settingsDialog.open = true;
                }
            },
            {
                text: '清除所有数据',
                onClick: () => {
                    dialog({
                        headline: '提示',
                        description: '清除所有数据成功，应用即将重载',
                        actions: [
                            {
                                text: '确定'
                            }
                        ]
                    });
                    setTimeout(() => {
                        clearStorage();
                        setUpStorage();
                        window.location.reload();
                    }, 500);
                }
            }
        ]
    });
});

// “关于” 对话框
aboutBtn.addEventListener('click', () => {
    settingsDialog.open = false;
    aboutDialog.open = true;
});

aboutCloseBtn.addEventListener('click', () => {
    settingsDialog.open = true;
    aboutDialog.open = false;
});


modeSelect.addEventListener('change', () => {
    switch (modeSelect.value) {
        case "check":
            checkSumInput.disabled = false;
            break;
        case "generate":
            checkSumInput.disabled = true;
            break;
        case "nullSelect":
            checkSumInput.disabled = true;
            break;
    }
});

checkSumInput.addEventListener('input', () => {
    switch (checkSumInput.value.length) {
        case 32:
            methodSelect.value = "MD5";
            break;
        case 40:
            methodSelect.value = "SHA1";
            break;
        case 64:
            methodSelect.value = "SHA256";
            break;
        case 96:
            methodSelect.value = "SHA384";
            break;
        default:
            methodSelect.value = "nullSelect";
            break;
    }
});

// MD3 主题色
chooseColorBtn.addEventListener('click', () => {
    colorDialog.open = true;
});

colorCancelBtn.addEventListener('click', () => {
    colorDialog.open = false;
    removeColorScheme();
});

resetColorBtn.addEventListener('click', () => {
    colorDialog.open = false;
    removeStorageItem("dynamicColor");
    removeColorScheme();
});

setColorBtn.addEventListener('click', () => {
    setColorScheme(dynamicColor.value);
    colorDialog.open = false;
    setStorageItem("dynamicColor", dynamicColor.value);
});

dynamicColor.addEventListener('input', () => {
    setColorScheme(dynamicColor.value);
});
