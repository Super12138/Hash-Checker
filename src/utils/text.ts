import { Change, diffChars } from "diff";

/**
 * 比较两个哈希字符串的差异，并用红色加粗显示新增的部分，用删除线显示被删除的部分。
 * 
 * @param {string} userHash 用户输入的哈希字符串
 * @param {string} genHash 生成的哈希字符串
 * @returns {HTMLSpanElement} 高亮显示差异的 HTMLSpanElement
 */
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
 * 将一个文本（比如文本类型的 `true` ）转换成布尔值
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
    if (!isFinite(size) || size < 0) {
        return '文件大小无效';
    }
    const units: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
    const kb: number = 1024;
    let counter: number = 0;
    let calcSize: number = size;
    while (calcSize >= kb && counter < units.length - 1) {
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
export function isBlankOrEmpty(str: string | null): boolean {
    return str === null || str.trim() === '';
}