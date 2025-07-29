/**
 * 判断一个字符串是否为空或者只包含空白字符
 * 
 * @param str 要判断的字符串
 * @returns 是否为空或者只包含空白字符
 */
export function isBlankOrEmpty(str: number | string | null): boolean {
    return str === null || str.toString().trim() === '';
}