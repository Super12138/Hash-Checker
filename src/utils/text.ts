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
