import { calc } from "./calc";
import { getfileinfo, getfile, sendfile } from "./file";

const openfilebtn = document.querySelector("#openfile");
const fileinput = document.querySelector('#getfile');
const calcbtn = document.querySelector('#calcbtn');
const dragtip = document.querySelector('#dragtip')

var dropzone = document.getElementById('drop');
dropzone.addEventListener('dragover', function (e) {
    dragtip.style.display = "block";
    e.preventDefault();
});
dropzone.addEventListener('drop', function (e) {
    e.preventDefault();
    dragtip.style.display = "none";
    var file = e.dataTransfer.files[0];
    getfileinfo(file);
    sendfile(file);
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
    const meth = document.querySelector('#method').value;
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
    if (meth == "nullselect" && pattern == "nullselect") {
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
    if (meth == "nullselect") {
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
        if (meth == "nullselect") {
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
        console.log(pattern + meth + file)
        calc(pattern, meth, file);
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
        console.log(pattern + meth + file + inpc)
        calc(pattern, meth, file, inpc)
    }
})
