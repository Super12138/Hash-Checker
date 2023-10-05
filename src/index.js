import { shell, ipcRenderer } from "electron";
import { calc } from "./utils/calc";
import { getfileinfo, getfile, sendfile } from "./file/file";
import { getValue, setValue, deleteAllValue } from "./store/store";
import { sendNotification } from "./utils/notification";
import { update } from "./utils/update";
import mdui from "mdui";

const openfilebtn = document.querySelector("#openfile");
const fileInput = document.querySelector('#getfile');
const calcbtn = document.querySelector('#calcbtn');
const dragtip = document.querySelector('#dragtip');
// const toggleDarkMode = document.querySelector('#toggleDarkMode');

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
const isStartupUpdate = document.querySelector('#isStartupUpdate');
const isFileUrl = document.querySelector('#isFileUrl');
const urlInput = document.querySelector('#url');

const settingsDialog = new mdui.Dialog('#settings');
const aboutDialog = new mdui.Dialog('#about');

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
    const checkUpdateValue = await getValue("checkUpdate");
    if (checkUpdateValue == true) {
        if (navigator.onLine) {
            console.log('在线状态');
            update();
        } else {
            console.log('离线状态');
        }
    }
    const firstUse = await getValue("fistUse");
    const mbunitValuenew = await getValue("mbUnit");
    const cacheSizeValuenew = await getValue("cacheSize");
    let isSystemNotificationValuenew = await getValue("systemNotification");
    let isStartupUpdateValuenew = await getValue("checkUpdate");
    console.log(`初次使用：${firstUse}`)
    console.log(mbunitValuenew, cacheSizeValuenew, isSystemNotificationValuenew, checkUpdateValue);

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
        setValue("systemNotification", false);
        setValue("checkUpdate", true);
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
    isStartupUpdate.checked = isStartupUpdateValuenew;
});


openfilebtn.addEventListener('click', () => {
    document.querySelector('#getfile').click();
})

fileInput.addEventListener('change', () => {
    const file = document.querySelector('#getfile').files[0];
    getfileinfo(file);
    sendfile(file);
})

calcbtn.addEventListener('click', () => {
    let file = getfile();
    const cacheSizecheck = getValue("cacheSize");
    const method = document.querySelector('#method').value;
    const patternValue = document.querySelector('#mod').value;
    const checkSumInputValue = document.querySelector('#a').value;
    if (isFileUrl.checked) {
        file = urlInput.value;
        if (urlInput.value == '') {
            mdui.dialog({
                title: '错误',
                content: '请输入要获取文件的 URL',
                buttons: [
                    {
                        text: '知道了'
                    }
                ]
            });
            return;
        }
    } else {
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
    if (method == "nullselect" && patternValue == "nullselect") {
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
    if (patternValue == "nullselect") {
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
    if (patternValue == "gen") {
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
        console.log(patternValue + method + file)
        calc(patternValue, method, file, isFileUrl.checked);
    } else {
        if (!checkSumInputValue) {
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
        console.log(patternValue + method + file + checkSumInputValue, isFileUrl.checked)
        calc(patternValue, method, file, checkSumInputValue, isFileUrl.checked)
    }
})

saveBtn.addEventListener('click', async () => {
    const mbunitValue = mbUnit.value;
    const cacheSizeValue = cacheSize.value;
    const systemNotification = document.querySelector('#isSystemNotification').checked;
    const checkUpdate = document.querySelector('#isStartupUpdate').checked;

    if (cacheSizeValue == "0") {
        settingsDialog.close();
        mdui.dialog({
            title: '错误',
            content: '分片单次缓存大小不能为“0”，请重新输入',
            modal: true,
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
            modal: true,
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
            modal: true,
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
    setValue("systemNotification", systemNotification)
    setValue("checkUpdate", checkUpdate)
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
                        ipcRenderer.send('clear-cache');
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
    settingsDialog.close();
    aboutDialog.open();
})

aboutCloseBtn.addEventListener('click', () => {
    settingsDialog.open();
})

isFileUrl.addEventListener('change', () => {
    if (isFileUrl.checked) {
        urlInput.disabled = false;
        mdui.updateTextFields();
    } else {
        urlInput.disabled = true;
        mdui.updateTextFields();
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