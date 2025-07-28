import { ref, toValue, watchEffect, type MaybeRefOrGetter, type Ref } from "vue";

/**
 * 格式化文件大小
 *
 * @param file 要获取大小的文件
 * @returns 格式化后的文件大小字符串 Ref 响应式引用（最大支持TB），如 `1 GB`
 */
export function useFileInfo(file: MaybeRefOrGetter<File | null>): Ref<string, string> {
    const fileInfo = ref("");

    const formatFileSize = (size: number): string => {
        if (!isFinite(size) || size < 0) {
            return "文件大小无效";
        }
        const fileSizeUnits: string[] = ["Bytes", "KB", "MB", "GB", "TB"];
        const kbUnit: number = 1024;
        let counter: number = 0;
        let calcSize: number = size;
        while (calcSize >= kbUnit && counter < fileSizeUnits.length - 1) {
            counter++;
            calcSize = calcSize / kbUnit;
        }
        return `${calcSize.toFixed(2)} ${fileSizeUnits[counter]}`;
    };

    watchEffect(() => {
        const fileValue = toValue(file);
        if (fileValue !== null && fileValue !== undefined) {
            fileInfo.value = `${fileValue.name}（${formatFileSize(fileValue.size)}）`;
        } else {
            fileInfo.value = "";
        }
    });

    return fileInfo;
}
