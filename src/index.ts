import { getfileinfo } from "./file/file";
import { calc } from "./file/hash";
import { clearStorage, getStorageItem, removeStorageItem, setStorageItem, setUpStorage } from './store/localstorage';
import { sendAppNotification } from "./utils/notification";
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

// Icons
import '@mdui/icons/cleaning-services--outlined.js';
import '@mdui/icons/color-lens--outlined.js';
import '@mdui/icons/delete-forever--outlined.js';
import '@mdui/icons/info--outlined.js';
import '@mdui/icons/notifications-active--outlined.js';
import '@mdui/icons/settings--outlined.js';
import '@mdui/icons/storage--outlined.js';
import '@mdui/icons/tips-and-updates--outlined.js';
import '@mdui/icons/update--outlined.js';

// PWA
import { initPWA } from "./pwa/pwa";
import { getUpdate } from "./utils/updater";

import { LogHelper } from "./utils/LogHelper";

// driver.js
// import "driver.js/dist/driver.css";

// 页面内容
const dropZone: HTMLBodyElement = document.querySelector('#drop')!;
const dragTip: HTMLHeadingElement = document.querySelector('#dragTip')!;
const openFileBtn: Button = document.querySelector("#openFile")!;
const fileInput: HTMLInputElement = document.querySelector('#fileInput')!;
const methodSelect: Select = document.querySelector('#method')!;
const modeSelect: Select = document.querySelector('#mode')!;
const checkSumInput: TextField = document.querySelector("#checkSumInput")!;
const checkFileBtn: Button = document.querySelector('#checkFile')!;

// 设置部分
const settingsDialog: Dialog = document.querySelector('#settings')!;
const openSettingsBtn: ButtonIcon = document.querySelector('#settingsBtn')!;
const settingsSaveBtn: Button = document.querySelector('#settingsSaveBtn')!;
const settingsCancelBtn: Button = document.querySelector('#settingsCancelBtn')!;
const cacheSize: Select = document.querySelector('#cacheSize')!;
const lengthSuggest: Switch = document.querySelector('#lengthSuggest')!;
const sysNotification: Switch = document.querySelector('#systemNotification')!;
const sendTestNotification: Button = document.querySelector('#sendTestNotification')!;
const deleteCache: ListItem = document.querySelector('#deleteCache')!;
const deleteAllData: ListItem = document.querySelector('#deleteAllData')!;
// 关于部分
const aboutDialog: Dialog = document.querySelector('#about')!;
const aboutBtn: ListItem = document.querySelector('#aboutBtn')!;
const aboutCloseBtn: Button = document.querySelector('#aboutCloseBtn')!;
const versionElement: HTMLParagraphElement = document.querySelector('#version')!;
// 动态配色
const colorDialog: Dialog = document.querySelector('#colors')!;
const chooseColorBtn: ButtonIcon = document.querySelector('#chooseColorBtn')!;
const colorCancelBtn: Button = document.querySelector('#colorCancelBtn')!;
const setColorBtn: Button = document.querySelector('#setColorBtn')!;
const resetColorBtn: Button = document.querySelector('#resetColorBtn')!;
const dynamicColor: HTMLInputElement = document.querySelector('#dynamicColor')!;

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
    if (VARIANT !== "desktop") initPWA();

    const isFirstUse: boolean = string2Boolean(getStorageItem("firstUse", false));
    const cacheSizeValue: string = getStorageItem("cacheSize", 2048);
    const systemNotification: boolean = string2Boolean(getStorageItem("systemNotification", false));
    const lengthSuggestValue: boolean = string2Boolean(getStorageItem("lengthSuggest", true));
    const autoUpdate: boolean = string2Boolean(getStorageItem("autoUpdate", true));
    logHelper.log(`firstUse: ${isFirstUse}, cacheSize: ${cacheSizeValue}, notification: ${systemNotification}, suggest: ${lengthSuggest}`);

    if (isFirstUse) {
        setUpStorage();
    }

    if (cacheSizeValue === '') {
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
    if (VARIANT === "desktop") {
        logHelper.log(`autoUpdate: ${autoUpdate}`);
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

    /*const driverObj = driver({
        allowClose: false,
        showProgress: true,
        steps: [
            {
                element: '#drop',
                popover: {
                    title: '欢迎使用 Hash Checker',
                    description: '现在，让我们一起学习一下 Hash Checker 的使用方法'
                }
            },
            {
                element: '#openFile',
                popover: {
                    title: '选择文件',
                    description: '点击这个按钮就可以选择你要生成（校验）Hash 值的文件；或者你也可以拖动文件到本页'
                }
            },
            {
                element: '#method',
                popover: {
                    title: '选择方法',
                    description: 'Hash Checker 支持多种方法，你可以根据需要进行选择'
                }
            },
            {
                element: '#mode',
                popover: {
                    title: '选择模式',
                    description: '在这里选择生成还是校验一个文件的 Hash 值'
                }
            },
            {
                element: '#checkSumInput',
                popover: {
                    title: '输入校验值',
                    description: '如果你要校验一个文件，请在这里粘贴你获取到的校验值（需要选择校验模式）'
                }
            },
            {
                element: '#checkFile',
                popover: {
                    title: '计算文件 Hash 值',
                    description: '在上述步骤完成后，你只需点击这个按钮就可以计算文件的 Hash 值'
                }
            },
            {
                element: '#settingsBtn',
                popover: {
                    title: '还差一点',
                    description: '这是打开设置面板的按钮，点击它你可以对 Hash Checker 进行更多设置'
                }
            },
            {
                element: '#chooseColorBtn',
                popover: {
                    title: '最后一步',
                    description: '点击它就可以对应用主题色进行设置'
                }
            },
            {
                element: '#drop',
                popover: {
                    title: '大功告成',
                    description: '现在你已经学会 Hash Checker 的使用方法了，立即开始使用吧！'
                }
            }
        ]
    });*/
    
    // driverObj.drive();
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
    setStorageItem("lengthSuggest", lengthSuggest.checked);

    settingsDialog.open = false;
});

settingsCancelBtn.addEventListener('click', () => {
    settingsDialog.open = false;
});

sysNotification.addEventListener('change', () => {
    if (!settingsDialog.open) return;
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

// 关闭对话框
aboutCloseBtn.addEventListener('click', () => {
    settingsDialog.open = true;
    aboutDialog.open = false;
});


// 依据校验方法开启/禁用校验值输入框
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

// 依据输入的长度自动设置校验方法
checkSumInput.addEventListener('input', () => {
    if (string2Boolean(getStorageItem("lengthSuggest", true))) {
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