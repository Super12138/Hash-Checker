import { shell, ipcRenderer } from "electron";
import { calc } from "./utils/calc";
import { getfileinfo, getfile, sendfile } from "./file/file";
import { getValue, setValue, deleteAllValue } from "./store/store";
import { sendNotification } from "./utils/notification";
import { update } from "./utils/update";
import { simpleDialog } from "./utils/dialog";

// mdui
import 'mdui/components/button.js';

import 'mdui/components/dialog.js';
import { dialog } from 'mdui/functions/dialog.js';

import 'mdui/components/select.js';
import 'mdui/components/menu-item.js';

import 'mdui/components/switch.js';

import 'mdui/components/checkbox.js';

import 'mdui/components/layout.js';
import 'mdui/components/layout-item.js';
import 'mdui/components/layout-main.js';

import { setColorScheme } from 'mdui/functions/setColorScheme.js';

import 'mdui/components/linear-progress.js';

let isOnlyAbout = false;

const openfilebtn = document.querySelector("#openfile");
const fileinput = document.querySelector('#getfile');
const calcbtn = document.querySelector('#calcbtn');
const dragtip = document.querySelector('#dragtip');
// const toggleDarkMode = document.querySelector('#toggleDarkMode');

const mbUnit = document.querySelector('#mbunit');
const cacheSize = document.querySelector('#cachesize');
const sysNotification = document.querySelector('#isSystemNotification');

const deleteCacheBtn = document.querySelector('#deleteCache');
const deleteCookiesBtn = document.querySelector('#deleteCookies');
const deleteAllDataBtn = document.querySelector('#deleteAllData');

const aboutBtn = document.querySelector('#aboutBtn');
const aboutCloseBtn = document.querySelector('#aboutCloseBtn');

const settingsSaveBtn = document.querySelector('#settingsSaveBtn');
const openSettingsBtn = document.querySelector('#settingsBtn');
const settingsCancelBtn = document.querySelector('#settingsCancelBtn');

const chooseColorBtn = document.querySelector('#chooseColorBtn');
const colorCancelBtn = document.querySelector('#colorCancelBtn');
const setColorBtn = document.querySelector('#setColorBtn');

const sendTestNotification = document.querySelector('#sendTestNotification');
const isStartupUpdate = document.querySelector('#isStartupUpdate');
const electronVer = document.querySelector('#electronVer');

const settingsDialog = document.querySelector('#settings');
const aboutDialog = document.querySelector('#about');
const colorDialog = document.querySelector('#colors');

const links = document.querySelectorAll('a[href]');
const dropzone = document.querySelector('#drop');

links.forEach((link) => {
    link.addEventListener('click', (e) => {
        const url = link.getAttribute('href');
        e.preventDefault();
        shell.openExternal(url);
    });
});

dropzone.addEventListener('dragover', (e) => {
    dragtip.style.display = "block";
    e.preventDefault();
});
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dragtip.style.display = "none";
    let file = e.dataTransfer.files[0];
    getfileinfo(file);
    sendfile(file);
});

window.addEventListener("load", async () => {
    const colorTheme = await getValue('dynamicColor');
    const checkUpdateValue = await getValue("checkUpdate");
    const firstUse = await getValue("fistUse");
    const mbunitValuenew = await getValue("mbUnit");
    const cacheSizeValuenew = await getValue("cacheSize");
    let isSystemNotificationValuenew = await getValue("systemNotification");
    let isStartupUpdateValuenew = await getValue("checkUpdate");

    console.log(`初次使用：${firstUse}`)
    console.log(mbunitValuenew, cacheSizeValuenew, isSystemNotificationValuenew, checkUpdateValue, colorTheme);

    if (colorTheme) {
        setColorScheme(colorTheme);
    }

    if (checkUpdateValue == true) {
        if (navigator.onLine) {
            console.log('在线状态');
            update();
        } else {
            console.log('离线状态');
        }
    }

    if (firstUse == "1") {
        if (mbunitValuenew == undefined) {
            setValue("mbUnit", "1024");
        } else if (cacheSizeValuenew == undefined) {
            setValue("cacheSize", "128");
        } else if (isSystemNotificationValuenew == undefined) {
            setValue("systemNotification", false);
        } else if (isStartupUpdate == undefined) {
            setValue("checkUpdate", true)
        } else {
            if (isSystemNotificationValuenew === true) {
                isSystemNotificationValuenew = true;
                sendTestNotification.style.display = "block";
            } else {
                isSystemNotificationValuenew = false;
                sendTestNotification.style.display = "none";
            }
        }
        mbUnit.value = mbunitValuenew;
    }
    else {
        setValue("fistUse", "1");
        setValue("mbUnit", "1024");
        setValue("cacheSize", "128");
        setValue("systemNotification", false);
        setValue("checkUpdate", true);
        mbUnit.value = 1024;
        window.location.reload(true);
        return;
    }
    mbUnit.value = mbunitValuenew;
    cacheSize.value = cacheSizeValuenew;
    sysNotification.checked = isSystemNotificationValuenew;
    isStartupUpdate.checked = isStartupUpdateValuenew;

    electronVer.innerHTML = `Electron 版本：${process.versions.electron}`;
    document.body.classList.add('ready');
});


openfilebtn.addEventListener('click', () => {
    document.querySelector('#getfile').click();
})

fileinput.addEventListener('change', () => {
    const file = document.querySelector('#getfile').files[0];
    getfileinfo(file);
    sendfile(file);
})

calcbtn.addEventListener('click', () => {
    const file = getfile();
    const cacheSizecheck = getValue("cacheSize");
    const method = document.querySelector('#method').value;
    const patternValue = document.querySelector('#mod').value;
    const checkSumInputValue = document.querySelector('#a').value;
    if (!file || file.length == 0) {
        simpleDialog('错误', '请选择文件', '确定');
        return;
    }
    if (cacheSizecheck == "") {
        simpleDialog('错误', '分片单次缓存大小不能为空，请前往设置进行设置', '确定');
        return;
    }
    if (cacheSizecheck == "0") {
        simpleDialog('错误', '分片单次缓存大小不能为“0”，请前往设置进行设置', '确定');
        return;
    }
    if (method == "nullselect" && patternValue == "nullselect") {
        simpleDialog('错误', '请选择方法及模式', '确定');
        return;
    }
    if (patternValue == "nullselect") {
        simpleDialog('错误', '请选择模式', '确定');
        return;
    }
    if (method == "nullselect") {
        simpleDialog('错误', '请选择方法', '确定');
        return;
    }
    if (patternValue == "gen") {
        if (method == "nullselect") {
            simpleDialog('错误', '请选择方法', '确定');
            return;
        }
        console.log(patternValue + method + file)
        calc(patternValue, method, file);
    } else {
        if (!checkSumInputValue) {
            simpleDialog('错误', '请输入校验值', '确定');
            return;
        }
        console.log(patternValue + method + file + checkSumInputValue)
        calc(patternValue, method, file, checkSumInputValue)
    }
})

settingsSaveBtn.addEventListener('click', async () => {
    const mbunitValue = mbUnit.value;
    const cacheSizeValue = cacheSize.value;
    const systemNotification = document.querySelector('#isSystemNotification').checked;
    const checkUpdate = document.querySelector('#isStartupUpdate').checked;

    if (cacheSizeValue == "0") {
        settingsDialog.open = false;
        dialog({
            headline: "错误",
            description: "分片单次缓存大小不能为“0”，请重新输入",
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
            headline: "错误",
            description: "分片单次缓存大小不能为空，请重新输入",
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
            headline: "错误",
            description: "分片单次缓存大小不能超过5位，请重新输入",
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
    setValue("mbUnit", mbunitValue)
    setValue("cacheSize", cacheSizeValue)
    setValue("systemNotification", systemNotification)
    setValue("checkUpdate", checkUpdate)
    settingsDialog.open = false;
})

openSettingsBtn.addEventListener('click', () => {
    isOnlyAbout = false;
    settingsDialog.open = true;
})

sysNotification.addEventListener('change', () => {
    if (sysNotification.checked) {
        sendTestNotification.style.display = "block";
        sendNotification("测试通知", "这是一个测试通知");
    }
    else {
        sendTestNotification.style.display = "none";
    }
})

sendTestNotification.addEventListener('click', () => {
    sendNotification("测试通知", "这是一个测试通知")
})

deleteCacheBtn.addEventListener('click', () => {
    settingsDialog.open = false;
    dialog({
        headline: '你真的要清除缓存吗',
        description: '这只适用于应用出现问题的情况',
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
                    simpleDialog('提示', '清除缓存成功，应用即将重载', '确定');
                    setTimeout(() => {
                        ipcRenderer.send('clear-cache');
                        window.location.reload(true);
                    }, 500);
                }
            }
        ]
    });
})

deleteCookiesBtn.addEventListener('click', () => {
    settingsDialog.open = false;
    dialog({
        headline: '你真的要清除本地数据吗',
        description: '这将会清除您的所有个人设置',
        actions: [
            {
                text: '取消',
                onClick: () => {
                    settingsDialog.open = true;
                }
            },
            {
                text: '清除本地数据',
                onClick: () => {
                    simpleDialog('提示', '清除本地数据成功，应用即将重载', '确定');
                    setTimeout(() => {
                        deleteAllValue();
                        setValue("fistUse", "0");
                        window.location.reload(true);
                    }, 500);
                }
            }
        ]
    });
})

deleteAllDataBtn.addEventListener('click', () => {
    settingsDialog.open = false;
    dialog({
        headline: '你真的要清除全部数据吗',
        description: '这将清除应用缓存和您的所有个人设置',
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
                    simpleDialog('提示', '清除所有数据成功，应用即将重载', '确定');
                    setTimeout(() => {
                        deleteAllValue();
                        setValue("fistUse", "0");
                        ipcRenderer.send('clear-cache');
                        window.location.reload(true);
                    }, 500);
                }
            }
        ]
    });
})

aboutBtn.addEventListener('click', () => {
    settingsDialog.open = false;
    aboutDialog.open = true;
})

aboutCloseBtn.addEventListener('click', () => {
    if (!isOnlyAbout) {
        settingsDialog.open = true;
        aboutDialog.open = false;
    } else {
        aboutDialog.open = false;
    }
})

/* toggleDarkMode.addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle();
    // document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light';
    if (isDarkMode) {
        toggleDarkMode.innerHTML = '<i class="mdui-icon material-icons">&#xe3a8;</i>';
    } else {
        toggleDarkMode.innerHTML = '<i class="mdui-icon material-icons">&#xe430;</i>';
    }
})

toggleDarkMode.addEventListener('mousedown', () => {
    setTimeout(async () => {
        await window.darkMode.system();
        toggleDarkMode.innerHTML = '<i class="mdui-icon material-icons">&#xe167;</i>';
    }, 3000);
}) */

ipcRenderer.on('openAboutDialog', (event) => {
    isOnlyAbout = true;
    aboutDialog.open = true;
})

settingsCancelBtn.addEventListener('click', () => {
    settingsDialog.open = false;
})

chooseColorBtn.addEventListener('click', () => {
    colorDialog.open = true;
})

colorCancelBtn.addEventListener('click', () => {
    colorDialog.open = false;
})

setColorBtn.addEventListener('click', () => {
    let dynamicColor = document.querySelector('#dynamicColor');
    setColorScheme(dynamicColor.value);
    colorDialog.open = false;
    setValue("dynamicColor", dynamicColor.value);
})