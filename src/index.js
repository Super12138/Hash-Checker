import { calc } from "./utils/calc";
import { getfileinfo, getfile, sendfile } from "./file/file";
import { getCookie, setCookie } from "./cookie/cookie";

const openfilebtn = document.querySelector("#openfile");
const fileinput = document.querySelector('#getfile');
const calcbtn = document.querySelector('#calcbtn');
const dragtip = document.querySelector('#dragtip');
const mbUnit = document.querySelector('#mbunit');
const cacheSize = document.querySelector('#cachesize');
const saveBtn = document.querySelector('#savebtn');
const oneWeek = 7 * 24 * 60 * 60 * 1000;
const expires = new Date(Date.now() + oneWeek).toUTCString();
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
    const mbunitValuenew = getCookie("mbUnit");
    const cacheSizeValuenew = getCookie("cacheSize");
    console.log(mbunitValuenew, cacheSizeValuenew);
    if (!mbunitValuenew && !cacheSizeValuenew) {
        setCookie("mbUnit", "1024", expires)
        setCookie("cacheSize", "128", expires)
    } else {
        if (mbunitValuenew !== "") {
            mbUnit.value = mbunitValuenew;
        }
        if (cacheSizeValuenew !== "") {
            cacheSize.value = cacheSizeValuenew;
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

saveBtn.addEventListener('click', () => {
    const mbunitValue = mbUnit.value;
    const cacheSizeValue = cacheSize.value;

    setCookie("mbUnit", mbunitValue, expires)
    setCookie("cacheSize", cacheSizeValue, expires)
})