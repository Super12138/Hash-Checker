function openfile() {
    document.querySelector('#getfile').click();
}

function getfilename() {
    var wfilename = document.querySelector('#fm');
    var wfilesize = document.querySelector('#fsize');
    var wetips = document.querySelector('#etips');
    var file = document.querySelector('#getfile').files[0];
    if (!file || file.length == 0) {
        wfilename.innerHTML = "未选择文件";
        wfilesize.innerHTML = "未选择文件";
        console.log("未选择文件");
    }
    else {
        if (file.size >= 104857600) {
            wfilename.innerHTML = file.name;
            wfilesize.innerHTML = file.size + "&nbsp; Byte";
            wetips.innerHTML = "推荐上传小于100MB的文件";
            console.log(file);
        } else {
            wfilename.innerHTML = file.name;
            wfilesize.innerHTML = file.size + "&nbsp; Byte";
            console.log(file);
        }
    }
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
                        const { clipboard } = require('electron')
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
                            if (calcmethod == "md5") {
                                tips.innerHTML = "正在计算...";
                                var wordArray = CryptoJS.lib.WordArray.create(reader.result);
                                var calchash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
                                console.log(calchash);
                                var ch = calchash;
                                var f = document.getElementById('a').value;
                                var a = f.toLowerCase();
                                var b = ch.toLowerCase();
                                var calcmethod = document.querySelector('#method').value;
                                clipboard.writeText(calchash);
                                tips.innerHTML = "计算完成，" + calcmethod + "值已写入您的剪贴板！<br>" + calcmethod + "值：" + calchash;
                            }
                            else {
                                tips.innerHTML = "正在计算...";
                                var wordArray = CryptoJS.lib.WordArray.create(reader.result);
                                var calchash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
                                console.log(calchash);
                                var ch = calchash;
                                var f = document.getElementById('a').value;
                                var a = f.toLowerCase();
                                var b = ch.toLowerCase();
                                var calcmethod = document.querySelector('#method').value;
                                clipboard.writeText(calchash);
                                tips.innerHTML = "计算完成，" + calcmethod + "值已写入您的剪贴板！<br>" + calcmethod + "值：" + calchash;
                            };
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
                                if (calcmethod == "md5") {
                                    tips.innerHTML = "正在计算...";
                                    var wordArray = CryptoJS.lib.WordArray.create(reader.result);
                                    var calchash = CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex);
                                    console.log(calchash);
                                    var ch = calchash;
                                    var f = document.getElementById('a').value;
                                    var a = f.toLowerCase();
                                    var b = ch.toLowerCase();
                                    var calcmethod = document.querySelector('#method').value;
                                    if (b === a) {
                                        tips.innerHTML = "校验完成<br>" + calcmethod + "值：" + calchash;
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
                                        tips.innerHTML = "校验完成<br>" + calcmethod + "值：" + calchash;
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
                                }
                                else {
                                    tips.innerHTML = "正在计算...";
                                    var wordArray = CryptoJS.lib.WordArray.create(reader.result);
                                    var calchash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
                                    console.log(calchash);
                                    var ch = calchash;
                                    var f = document.getElementById('a').value;
                                    var a = f.toLowerCase();
                                    var b = ch.toLowerCase();
                                    var calcmethod = document.querySelector('#method').value;
                                    if (b === a) {
                                        tips.innerHTML = "校验完成<br>" + calcmethod + "值：" + calchash;
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
                                        tips.innerHTML = "校验完成<br>" + calcmethod + "值：" + calchash;
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
                                }
                            };
                        }
                    }
                }
            }
        }
    }
}