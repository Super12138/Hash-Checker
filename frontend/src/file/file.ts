import { getStorageItem } from "../store/localstorage";
import { formatDate } from "../utils/date";

export function getfileinfo(file: File) {
    const fileName: HTMLElement = document.querySelector('#fileName')!;
    const fileSize: HTMLElement = document.querySelector('#fileSize')!;
    const fileDate: HTMLElement = document.querySelector('#fileDate')!;
    fileName.innerHTML = file.name;
    fileSize.innerHTML = convertbyte(file.size);
    fileDate.innerHTML = formatDate(file.lastModified);
    console.log(file);
}

/**
 * 格式化文件大小
 * @param size 文件大小（字节）
 * @returns 格式化后的文件大小字符串（最大支持TB），如 `1 GB`
 */
export function convertbyte(size: number): string {
    const units: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
    const kb: number = Number(getStorageItem("mbUnit"));
    let counter: number = 0;
    let calcSize: number = size / 1
    while (calcSize >= kb) {
        counter++;
        calcSize = calcSize / kb;
    }
    return `${calcSize.toFixed(2)} ${units[counter]}`;
}