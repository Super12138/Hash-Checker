onload = function update() {
    if (navigator.onLine) {
        $.get("https://cdn.jsdelivr.net/gh/Super12138/UpdateServer@main/hc-ver.txt", function (data) {
            var n = 1010;
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
                                text: '取消'
                            },
                            {
                                text: '立即更新',
                                onClick: function () {
                                    var upl = 'https://github.com/Super12138/Hash-Checker/releases';
                                    navigator.clipboard.writeText(upl).catch(e => console.error(e));
                                    mdui.dialog({
                                        title: '更新链接已复制到您的剪贴板',
                                        content: '请前往浏览器中粘贴链接更新',
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