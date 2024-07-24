import { calc } from "./file/hash";
import { getfileinfo } from "./file/file";
import { sendFile, getFile } from './utils/transfer';
import { setStorageItem, getStorageItem, removeStorageItem, resetStorage } from './store/localstorage';
import { sendNotification } from "./utils/notification";
import { clearCacheAndReload } from "./utils/service-worker";
import { string2Boolean } from './utils/text';

// mdui
import { dialog } from 'mdui/functions/dialog.js';
import { setColorScheme } from 'mdui/functions/setColorScheme.js';
import { removeColorScheme } from 'mdui/functions/removeColorScheme.js';

import type { Button } from 'mdui/components/button.js';
import type { ButtonIcon } from 'mdui/components/button-icon.js';
import type { Select } from 'mdui/components/select.js';
import type { Dialog } from 'mdui/components/dialog.js';
import type { Switch } from 'mdui/components/switch.js';
import type { TextField } from 'mdui/components/text-field.js';

import 'mdui/components/button.js';
import 'mdui/components/checkbox.js';
import 'mdui/components/menu-item.js';
import 'mdui/components/select.js';
import 'mdui/components/switch.js';
import 'mdui/mdui.css'

// Icons
import '@mdui/icons/settings.js';
import '@mdui/icons/color-lens.js';
import { initPWA } from "./pwa";

const openFileBtn: Button = document.querySelector("#openFile")!;
const fileInput: HTMLInputElement = document.querySelector('#fileInput')!;
const checkFileBtn: Button = document.querySelector('#checkFile')!;
const dragTip: HTMLHeadingElement = document.querySelector('#dragTip')!;
const methodSelect: Select = document.querySelector('#method')!;
const modeSelect: Select = document.querySelector('#mode')!;
const checkSumInput: TextField = document.querySelector("#checkSumInput")!;

const openSettingsBtn: ButtonIcon = document.querySelector('#settingsBtn')!;
const mbUnit: Select = document.querySelector('#mbUnit')!;
const cacheSize: Select = document.querySelector('#cachesize')!;
const sysNotification: Switch = document.querySelector('#isSystemNotification')!;

const settingsSaveBtn: Button = document.querySelector('#settingsSaveBtn')!;
const settingsCancelBtn: Button = document.querySelector('#settingsCancelBtn')!;
const deleteCacheBtn: Button = document.querySelector('#deleteCache')!;
const deleteAllDataBtn: Button = document.querySelector('#deleteAllData')!;
const sendTestNotification: Button = document.querySelector('#sendTestNotification')!;

const aboutBtn: Button = document.querySelector('#aboutBtn')!;
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

    const mbUnitValue: string = getStorageItem("mbUnit") as string;
    const cacheSizeValue: string = getStorageItem("cacheSize") as string;
    let isSystemNotification: boolean = string2Boolean(getStorageItem("systemNotification") as string);
    console.log(mbUnitValue, cacheSizeValue, isSystemNotification);


    if (mbUnitValue == "") {
        setStorageItem("mbUnit", "1024");
    } else if (cacheSizeValue == "") {
        setStorageItem("cacheSize", "2048");
    }

    if (isSystemNotification) {
        sendTestNotification.style.display = "block";
    } else {
        sendTestNotification.style.display = "none";
    }

    mbUnit.value = mbUnitValue;
    cacheSize.value = cacheSizeValue;
    sysNotification.checked = isSystemNotification;
});

window.addEventListener('DOMContentLoaded', () => {
    const dynamicColorValue: string = getStorageItem("dynamicColor") as string;
    dynamicColor.value = dynamicColorValue;
    if (dynamicColorValue) {
        setColorScheme(dynamicColorValue);
    }
    document.body.classList.add('ready');
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
            console.log(mode + method + file);
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
            console.log(mode.toString() + method.toString() + file + checkSum);
            calc(mode.toString(), method.toString(), file, checkSum);
            break;
    }
});

// “设置”对话框
openSettingsBtn.addEventListener('click', () => {
    settingsDialog.open = true;
});

settingsSaveBtn.addEventListener('click', () => {
    const mbunitValue: string | string[] = mbUnit.value;
    const cacheSizeValue: string | string[] = cacheSize.value;
    const SystemNotification: boolean = sysNotification.checked;
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
    setStorageItem("mbUnit", mbunitValue.toString());
    setStorageItem("cacheSize", cacheSizeValue.toString());
    setStorageItem("systemNotification", SystemNotification.toString());
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
})

sendTestNotification.addEventListener('click', () => {
    sendNotification("测试通知", "这是一个测试通知")
});

deleteCacheBtn.addEventListener('click', () => {
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

deleteAllDataBtn.addEventListener('click', () => {
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
                        resetStorage();
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