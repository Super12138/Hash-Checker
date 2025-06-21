/**
 * 格式化日期
 * @param date 日期时间戳
 * @returns 格式化的日期字符串，`yyyy年mm月dd日 hh:mm:ss`
 */
export function formatDate(date: number): string {
    let dateObj: Date = new Date(date);
    let year: number = dateObj.getFullYear();
    let month: string | number = dateObj.getMonth() + 1;
    let day: string | number = dateObj.getDate();
    let hour: string | number = dateObj.getHours();
    let minute: string | number = dateObj.getMinutes();
    let second: string | number = dateObj.getSeconds();
    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }
    if (hour < 10) {
        hour = `0${hour}`;
    }
    if (minute < 10) {
        minute = `0${minute}`;
    }
    if (second < 10) {
        second = `0${second}`;
    }
    // 返回格式化后的日期字符串
    return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
}

/**
 * 格式化时间
 * @param seconds 传入的时间（单位：秒）
 * @returns 格式化的时间字符串；输出：`ss秒`，`mm分钟`，`hh 小时 mm 分钟 ss 秒`
 * 说明：小时、分钟、秒均为整数，分别通过取整和取余计算得出。
 */
export function formatTime(seconds: number): string {
    if (seconds < 60) {
        // 小于 60 秒，直接返回秒数
        return `${Math.round(seconds)} 秒`;
    } else if (seconds < 3600) {
        // 小于 1 小时，返回分钟数（向下取整）
        return `${Math.round(seconds / 60)} 分钟`;
    } else {
        // 1 小时及以上，分别计算小时、分钟、秒，均为整数
        const hours = Math.floor(seconds / 3600); // 小时
        const minutes = Math.floor((seconds % 3600) / 60); // 分钟
        const secs = Math.floor(seconds % 60); // 秒
        return `${hours} 小时 ${minutes} 分钟 ${secs} 秒`;
    }
}