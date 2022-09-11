onload = function update() {
    if (navigator.onLine) {
        $.get("https://cdn.jsdelivr.net/gh/Super12138/UpdateServer@main/hc-ver.txt", function (data) {
            var n = 1000;
            var l = data;
            document.querySelector('#ttitle').innerHTML = "检测更新"
            if (n == l) {
                document.querySelector('#ttitle').innerHTML = ""
            }
            else {
                $.get("https://cdn.jsdelivr.net/gh/Super12138/UpdateServer@main/hc-content.txt", function (content) {
                    document.querySelector('#ttitle').innerHTML = "检测到新版本"
                    mdui.dialog({
                        title: '检测到新版本',
                        content: content,
                        modal: true,
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
                                onClick: function () {
                                    mdui.dialog({
                                        title: '点击下方链接更新',
                                        content: '请前往<pre>https://github.com/Super12138/Hash-Checker/releases</pre>上下载最新版本',
                                        modal: true,
                                        buttons: [
                                            {
                                                text: '知道了'
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