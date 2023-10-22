import { calc } from "./utils/calc";
import { getfileinfo, getfile, sendfile } from "./file/file";
import { getCookie, setCookie, deleteCookie } from "./cookie/cookie";
import { sendNotification } from "./utils/notification";

// mdui
import 'mdui/components/button.js';

import 'mdui/components/dialog.js';
import { dialog } from 'mdui/functions/dialog.js';

import 'mdui/components/select.js';
import 'mdui/components/menu-item.js';

import 'mdui/components/switch.js';

import 'mdui/components/checkbox.js';

import { setColorScheme } from 'mdui/functions/setColorScheme.js';

const openfilebtn = document.querySelector("#openfile");
const fileinput = document.querySelector('#getfile');
const calcbtn = document.querySelector('#calcbtn');
const dragtip = document.querySelector('#dragtip');

const openSettingsBtn = document.querySelector('#settingsBtn');
const mbUnit = document.querySelector('#mbunit');
const cacheSize = document.querySelector('#cachesize');
const sysNotification = document.querySelector('#isSystemNotification');

const settingsSaveBtn = document.querySelector('#settingsSaveBtn');
const settingsCancelBtn = document.querySelector('#settingsCancelBtn');

const deleteCacheBtn = document.querySelector('#deleteCache');
const deleteCookiesBtn = document.querySelector('#deleteCookies');
const deleteAllDataBtn = document.querySelector('#deleteAllData');

const aboutBtn = document.querySelector('#aboutBtn');
const aboutCloseBtn = document.querySelector('#aboutCloseBtn');
const sendTestNotification = document.querySelector('#sendTestNotification');

const chooseColorBtn = document.querySelector('#chooseColorBtn');
const colorCancelBtn = document.querySelector('#colorCancelBtn');
const setColorBtn = document.querySelector('#setColorBtn');

const settingsDialog = document.querySelector('#settings');
const aboutDialog = document.querySelector('#about');
const colorDialog = document.querySelector('#colors');

const exptime = 365.25 * 24 * 60 * 60 * 1000;
const expires = new Date(Date.now() + exptime).toUTCString();
let dropzone = document.querySelector('#drop');

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

window.addEventListener("load", () => {
    // firstUse，1为使用，0为第一次使用
    const firstUse = getCookie("firstUse");
    const mbunitValuenew = getCookie("mbUnit");
    const cacheSizeValuenew = getCookie("cacheSize");
    const dynamicColorValue = getCookie("dynamicColor");
    let isSystemNotificationValuenew = getCookie("SystemNotification");
    console.log(mbunitValuenew, cacheSizeValuenew, isSystemNotificationValuenew, dynamicColorValue, firstUse);

    if (dynamicColorValue) {
        setColorScheme(dynamicColorValue);
    }

    if (firstUse == 1) {
        if (mbunitValuenew == "") {
            setCookie("mbUnit", "1024", expires);
        } else if (cacheSizeValuenew == "") {
            setCookie("cacheSize", "128", expires);
        } else if (isSystemNotificationValuenew == "") {
            setCookie("SystemNotification", "false", expires);
            isSystemNotificationValuenew = false;
        } else {
            if (isSystemNotificationValuenew === "true") {
                isSystemNotificationValuenew = true;
                sendTestNotification.style.display = "block";
            } else {
                isSystemNotificationValuenew = false;
                sendTestNotification.style.display = "none";
            }
        }
    } else {
        setCookie("firstUse", 1, expires);
        setCookie("mbUnit", "1024", expires);
        setCookie("cacheSize", "128", expires);
        setCookie("SystemNotification", "false", expires);
        window.location.reload();
        return;
    }

    mbUnit.value = mbunitValuenew;
    cacheSize.value = cacheSizeValuenew;
    sysNotification.checked = isSystemNotificationValuenew;
    document.body.classList.add('ready');
});

openfilebtn.addEventListener('click', () => {
    document.querySelector('#getfile').click();
})

fileinput.addEventListener('change', () => {
    const file = document.querySelector('#getfile').files[0];
    getfileinfo(file)
    sendfile(file)
})

calcbtn.addEventListener('click', () => {
    const file = getfile();
    const method = document.querySelector('#method').value;
    const pattern = document.querySelector('#mod').value;
    const cacheSizecheck = getCookie("cacheSize");
    if (!file || file.length == 0) {
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
    if (cacheSizecheck == "") {
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
    if (cacheSizecheck == "0") {
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
    if (method == "nullselect" && pattern == "nullselect") {
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
    if (pattern == "nullselect") {
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
    if (method == "nullselect") {
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
    if (pattern == "gen") {
        if (method == "nullselect") {
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
        console.log(pattern + method + file)
        calc(pattern, method, file);
    } else {
        const inpc = document.getElementById('a').value;
        if (!inpc) {
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
        console.log(pattern + method + file + inpc)
        calc(pattern, method, file, inpc)
    }
})


settingsSaveBtn.addEventListener('click', () => {
    const mbunitValue = mbUnit.value;
    const cacheSizeValue = cacheSize.value;
    const SystemNotification = document.querySelector('#isSystemNotification').checked;
    if (cacheSizeValue == "0") {
        settingsDialog.open = false;
        dialog({
            headline: '错误',
            description: '分片单次缓存大小不能为“0”，请重新输入',
            modal: true,
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
            modal: true,
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
            modal: true,
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
    setCookie("mbUnit", mbunitValue, expires);
    setCookie("cacheSize", cacheSizeValue, expires);
    setCookie("SystemNotification", SystemNotification, expires);
    settingsDialog.open = false;
})

openSettingsBtn.addEventListener('click', () => {
    settingsDialog.open = true;
})

sysNotification.addEventListener('change', () => {
    if (sysNotification.checked) {
        if (Notification.permission === 'granted') {
            console.log("用户之前同意过通知权限")
            sendTestNotification.style.display = "block";
            sendNotification("测试通知", "这是一个测试通知")
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    sendTestNotification.style.display = "block";
                    console.log("用户同意了通知权限");
                    sendNotification("测试通知", "这是一个测试通知");
                }
                else {
                    console.log("没有获取到通知权限");
                    sendTestNotification.style.display = "none";
                    settingsDialog.open = false;
                    dialog({
                        headline: '错误',
                        description: '您没有同意开启通知权限，本应用无法发送通知，请重新尝试',
                        modal: true,
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
            });
        }
    }
    else {
        sendTestNotification.style.display = "none";
    }
})

sendTestNotification.addEventListener('click', () => {
    if (Notification.permission === 'granted') {
        console.log("用户之前同意过通知权限")
        sendNotification("测试通知", "这是一个测试通知")
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log("用户同意了通知权限");
                sendNotification("测试通知", "这是一个测试通知");
            }
            else {
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
        });
    }
})

deleteCacheBtn.addEventListener('click', () => {
    settingsDialog.open = false;
    dialog({
        headline: '你真的要清除缓存吗',
        description: '这只适用于网站无法正常更新的情况',
        modal: true,
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
                        description: '清除缓存成功，页面即将重载',
                        actions: [
                            {
                                text: '确定'
                            }
                        ]
                    });
                    setTimeout(() => {
                        localStorage.clear();
                        sessionStorage.clear();
                        caches.keys().then(keys => Promise.all(
                            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
                        ));
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
        headline: '你真的要清除 Cookies 吗',
        description: '这也将清除您的所有个人设置',
        modal: true,
        actions: [
            {
                text: '取消',
                onClick: () => {
                    settingsDialog.open = true;
                }
            },
            {
                text: '清除 Cookies',
                onClick: () => {
                    dialog({
                        headline: '提示',
                        description: '清除 Cookies 成功，页面即将重载',
                        actions: [
                            {
                                text: '确定'
                            }
                        ]
                    });
                    setTimeout(() => {
                        deleteCookie();
                        setCookie('firstUse', 0, expires);
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
        description: '这将清除网站缓存和您的所有个人设置',
        modal: true,
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
                        description: '清除所有数据成功，页面即将重载',
                        actions: [
                            {
                                text: '确定'
                            }
                        ]
                    });
                    setTimeout(() => {
                        deleteCookie();
                        localStorage.clear();
                        sessionStorage.clear();
                        caches.keys().then(keys => Promise.all(
                            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
                        ));
                        setCookie('firstUse', 0, expires);
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
    settingsDialog.open = true;
    aboutDialog.open = false;
})

settingsCancelBtn.addEventListener('click', () => {
    settingsDialog.open = false;
})

// MD3 主题色
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
    setCookie("dynamicColor", dynamicColor.value, expires);
})