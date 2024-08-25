import { LogHelper } from "./LogHelper";

const logHelper: LogHelper = LogHelper.getInstance();

let tempText: Date | string;
let totalTime: Date | string;
let tempfile: File

export function sendText(text: Date | string, only?: boolean) {
    if (only == true) {
        totalTime = text;
    } else {
        tempText = text;
    }
}

export function getText(only: boolean) {
    return (only == true) ? totalTime : tempText;
}

export function sendFile(file: File) {
    tempfile = file
    logHelper.log("收到了来自index.js发送的文件：" + tempfile)
}

export function getFile() {
    logHelper.log("收到了来自index.js的请求：" + tempfile)
    return tempfile
}