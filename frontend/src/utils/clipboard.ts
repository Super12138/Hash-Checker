import { dialog } from "mdui";
import { snackbar } from "mdui/functions/snackbar.js";

export async function writeClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        snackbar({
            message: "成功写入剪贴板"
        })
    } catch (e) {
        dialog({
            headline: '错误',
            description: '无法写入剪贴板',
            actions: [
                {
                    text: '确定'
                }
            ]
        });
    }
}
