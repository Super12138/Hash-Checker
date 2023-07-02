import { ipcRenderer } from "electron";

export function setValue(name, value) {
    ipcRenderer.send('setValue', name, value);
}

export function getValue(name) {
    return new Promise(resolve => {
        ipcRenderer.send('getValue', name);
        ipcRenderer.on('getValueReply', (event, value) => {
            resolve(value)
        });
    })
}

export function deleteAllValue() {
    ipcRenderer.send('deleteAllValue');
}