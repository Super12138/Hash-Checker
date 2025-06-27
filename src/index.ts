import { clearStorage, getStorageItem, removeStorageItem, setStorageItem, setUpStorage } from './store/localstorage';
import { sendAppNotification } from "./utils/notification";
import { formatFileSize, isBlankOrEmpty, string2Boolean } from './utils/text';

// mdui
import { dialog } from 'mdui/functions/dialog.js';
import { setColorScheme } from 'mdui/functions/setColorScheme.js';

import type { ButtonIcon } from 'mdui/components/button-icon.js';
import type { Button } from 'mdui/components/button.js';
import type { Card } from 'mdui/components/card.js';
import type { Dialog } from 'mdui/components/dialog.js';
import type { ListItem } from 'mdui/components/list-item.js';
import type { List } from 'mdui/components/list.js';
import type { NavigationDrawer } from 'mdui/components/navigation-drawer.js';
import type { Select } from 'mdui/components/select.js';
import type { Switch } from 'mdui/components/switch.js';
import type { TextField } from 'mdui/components/text-field.js';

import 'mdui/components/button.js';
import 'mdui/components/card.js';
import 'mdui/components/checkbox.js';
import 'mdui/components/layout-item.js';
import 'mdui/components/layout-main.js';
import 'mdui/components/layout.js';
import 'mdui/components/menu-item.js';
import 'mdui/components/navigation-drawer.js';
import 'mdui/components/select.js';
import 'mdui/components/switch.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/top-app-bar.js';
import 'mdui/mdui.css';

// Icons
import '@mdui/icons/cleaning-services--outlined.js';
import '@mdui/icons/close--outlined.js';
import '@mdui/icons/color-lens--outlined.js';
import '@mdui/icons/delete-forever--outlined.js';
import '@mdui/icons/info--outlined.js';
import '@mdui/icons/menu--outlined.js';
import '@mdui/icons/notifications-active--outlined.js';
import '@mdui/icons/settings--outlined.js';
import '@mdui/icons/storage--outlined.js';
import '@mdui/icons/tips-and-updates--outlined.js';
import '@mdui/icons/update--outlined.js';
import '@mdui/icons/upload-file--outlined.js';

// PWA
import { clearCacheAndReload, initPWA } from "./pwa/pwa";
import { getUpdate } from "./utils/updater";

import { removeColorScheme } from "mdui";
import { BuildVariant, FileStatus, HashAlgorithm, OperationMode } from './constants';
import { FileItem } from "./file/FileItem";
import { LogHelper } from "./utils/LogHelper";

// 页面内容
const outputDrawer: NavigationDrawer = document.querySelector('#outputDrawer')!;
const openOutput: ButtonIcon = document.querySelector('#openOutput')!;
const closeOutput: ButtonIcon = document.querySelector('#closeOutput')!;
const dropZone: HTMLElement = document.body;
const fileCard: Card = document.querySelector('#fileCard')!;
const fileInfo: HTMLElement = document.querySelector('#fileInfo')!;
const fileInput: HTMLInputElement = document.querySelector('#fileInput')!;
const algorithmSelect: Select = document.querySelector('#algorithm')!;
const modeSelect: Select = document.querySelector('#mode')!;
const checkSumInput: TextField = document.querySelector("#checkSumInput")!;
const checkFileBtn: Button = document.querySelector('#checkFile')!;
const outputList: List = document.querySelector('#outputList')!;

// 设置部分
const settingsDrawer: NavigationDrawer = document.querySelector('#settingsDrawer')!;
const openSettingsBtn: ButtonIcon = document.querySelector('#openSettings')!;
const closeSettingsBtn: ButtonIcon = document.querySelector('#closeSettings')!;
const saveSettings: Button = document.querySelector('#saveSettings')!;
const cacheSize: Select = document.querySelector('#cacheSize')!;
const lengthSuggest: Switch = document.querySelector('#lengthSuggest')!;
const sysNotification: Switch = document.querySelector('#systemNotification')!;
const sendTestNotification: Button = document.querySelector('#sendTestNotification')!;
const deleteCache: ListItem = document.querySelector('#deleteCache')!;
const deleteAllData: ListItem = document.querySelector('#deleteAllData')!;

// 关于部分
const aboutDialog: Dialog = document.querySelector('#aboutDialog')!;
const aboutBtn: ListItem = document.querySelector('#openAbout')!;
const aboutCloseBtn: Button = document.querySelector('#closeAbout')!;
const versionElement: HTMLParagraphElement = document.querySelector('#version')!;

// 动态配色
const colorDialog: Dialog = document.querySelector('#colors')!;
const chooseColorBtn: ListItem = document.querySelector('#chooseColor')!;
const colorCancelBtn: Button = document.querySelector('#colorCancelBtn')!;
const setColorBtn: Button = document.querySelector('#setColorBtn')!;
const resetColorBtn: Button = document.querySelector('#resetColorBtn')!;
const dynamicColor: HTMLInputElement = document.querySelector('#dynamicColor')!;

const logHelper: LogHelper = LogHelper.getInstance();

let fileList: FileItem[] = [];

// 初始化
window.addEventListener("load", () => {
    if (VARIANT !== BuildVariant.Desktop) initPWA();

    const isFirstUse: boolean = string2Boolean(getStorageItem("firstUse", false));
    const cacheSizeValue: string = getStorageItem("cacheSize", 2048);
    const systemNotification: boolean = string2Boolean(getStorageItem("systemNotification", false));
    const lengthSuggestValue: boolean = string2Boolean(getStorageItem("lengthSuggest", true));
    const autoUpdate: boolean = string2Boolean(getStorageItem("autoUpdate", true));
    logHelper.log({ isFirstUse, cacheSizeValue, systemNotification, lengthSuggestValue });

    if (isFirstUse) {
        setUpStorage();
    }

    if (isBlankOrEmpty(cacheSizeValue)) {
        setStorageItem("cacheSize", 2048);
    }

    if (systemNotification) {
        sendTestNotification.style.display = "block";
    } else {
        sendTestNotification.style.display = "none";
    }

    cacheSize.value = cacheSizeValue;
    lengthSuggest.checked = lengthSuggestValue;
    sysNotification.checked = systemNotification;

    // 仅桌面端显示开关
    if (VARIANT === BuildVariant.Desktop) {
        logHelper.log({ autoUpdate });
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
    const dynamicColorValue: string = getStorageItem("dynamicColor", '') as string;
    dynamicColor.value = dynamicColorValue;
    if (dynamicColorValue) {
        setColorScheme(dynamicColorValue);
    }
    document.body.classList.add('ready');

    getUpdate();
});

openOutput.addEventListener('click', () => {
    toggleDrawer(outputDrawer, settingsDrawer);
});

closeOutput.addEventListener('click', () => {
    outputDrawer.open = !outputDrawer.open;
});

// 选择文件
fileCard.addEventListener('click', () => {
    fileInput.click();
});

const handleFileDrop = (event: DragEvent) =>{
    event.preventDefault();
    if (event.type === 'drop') {
        dropZone.classList.remove('dragover');
        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            const file: File = event.dataTransfer.files[0];
            fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
            logHelper.log(file);
            addFile(file);
        }
    } else if (event.type === 'dragleave') {
        dropZone.classList.remove('dragover');
    } else {
        dropZone.classList.add('dragover');
    }
}

dropZone.addEventListener("dragenter", handleFileDrop);
dropZone.addEventListener("dragover", handleFileDrop);
dropZone.addEventListener("drop", handleFileDrop);
dropZone.addEventListener("dragleave", handleFileDrop);

// 获取文件
fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files.length > 0) {
        const file: File = fileInput.files[0];
        fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
        logHelper.log(file);
        addFile(file);
    }
});

// 计算文件 Hash 值
checkFileBtn.addEventListener('click', () => {
    const algorithm: string | string[] = algorithmSelect.value;
    const mode: string | string[] = modeSelect.value;
    if (fileList.length === 0) {
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
    if (algorithm == HashAlgorithm.Unselected && mode == OperationMode.Unselected) {
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
    if (mode == OperationMode.Unselected || isBlankOrEmpty(mode.toString())) {
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
    if (algorithm == HashAlgorithm.Unselected || isBlankOrEmpty(algorithm.toString())) {
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
        case OperationMode.Generate:
            logHelper.log({ mode, algorithm });
            fileList[fileList.length - 1].getHash(mode, algorithm.toString());
            onlyOneDrawer(outputDrawer, settingsDrawer);
            break;
        case OperationMode.Check:
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
            logHelper.log({ mode, algorithm, checkSum });
            fileList[fileList.length - 1].getHash(mode.toString(), algorithm.toString(), checkSum);
            onlyOneDrawer(outputDrawer, settingsDrawer);
            break;
    }
});

// “设置”对话框
openSettingsBtn.addEventListener('click', () => {
    toggleDrawer(settingsDrawer, outputDrawer);
});

saveSettings.addEventListener('click', () => {
    const cacheSizeValue: string | string[] = cacheSize.value;
    const autoUpdateSwitch: Switch | null = document.querySelector('#autoUpdateSwitch');
    const autoUpdate = autoUpdateSwitch?.checked;
    if (cacheSizeValue == "0") {
        dialog({
            headline: '错误',
            description: '分片单次缓存大小不能为“0”，请重新输入',
            actions: [
                {
                    text: '确定',
                    onClick: () => {
                        true;
                    }
                }
            ]
        });
        return
    }

    if (isBlankOrEmpty(cacheSizeValue.toString())) {
        dialog({
            headline: '错误',
            description: '分片单次缓存大小不能为空，请重新输入',
            actions: [
                {
                    text: '确定',
                    onClick: () => {
                        true;
                    }
                }
            ]
        });
        return;
    }

    if (cacheSizeValue.length > 10) {
        dialog({
            headline: '错误',
            description: '分片单次缓存大小不能超过5位，请重新输入',
            actions: [
                {
                    text: '确定',
                    onClick: () => {
                        true;
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
    setStorageItem("lengthSuggest", lengthSuggest.checked);

    settingsDrawer.open = false;
});

closeSettingsBtn.addEventListener('click', () => {
    settingsDrawer.open = !settingsDrawer.open;
});

sysNotification.addEventListener('change', () => {
    if (!settingsDrawer.open) return;
    if (sysNotification.checked) {
        sendAppNotification("测试通知", "这是一个测试通知");
        sendTestNotification.style.display = "block";
    }
    else {
        sendTestNotification.style.display = "none";
    }
});

sendTestNotification.addEventListener('click', () => {
    sendAppNotification("测试通知", "这是一个测试通知");
});

deleteCache.addEventListener('click', () => {
    dialog({
        headline: '你真的要清除缓存吗',
        description: '这不会删除任何您的个人设置',
        actions: [
            {
                text: '取消',
                onClick: () => {
                    true;
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
    dialog({
        headline: '是否清除全部应用数据',
        description: '这将清除应用缓存和您所有的个人设置',
        actions: [
            {
                text: '取消',
                onClick: () => {
                    true;
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
    aboutDialog.open = true;
});

// 关闭对话框
aboutCloseBtn.addEventListener('click', () => {
    aboutDialog.open = false;
});

// 依据校验方法开启/禁用校验值输入框
modeSelect.addEventListener('change', () => {
    switch (modeSelect.value) {
        case OperationMode.Check:
            checkSumInput.disabled = false;
            break;
        case OperationMode.Generate:
            checkSumInput.disabled = true;
            break;
        case OperationMode.Unselected:
            checkSumInput.disabled = true;
            break;
    }
});

// 依据输入的长度自动设置校验方法
checkSumInput.addEventListener('input', () => {
    if (string2Boolean(getStorageItem("lengthSuggest", true))) {
        switch (checkSumInput.value.length) {
            case 32:
                algorithmSelect.value = HashAlgorithm.MD5;
                break;
            case 40:
                algorithmSelect.value = HashAlgorithm.SHA1;
                break;
            case 64:
                algorithmSelect.value = HashAlgorithm.SHA256;
                break;
            case 96:
                algorithmSelect.value = HashAlgorithm.SHA384;
                break;
            default:
                algorithmSelect.value = HashAlgorithm.Unselected;
                break;
        }
    }
});

// MD3 主题色
chooseColorBtn.addEventListener('click', () => {
    colorDialog.open = true;
});

// 取消，清除用户临时选择的主题色
colorCancelBtn.addEventListener('click', () => {
    colorDialog.open = false;
    removeColorScheme();
});

// 重置到默认颜色
resetColorBtn.addEventListener('click', () => {
    colorDialog.open = false;
    removeStorageItem("dynamicColor");
    removeColorScheme();
});

// 设置主题色
setColorBtn.addEventListener('click', () => {
    setColorScheme(dynamicColor.value);
    colorDialog.open = false;
    setStorageItem("dynamicColor", dynamicColor.value);
});

// 拖动取色器时自动更改当前主题色
dynamicColor.addEventListener('input', () => {
    setColorScheme(dynamicColor.value);
});

// 桌面端不显示右键菜单
window.addEventListener('contextmenu', (event: MouseEvent) => {
    if (VARIANT === BuildVariant.Desktop) event.preventDefault();
});

function addFile(file: File) {
    const fileItem = new FileItem(file);
    // 有重复文件则不添加
    if (fileList.find(item => item.file.name === file.name)) return;
    // 如果上一个文件状态为Waiting，就删除上一个，添加新的
    if (fileList.length > 0 && fileList[fileList.length - 1].status === FileStatus.WAITING) {
        fileList.pop();
        outputList.removeChild(outputList.lastChild!);
    }
    fileList.push(fileItem);
    outputList.appendChild(fileItem.html);
}

/**
 * 切换抽屉栏的打开与关闭
 * * 确保页面上只有一个抽屉栏的打开，避免页面显示错误
 *
 * @param openDrawer - 需要切换打开状态的抽屉栏
 * @param closeDrawer - 可能需要在打开时关闭的抽屉栏
 */
function toggleDrawer(openDrawer: NavigationDrawer, closeDrawer: NavigationDrawer) {
    openDrawer.open = !openDrawer.open;
    if (closeDrawer.open) {
        closeDrawer.open = !closeDrawer.open;
    }
}

/**
 * 只打开一个抽屉栏，同时保证另一个抽屉栏的关闭
 * 
 * @param openDrawer 要打开的抽屉栏
 * @param closeDrawer 要关闭的抽屉栏
 */
function onlyOneDrawer(openDrawer: NavigationDrawer, closeDrawer: NavigationDrawer) {
    openDrawer.open = true;
    if (closeDrawer.open) {
        closeDrawer.open = false;
    }
}