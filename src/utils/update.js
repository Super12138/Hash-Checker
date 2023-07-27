const { shell } = require('electron');

export function update() {
    const localver = '1.0.8';
    const localvernum = 1084;
    Promise.all([
        fetch('https://cdn.jsdelivr.net/gh/Super12138/Hash-Checker/build/ver.txt'),
        fetch('https://cdn.jsdelivr.net/gh/Super12138/Hash-Checker/build/vernum.txt')
    ])
        .then((responses) => {
            responses[0].text().then((content) => {
                const ver = content;
                responses[1].text().then((vernum) => {
                    if (vernum > localvernum) {
                        mdui.dialog({
                            title: '检测到新版本',
                            content: `检测到 Hash Checker 的新版本 ${ver}（${vernum}），当前版本${localver}（${localvernum}），你要前往 GitHub Releases 进行更新吗？`,
                            buttons: [
                                {
                                    text: '取消'
                                },
                                {
                                    text: '确定',
                                    onClick: () => {
                                        shell.openExternal('https://github.com/Super12138/Hash-Checker/releases');
                                    }
                                }
                            ]
                        });
                    } else {
                        console.log('最新版本');
                    }
                });
            });
        })
        .catch((error) => {
            console.log(error);
        });
}