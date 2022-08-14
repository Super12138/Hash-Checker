onload = function update() {
    if (navigator.onLine) {
        $.get("#upurl", function (data) {
            var n = 5050;
            var l = data;
            document.querySelector('#ttitle').innerHTML = "检测更新"
            if (n == l) {
                document.querySelector('#ttitle').innerHTML = ""
            }
            else {
                $.get("#content", function (content) {
                    document.querySelector('#ttitle').innerHTML = "检测到新版本"
                    mdui.dialog({
                        title: '检测到新版本',
                        content: content,
                        buttons: [
                            {
                                text: '取消',
                                onClick: function () {
                                    document.querySelector('#title').innerHTML = "Hash Checker（旧版本）"
                                    document.querySelector('#ttitle').innerHTML = ""
                                }
                            },
                            {
                                text: '立即更新',
                                onClick: function (inst) {
                                    mdui.dialog({
                                        title: '更新',
                                        content: '更新链接以拷贝到您的剪贴板，请前往浏览器更新。',
                                        buttons: [
                                            {
                                                text: '知道了',
                                                onClick: function (inst){
                                                }
                                            }
                                        ]
                                    });
                                }
                            }
                        ]
                    });
                });
            }
        });
    }
    else {
    }
};