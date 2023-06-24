import { calc } from "./utils/calc";
import { getfileinfo, getfile, sendfile } from "./file/file";
import { getValue, setValue, deleteValue } from "./store/store";
import { sendNotification } from "./utils/notification";
import { shell } from "electron";

const openfilebtn = document.querySelector("#openfile");
const fileinput = document.querySelector('#getfile');
const calcbtn = document.querySelector('#calcbtn');
const dragtip = document.querySelector('#dragtip');

const openSettingsBtn = document.querySelector('#settingsBtn');
const mbUnit = document.querySelector('#mbunit');
const cacheSize = document.querySelector('#cachesize');
const sysNotification = document.querySelector('#isSystemNotification');
const saveBtn = document.querySelector('#saveBtn');
const deleteCacheBtn = document.querySelector('#deleteCache');
const deleteCookiesBtn = document.querySelector('#deleteCookies');
const deleteAllDataBtn = document.querySelector('#deleteAllData');
const aboutBtn = document.querySelector('#aboutBtn');
const aboutCloseBtn = document.querySelector('#aboutCloseBtn');
const sendTestNotification = document.querySelector('#sendTestNotification');

const settingsDialog = new mdui.Dialog('#settings');
const aboutDialog = new mdui.Dialog('#about');

const links = document.querySelectorAll('a[href]');
let dropzone = document.querySelector('#drop');

links.forEach(link => {
    link.addEventListener('click', e => {
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
    const firstUse = await getValue("fistUse");
    const mbunitValuenew = await getValue("mbUnit");
    const cacheSizeValuenew = await getValue("cacheSize");
    let isSystemNotificationValuenew = await getValue("SystemNotification");
    console.log(`初次使用：${firstUse}`)
    console.log(mbunitValuenew, cacheSizeValuenew, isSystemNotificationValuenew);

    if (firstUse == "1") {
        if (mbunitValuenew == undefined) {
            setValue("mbUnit", "1024");
        } else if (cacheSizeValuenew == undefined) {
            setValue("cacheSize", "128");
        } else if (isSystemNotificationValuenew == undefined) {
            setValue("SystemNotification", false);
            isSystemNotificationValuenew = false;
        } else {
            if (isSystemNotificationValuenew === true) {
                isSystemNotificationValuenew = true;
                sendTestNotification.style.display = "block";
            } else {
                isSystemNotificationValuenew = false;
                sendTestNotification.style.display = "none";
            }
        }
        for (let i = 0; i < mbUnit.options.length; i++) {
            if (mbUnit.options[i].value == mbunitValuenew) {
                mbUnit.options[i].selected = true;
                break;
            }
        }
    } 
    else {
        setValue("fistUse", "1");
        setValue("mbUnit", "1024");
        setValue("cacheSize", "128");
        setValue("SystemNotification", false);
        isSystemNotificationValuenew = false;
        for (let i = 0; i < mbUnit.options.length; i++) {
            if (mbUnit.options[i].value == "1024") {
                mbUnit.options[i].selected = true;
                break;
            }
        }
        window.location.reload(true);
    }
    mbUnit.value = mbunitValuenew;
    cacheSize.value = cacheSizeValuenew;
    sysNotification.checked = isSystemNotificationValuenew;
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
    const method = document.querySelector('#method').value;
    const pattern = document.querySelector('#mod').value;
    const cacheSizecheck = getValue("cacheSize");
    if (!file || file.length == 0) {
        mdui.dialog({
            title: '错误',
            content: '请选择文件',
            buttons: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }
    if (cacheSizecheck == "") {
        mdui.dialog({
            title: '错误',
            content: '分片单次缓存大小不能为空，请前往设置进行设置',
            buttons: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }
    if (cacheSizecheck == "0") {
        mdui.dialog({
            title: '错误',
            content: '分片单次缓存大小不能为“0”，请前往设置进行设置',
            buttons: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }
    if (method == "nullselect" && pattern == "nullselect") {
        mdui.dialog({
            title: '错误',
            content: '请选择方法及模式',
            buttons: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }
    if (pattern == "nullselect") {
        mdui.dialog({
            title: '错误',
            content: '请选择模式',
            buttons: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }
    if (method == "nullselect") {
        mdui.dialog({
            title: '错误',
            content: '请选择方法',
            buttons: [
                {
                    text: '知道了'
                }
            ]
        });
        return;
    }
    if (pattern == "gen") {
        if (method == "nullselect") {
            mdui.dialog({
                title: '错误',
                content: '请选择方法',
                buttons: [
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
            mdui.dialog({
                title: '错误',
                content: '请输入校验值',
                buttons: [
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


saveBtn.addEventListener('click', () => {
    const mbunitValue = mbUnit.value;
    const cacheSizeValue = cacheSize.value;
    const SystemNotification = document.querySelector('#isSystemNotification').checked;
    if (cacheSizeValue == "0") {
        settingsDialog.close();
        mdui.dialog({
            title: '错误',
            content: '分片单次缓存大小不能为“0”，请重新输入',
            buttons: [
                {
                    text: '确定',
                    onClick: () => {
                        settingsDialog.open();
                    }
                }
            ]
        });
        return
    }

    if (cacheSizeValue == "") {
        settingsDialog.close();
        mdui.dialog({
            title: '错误',
            content: '分片单次缓存大小不能为空，请重新输入',
            buttons: [
                {
                    text: '确定',
                    onClick: () => {
                        settingsDialog.open();
                    }
                }
            ]
        });
        return;
    }

    if (cacheSizeValue.length > 10) {
        settingsDialog.close();
        mdui.dialog({
            title: '错误',
            content: '分片单次缓存大小不能超过5位，请重新输入',
            buttons: [
                {
                    text: '确定',
                    onClick: () => {
                        settingsDialog.open();
                    }
                }
            ]
        });
        return;
    }
    setValue("mbUnit", mbunitValue)
    setValue("cacheSize", cacheSizeValue)
    setValue("SystemNotification", SystemNotification)
})

openSettingsBtn.addEventListener('click', () => {
    settingsDialog.open();
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
    settingsDialog.close();
    mdui.dialog({
        title: '你真的要清除缓存吗',
        content: '这只适用于应用出现问题的情况',
        buttons: [
            {
                text: '取消',
                onClick: () => {
                    settingsDialog.open();
                }
            },
            {
                text: '清除缓存',
                onClick: () => {
                    mdui.dialog({
                        title: '提示',
                        content: '清除缓存成功，应用即将重载',
                        buttons: [
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
    settingsDialog.close();
    mdui.dialog({
        title: '你真的要清除本地数据吗',
        content: '这将会清除您的所有个人设置',
        buttons: [
            {
                text: '取消',
                onClick: () => {
                    settingsDialog.open();
                }
            },
            {
                text: '清除本地数据',
                onClick: () => {
                    mdui.dialog({
                        title: '提示',
                        content: '清除本地数据成功，应用即将重载',
                        buttons: [
                            {
                                text: '确定'
                            }
                        ]
                    });
                    setTimeout(() => {
                        deleteValue("mbUnit");
                        deleteValue("cacheSize");
                        deleteValue("SystemNotification");
                        setValue("fistUse", "0");
                        window.location.reload(true);
                    }, 500);
                }
            }
        ]
    });
})

deleteAllDataBtn.addEventListener('click', () => {
    settingsDialog.close();
    mdui.dialog({
        title: '你真的要清除全部数据吗',
        content: '这将清除应用缓存和您的所有个人设置',
        buttons: [
            {
                text: '取消',
                onClick: () => {
                    settingsDialog.open();
                }
            },
            {
                text: '清除所有数据',
                onClick: () => {
                    mdui.dialog({
                        title: '提示',
                        content: '清除所有数据成功，应用即将重载',
                        buttons: [
                            {
                                text: '确定'
                            }
                        ]
                    });
                    setTimeout(() => {
                        deleteValue("mbUnit");
                        deleteValue("cacheSize");
                        deleteValue("SystemNotification");
                        setValue("fistUse", "0");
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

aboutBtn.addEventListener('click', () => {
    settingsDialog.close();
    aboutDialog.open();
})

aboutCloseBtn.addEventListener('click', () => {
    settingsDialog.open();
})