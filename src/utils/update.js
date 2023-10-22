const { shell } = require('electron');
import { dialog } from 'mdui/functions/dialog.js';

export function update() {
    const localver = '2.0.0';
    const localvernum = 2023102201;
    Promise.all([
        fetch('https://cdn.jsdelivr.net/gh/Super12138/Hash-Checker/build/ver.txt'),
        fetch('https://cdn.jsdelivr.net/gh/Super12138/Hash-Checker/build/vernum.txt')
    ])
        .then((responses) => {
            responses[0].text().then((content) => {
                const ver = content;
                responses[1].text().then((vernum) => {
                    if (vernum > localvernum) {
                        dialog({
                            headline: '检测到新版本',
                            description: `检测到 Hash Checker 的新版本 ${ver}（${vernum}），当前版本${localver}（${localvernum}），你要前往 GitHub Releases 进行更新吗？`,
                            actions: [
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