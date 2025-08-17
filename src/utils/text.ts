import { ref, toValue, watchEffect, type MaybeRefOrGetter, type Ref } from "vue";

/**
 * 判断一个字符串是否为空或者只包含空白字符
 *
 * @param str 要判断的字符串
 * @returns 是否为空或者只包含空白字符
 */
export function isBlankOrEmpty(str: number | string | null): boolean {
    return str === null || str.toString().trim() === "";
}

export function useBlankOrEmptyCheck(text: MaybeRefOrGetter<string | null>): Ref<boolean, boolean> {
    const state = ref<boolean>(false);
    watchEffect(() => {
        state.value = isBlankOrEmpty(toValue(text));
    });
    return state;
}

export function useNotBlankOrEmptyCheck(
    text: MaybeRefOrGetter<string | null>,
): Ref<boolean, boolean> {
    const state = ref<boolean>(false);
    watchEffect(() => {
        state.value = !isBlankOrEmpty(toValue(text));
    });
    return state;
}

export const formatDate = (date: number): string => {
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
};

/**
 * 格式化时间
 *
 * @param seconds 传入的时间（单位：秒）
 * @returns 格式化的时间字符串；输出：`ss秒`，`mm分钟`，`hh 小时 mm 分钟 ss 秒`
 */
export const useFormatTime = (seconds: MaybeRefOrGetter<number>): Ref<string, string> => {
    const str = ref<string>("");
    watchEffect(() => {
        str.value = formatTime(toValue(seconds));
    });
    return str;
};

/**
 * 格式化时间
 *
 * @param seconds 传入的时间（单位：秒）
 * @returns 格式化的时间字符串；输出：`ss秒`，`mm分钟`，`hh 小时 mm 分钟 ss 秒`
 */
export const formatTime = (seconds: number): string => {
    if (seconds < 60) {
        // 小于 60 秒，直接返回秒数
        return `${Math.round(seconds)} 秒`;
    } else if (seconds < 3600) {
        // 小于 1 小时，返回分钟数（向下取整）和秒数
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes} 分钟 ${secs} 秒`;
    } else {
        // 1 小时及以上，分别计算小时、分钟、秒，均为整数
        const hours = Math.floor(seconds / 3600); // 小时
        const minutes = Math.floor((seconds % 3600) / 60); // 分钟
        const secs = Math.floor(seconds % 60); // 秒
        return `${hours} 小时 ${minutes} 分钟 ${secs} 秒`;
    }
};
