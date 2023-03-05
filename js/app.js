const {
    clipboard,
    shell,
    ipcRenderer
} = require('electron')

//let ctypto = require('crypto');
//let xxx = crypto.createHash('sha256').update(file).digest('hex');
//console.log(xxx);
//// 处理拖拽事件
var dropzone = document.getElementById('drop');
dropzone.addEventListener('dragover', function (e) {
    e.preventDefault();
});
dropzone.addEventListener('drop', function (e) {
    e.preventDefault()
    var file = e.dataTransfer.files[0];
    dropzone.innerHTML = file.name;
});

const links = document.querySelectorAll('a[href]');
links.forEach(link => {
    link.addEventListener('click', e => {
        const url = link.getAttribute('href');
        e.preventDefault();
        shell.openExternal(url);
    });
});

function openfile() {
    document.querySelector('#getfile').click();
}

function getfilename() {
    const wfilename = document.querySelector('#fm');
    const wfilesize = document.querySelector('#fsize');
    const wetips = document.querySelector('#etips');
    const file = document.querySelector('#getfile').files[0];

    if (!file || file.length == 0) {
        wfilename.innerHTML = "未选择文件";
        wfilesize.innerHTML = "未选择文件";
        console.log("未选择文件");
    } else {
        if (file.size >= 104857600) {
            wfilename.innerHTML = file.name;
            wfilesize.innerHTML = file.size + "&nbsp; Byte";
            wetips.innerHTML = "文件大小较大，计算时间可能较长";
        } else {
            wfilename.innerHTML = file.name;
            wfilesize.innerHTML = file.size + "&nbsp; Byte";
        }
        console.log(file);
    }
    //备选方案（三元运算符，更简洁）
    //const wfilename = document.querySelector('#fm');
    //const wfilesize = document.querySelector('#fsize');
    //const wetips = document.querySelector('#etips');
    //const file = document.querySelector('#getfile').files[0];

    //if (!file || file.length == 0) {
    //wfilename.innerHTML = "未选择文件";
    //wfilesize.innerHTML = "未选择文件";
    //console.log("未选择文件");
    //} else {
    //wfilename.innerHTML = file.name;
    //wfilesize.innerHTML = file.size + "&nbsp; Byte";
    //wetips.innerHTML = file.size >= 104857600 ? "文件大小较大，计算时间可能较长" : "";
    //console.log(file);
    //}
}

function calch() {
    const file = document.querySelector('#getfile').files[0];
    if (!file || file.length == 0) {
        ipcRenderer.send('no-file');
        return;
    }
    const meth = document.querySelector('#method').value;
    const mod = document.querySelector('#mod').value;
    if (meth == "nullselect" && mod == "nullselect") {
        ipcRenderer.send('no-modmeth');
        return;
    }
    const only = document.querySelector('#mod').value;
    console.log(only);
    if (only == "nullselect") {
        ipcRenderer.send('no-model');
        return;
    }
    if (meth == "nullselect") {
        ipcRenderer.send('no-method');
        return;
    }
    if (only == "generate") {
        if (meth == "nullselect") {
            ipcRenderer.send('no-method');
            return;
        }
        const filec = document.querySelector('#getfile');
        const ttitle = document.querySelector('#ttitle');
        const tips = document.querySelector('#tips');
        const isClipboard = document.querySelector('#isclipboard').checked;
        const reader = new FileReader();
        ttitle.innerHTML = "状态：";
        tips.innerHTML = "正在将文件缓存...";
        reader.readAsArrayBuffer(filec.files[0]);
        reader.onload = ()=>{
            const calcmethod = document.querySelector('#method').value;
            tips.innerHTML = "获取到计算" + calcmethod + "值";
            tips.innerHTML = "正在计算...";
            const wordArray = CryptoJS.lib.WordArray.create(reader.result);
            const calchash = calcmethod == 'md5' ? CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex) : CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
            console.log(calchash);
            if (isClipboard) {
                clipboard.writeText(calchash);
                tips.innerHTML = "计算完成，" + calcmethod + "值已写入您的剪贴板！<br>" + calcmethod + "值：" + "<code>" + calchash + "</code>";
            }
            tips.innerHTML = calcmethod + "计算完成<br>" + calcmethod + "值：" + "<code>" + calchash + "</code>";
            ipcRenderer.send('gen-ok');
        }
    } else {
        const inpc = document.getElementById('a').value;
        if (!inpc) {
            ipcRenderer.send('no-checksum');
            return;
        }
        const filec = document.querySelector('#getfile');
        const ttitle = document.querySelector('#ttitle');
        const tips = document.querySelector('#tips');
        const reader = new FileReader();
        ttitle.innerHTML = "状态：";
        tips.innerHTML = "正在将文件缓存...";
        reader.readAsArrayBuffer(filec.files[0]);
        reader.onload = ()=>{
            const calcmethod = document.querySelector('#method').value;
            tips.innerHTML = "获取到计算" + calcmethod + "值";
            tips.innerHTML = "正在计算...";
            const wordArray = CryptoJS.lib.WordArray.create(reader.result);
            const calchash = calcmethod == 'md5' ? CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex) : CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
            console.log(calchash);
            const f = document.getElementById('a').value.toLowerCase();
            const b = calchash.toLowerCase();
            if (b === f) {
                tips.innerHTML = "校验成功<br>文件" + calcmethod + "值：" + "<code>" + calchash + "</code>";
                ipcRenderer.send('check-ok');
            } else {
                tips.innerHTML = "校验失败<br>文件" + calcmethod + "值：" + "<code>" + calchash + "</code>" + "<br>请检查获取的校验值是否有误（如多余的空格，复制时少复制了字符），或是校验值和校验方法不一致（如校验值是MD5，但校验方法是SHA256)；如果没有上述任一情况请自行解决";
                ipcRenderer.send('check-fail');
            }
        }
    }
}
