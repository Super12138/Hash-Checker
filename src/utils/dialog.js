import { dialog } from 'mdui/functions/dialog.js';

/**
 * 打开一个标准 dialog，只允许设定一个按钮
 */
export function simpleDialog(title, description, button) {
    dialog({
        headline: title,
        description: description,
        actions: [
            {
                text: button
            }
        ]
    });
}