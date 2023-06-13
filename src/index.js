import { calc } from "./utils/calc";
import { getfileinfo, getfile, sendfile } from "./file/file";
import { getCookie } from "./cookie/cookie";

const openfilebtn = document.querySelector("#openfile");
const fileinput = document.querySelector('#getfile');
const calcbtn = document.querySelector('#calcbtn');
const dragtip = document.querySelector('#dragtip');
const mbunit = document.querySelector('#mbunit');
const cachesize = document.querySelector('#cachesize');
const savebtn = document.querySelector('#savebtn');
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
    const mbunitValuenew = getCookie("mbunit");
    const cacheSizeValuenew = getCookie("cacheSize");
    console.log(mbunitValuenew, cacheSizeValuenew)
    if (cacheSizeValuenew == "") {
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const expires = new Date(Date.now() + oneWeek).toUTCString();
        document.cookie = `mbunit=1024; expires=${expires}; path=/`;
        document.cookie = `cacheSize=128; expires=${expires}; path=/`;
    } else {
        if (mbunitValuenew !== "") {
            mbunit.value = mbunitValuenew;
        }
        if (cacheSizeValuenew !== "") {
            cachesize.value = cacheSizeValuenew;
        }
    }
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

savebtn.addEventListener('click', () => {
    // 获取输入框的值
    const mbunitValue = mbunit.value;
    const cacheSizeValue = cachesize.value;

    // 设置cookie
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const expires = new Date(Date.now() + oneWeek).toUTCString();
    document.cookie = `mbunit=${mbunitValue}; expires=${expires}; path=/`;
    document.cookie = `cacheSize=${cacheSizeValue}; expires=${expires}; path=/`;
})