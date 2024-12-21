/**
 * 格式化日期
 * @param date 日期时间戳
 * @returns 格式化的日期字符串，`yyyy年mm月dd日 hh:mm:ss`
 */
export function formatDate(date: number): string {
    let dateObj: Date = new Date(date);
    let year: number = dateObj.getFullYear();
    let month: number = dateObj.getMonth() + 1;
    let day: number = dateObj.getDate();
    let hour: string | number = dateObj.getHours();
    let minute: string | number = dateObj.getMinutes();
    let second: string | number = dateObj.getSeconds();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    if (minute < 10) {
        minute = `0${minute}`;
    }
    if (second < 10) {
        second = `0${second}`;
    }
    return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
}

/**
 * 格式化时间
 * @param seconds 传入的时间（单位：秒）
 * @returns 格式化的时间字符串；输出：`ss秒`，mm分钟`，`hh 小时 mm 分钟 ss 秒`
 */
export function formatTime(seconds: number): string {
    if (seconds < 60) {
        return `${Math.round(seconds)} 秒`;
    } else if (seconds < 3600) {
        return `${Math.round(seconds / 60)} 分钟`;
    } else {
        return `${Math.round(seconds / 3600)} 小时 ${Math.round((seconds % 3600) / 60)} 分钟 ${Math.round(seconds % 60)} 秒`;
    }
}