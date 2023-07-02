const { Titlebar, TitlebarColor } = require('custom-electron-titlebar');
const { ipcRenderer } = require('electron');

let color = '#FFFFFF';
const isCustomTitleBar = await ipcRenderer.send('getValue', 'customTitleBar');

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    color = '#303030'
}

window.addEventListener('DOMContentLoaded', () => {
    if (isCustomTitleBar == true) {
        const options = {
            maximizable: true,
            minimizable: true,
            closeable: true,
            titleHorizontalAlignment: 'center',
            backgroundColor: TitlebarColor.fromHex(color),
            tooltips: {
                minimize: '最小化',
                maximize: '最大化',
                restoreDown: '还原',
                close: '关闭'
            }
        }
        new Titlebar(options);
    }
});