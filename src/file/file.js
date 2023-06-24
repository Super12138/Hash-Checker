import { formatDate } from "../utils/date";
import { getValue } from "../store/store";
let tempfile

export async function getfileinfo(file) {
    const wfilename = document.querySelector('#fm');
    const wfilesize = document.querySelector('#fsize');
    const wetips = document.querySelector('#etips');
    const wdate = document.querySelector('#fdate');

    if (!file || file.length == 0) {
        wfilename.innerHTML = "未选择文件";
        wfilesize.innerHTML = "未选择文件";
        console.log("未选择文件");
    } else {
        if (file.size >= 104857600) {
            wfilename.innerHTML = file.name;
            const cbr = await convertbyte(file.size);
            wfilesize.innerHTML = cbr;
            wdate.innerHTML = formatDate(file.lastModifiedDate);
            wetips.innerHTML = "文件大小较大，计算时间可能较长";
        } else {
            wfilename.innerHTML = file.name;
            const cbr = await convertbyte(file.size);
            wfilesize.innerHTML = cbr;
            wdate.innerHTML = formatDate(file.lastModifiedDate);
        }
        console.log(file);
    }
}

export function sendfile(file) {
    tempfile = file
    console.log("收到了来自index.js发送的文件：" + tempfile)
}

export function getfile() {
    console.log("收到了来自index.js的请求：" + tempfile)
    return tempfile
}

export async function convertbyte(size) {
    const units = ["Bytes", "KB", "MB", "GB", "TB"];
    const mbunitValuefile = await getValue("mbUnit");
    let counter = 0;
    let calcsize = size / 1;
    while (calcsize >= mbunitValuefile) {
        counter++;
        calcsize = calcsize / mbunitValuefile;
    }
    const result = calcsize.toFixed(2) + " " + units[counter];
    return result
}
