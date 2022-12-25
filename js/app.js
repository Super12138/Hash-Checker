const {
    clipboard,
    shell
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
    var file = document.querySelector('#getfile').files[0];
    if (!file || file.length == 0) {
        mdui.dialog({
            title: '错误',
            content: '请选择文件之后再进行校验！',
            buttons: [
                {
                    text: '稍后选择'
                },
                {
                    text: '立即选择',
                    onClick: function (inst) {
                        document.querySelector('#getfile').click();
                    }
                }
            ]
        });
    }
    else {
        var meth = document.querySelector('#method').value;
        var mod = document.querySelector('#mod').value;
        if (meth == "nullselect" && mod == "nullselect") {
            mdui.dialog({
                title: '错误',
                content: '请选择方法和模式之后再进行校验！',
                buttons: [
                    {
                        text: '知道了'
                    }
                ]
            });
        }
        else {
            var only = document.querySelector('#mod').value;
            console.log(only);
            if (only == "nullselect") {
                mdui.dialog({
                    title: '错误',
                    content: '请选择模式之后再进行操作！',
                    buttons: [
                        {
                            text: '知道了'
                        }
                    ]
                });
            }
            else {
                if (only == "generate") {
                    var meth = document.querySelector('#method').value;
                    if (meth == "nullselect") {
                        mdui.dialog({
                            title: '错误',
                            content: '请选择方法之后再进行操作！',
                            buttons: [
                                {
                                    text: '知道了'
                                }
                            ]
                        });
                    }
                    else {
                        var filec = document.querySelector('#getfile');
                        var ttitle = document.querySelector('#ttitle');
                        var tips = document.querySelector('#tips');
                        let reader = new FileReader();
                        ttitle.innerHTML = "状态：";
                        tips.innerHTML = "正在将文件缓存...";
                        reader.readAsArrayBuffer(filec.files[0]);
                        reader.onload = function () {
                            var calcmethod = document.querySelector('#method').value;
                            tips.innerHTML = "获取到计算" + calcmethod + "值";
                            tips.innerHTML = "正在计算...";
                            var wordArray = CryptoJS.lib.WordArray.create(reader.result);
                            if (calcmethod == 'md5') {
                                var calchash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
                            }
                            else {
                                var calchash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
                            }
                            console.log(calchash);
                            var calcmethod = document.querySelector('#method').value;
                            clipboard.writeText(calchash);
                            tips.innerHTML = "计算完成，" + calcmethod + "值已写入您的剪贴板！<br>" + calcmethod + "值：" + "<code>" + calchash + "</code>";
                            new Notification(
                                calcmethod + '计算完成', 
                                {
                                    dir: 'auto',
                                    body: '值为：' + calchash + '，已写入您的剪贴板'
                                }
                            )
                        }
                    }
                }
                else {
                    var meth = document.querySelector('#method').value;
                    if (meth == "nullselect") {
                        mdui.dialog({
                            title: '错误',
                            content: '请选择方法之后再进行校验！',
                            buttons: [
                                {
                                    text: '知道了'
                                }
                            ]
                        });
                    }
                    else {
                        var inpc = document.getElementById('a').value;
                        if (inpc === "" || inpc === null || inpc === undefined) {
                            mdui.dialog({
                                title: '错误',
                                content: '请输入校验值之后再进行校验！',
                                buttons: [
                                    {
                                        text: '知道了'
                                    }
                                ]
                            });
                        }
                        else {
                            var filec = document.querySelector('#getfile');
                            var ttitle = document.querySelector('#ttitle');
                            var tips = document.querySelector('#tips');
                            let reader = new FileReader();
                            ttitle.innerHTML = "状态：";
                            tips.innerHTML = "正在将文件缓存...";
                            reader.readAsArrayBuffer(filec.files[0]);
                            reader.onload = function () {
                                var calcmethod = document.querySelector('#method').value;
                                tips.innerHTML = "获取到计算" + calcmethod + "值";
                                tips.innerHTML = "正在计算...";
                                var wordArray = CryptoJS.lib.WordArray.create(reader.result);
                                //化简代码
                                if (calcmethod == 'md5') {
                                    var calchash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
                                }
                                else {
                                    var calchash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
                                }
                                console.log(calchash);
                                var f = document.getElementById('a').value;
                                var a = f.toLowerCase();
                                var b = calchash.toLowerCase();
                                var calcmethod = document.querySelector('#method').value;
                                if (b === a) {
                                    new Notification(
                                        calcmethod + '校验完成', 
                                        {
                                            dir: 'auto',
                                            body: '恭喜🎉！您的文件是完好的，请放心使用！'
                                        }
                                    )
                                    tips.innerHTML = "校验完成<br>" + calcmethod + "值：" + "<code>" + calchash + "</code>";
                                    mdui.dialog({
                                        title: '校验成功',
                                        content: '请放心使用',
                                        buttons: [
                                            {
                                                text: '完成'
                                            }
                                        ]
                                    });
                                }
                                else {
                                    new Notification(
                                        calcmethod + '校验失败', 
                                        {
                                            dir: 'auto',
                                            body: '详细信息请在应用于内查看'
                                        }
                                    )
                                    tips.innerHTML = "校验完成<br>" + calcmethod + "值：" + "<code>" + calchash + "</code>";
                                    mdui.dialog({
                                        title: '校验失败',
                                        content: '请检查获取的校验值是否有误（如多余的空格），或是校验值和校验方法不一致（如校验值是MD5，但校验方法是SHA256)；如果没有上述任一情况请自行解决',
                                        buttons: [
                                            {
                                                text: '确认'
                                            }
                                        ]
                                    });
                                }

                            };
                        }
                    }
                }
            }
        }
    }
}