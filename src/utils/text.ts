import { Change, diffChars } from "diff";

export function compareHash(userHash: string, genHash: string): HTMLSpanElement {
    const differences: Change[] = diffChars(userHash, genHash);
    const virtualDOM: HTMLSpanElement = document.createElement("span");

    differences.forEach((part: Change) => {
        const span: HTMLSpanElement = document.createElement('span');
        if (part.added) {
            span.classList.add('color-red');
        }
        if (part.removed) {
            span.style.textDecoration = 'line-through';
        }
        span.appendChild(document.createTextNode(part.value));
        virtualDOM.appendChild(span);
    });
    return virtualDOM;
}

/**
 * 将一个文本（比如文本类型的`true`）转换成布尔值
 * 
 * * 文本类型的 `true` 或 `false` 会转换成布尔值
 * * 若为普通文本，默认返回 `false`
 * 
 * @param {string} str 要转换成布尔值的文本
 * @returns 转换好的布尔值
 */
export function string2Boolean(str: string | null): boolean {
    if (str === null) {
        return false;
    } else {
        switch (str.toLowerCase()) {
            case 'true':
                return true;
            case 'false':
                return false;
            default:
                return false;
        }
    }
}

/**
 * 格式化文件大小
 * 
 * @param size 文件大小（字节）
 * @returns 格式化后的文件大小字符串（最大支持TB），如 `1 GB`
 */
export function formatFileSize(size: number): string {
    const units: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
    const kb: number = 1024;
    let counter: number = 0;
    let calcSize: number = size / 1
    while (calcSize >= kb) {
        counter++;
        calcSize = calcSize / kb;
    }
    return `${calcSize.toFixed(2)} ${units[counter]}`;
}

/**
 * 判断一个字符串是否为空或者只包含空白字符
 * 
 * @param str 要判断的字符串
 * @returns 是否为空或者只包含空白字符
 */
export function isEmptyOrBlank(str: string): boolean {
    return str === null || str.trim() === '';
}