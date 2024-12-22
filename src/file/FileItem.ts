import { getStorageItem } from '../store/localstorage';
import { writeClipboard } from '../utils/clipboard';
import { formatTime } from '../utils/date';
import { LogHelper } from '../utils/LogHelper';
import { sendAppNotification } from '../utils/notification';
import { compareHash, formatFileSize, string2Boolean } from '../utils/text';

import { dialog } from 'mdui';
import type { Button } from 'mdui/components/button.js';
import type { Checkbox } from 'mdui/components/checkbox.js';
import type { CircularProgress } from 'mdui/components/circular-progress.js';
import type { ListItem } from 'mdui/components/list-item.js';

const logHelper = LogHelper.getInstance();

export class FileItem {
    file: File;
    status: FileStatus = FileStatus.WAITING;
    hash: string = FileStatus.WAITING;
    method: string = '待选择';
    difference: HTMLSpanElement | undefined;
    html: ListItem;

    // private worker: Worker = new Worker(new URL('hash-worker.ts', import.meta.url), { type: 'module' });
    private progressBar: CircularProgress;

    constructor(file: File) {
        this.file = file;

        const itemContainer: ListItem = document.createElement('mdui-list-item');
        itemContainer.headline = file.name;
        itemContainer.headlineLine = 1;
        itemContainer.description = this.status;
        itemContainer.descriptionLine = 1;

        const progressBar: CircularProgress = document.createElement('mdui-circular-progress');
        progressBar.slot = 'end-icon';
        progressBar.value = 0;
        progressBar.max = 100;

        itemContainer.appendChild(progressBar);
        itemContainer.addEventListener('click', () => {
            this.fileInfoDialog(file, this.status, this.difference);
        });

        this.html = itemContainer;
        this.progressBar = progressBar;
    }

    getHash(mode: string, method: string, checkSum?: string) {
        logHelper.log({ mode, method, checkSum });

        this.progressBar.value = undefined;
        this.method = method;

        const checkFileBtn: Button = document.querySelector('#checkFile')!;

        const chunkSize: number = Number(getStorageItem("cacheSize", 2048));
        const isClipboard: boolean = (document.querySelector('#isClipboard') as Checkbox).checked;
        const systemNotification: boolean = string2Boolean(getStorageItem("systemNotification", false));

        checkFileBtn.disabled = true;

        const worker = new Worker(new URL('hash-worker.ts', import.meta.url), { type: 'module' });
        worker.onmessage = (event: MessageEvent) => {
            const type = event.data.type;
            const data = event.data.data;

            switch (type) {
                case 'progress':
                    this.status = FileStatus.COMPUTING
                    const { progress, estimatedRemainingTime } = data;
                    this.progressBar.value = progress;

                    const formattedTime = formatTime(estimatedRemainingTime);
                    this.html.description = `已完成 ${progress.toFixed(2)}%，还需 ${formattedTime}`;

                    break;
                case 'result':
                    this.hash = data;
                    this.status = FileStatus.FINISHED;

                    checkFileBtn.disabled = false;

                    if (systemNotification) {
                        sendAppNotification(`${method} 计算完成`, `${method} 值为 ${this.hash} ，详情请在应用内查看`);
                    }

                    switch (mode) {
                        case 'check':
                            // index.ts 已对用户输入 Hash 进行判空
                            const userHash = checkSum!.toLowerCase();
                            const genHash = this.hash.toLowerCase();
                            if (userHash === genHash) {
                                this.html.description = '校验通过';
                            } else {
                                this.html.description = '校验失败';
                                const compareResult = compareHash(userHash, genHash);
                                compareResult.style.wordBreak = 'break-all';
                                this.difference = compareResult;
                            }

                            break;
                        case 'generate':
                            this.html.description = `${method} 值：${this.hash}`;
                            if (isClipboard) {
                                writeClipboard(this.hash);
                            }
                            break;
                        default:
                            logHelper.log(this.hash);
                    }

                    worker.terminate();
                    break;
                default:
                    this.status = FileStatus.ERROR;
                    this.html.description = FileStatus.ERROR;
            }
        }

        worker.postMessage({ file: this.file, method, chunkSize });
    }

    private fileInfoDialog(file: File, status: FileStatus, difference?: HTMLSpanElement) {

        /*const terminateCalcLabel: HTMLAnchorElement = document.createElement('a');
        terminateCalcLabel.textContent = '立即终止计算';
        terminateCalcLabel.onclick = () => {
            this.worker.terminate();
        }
        const terminateCalc = status === FileStatus.COMPUTING? terminateCalcLabel.outerHTML : '';*/

        const hashLine: HTMLElement = document.createElement('code');
        hashLine.textContent = this.hash;
        hashLine.style.wordBreak ='break-all';

        const differenceContent = difference ? `<br>哈希对比结果（相比于您提供的哈希值）：${difference.outerHTML}` : '';
        const dialogContent: HTMLElement = document.createElement('div');
        dialogContent.innerHTML = `
            <p>
                名称：${file.name}
                <br>大小：${formatFileSize(file.size)}
                <br>状态：${status}
                <br>哈希值（计算方法：${this.method}）：${hashLine.outerHTML}
                ${differenceContent}
            </p>
        `;
        dialog({
            headline: '文件信息',
            body: dialogContent,
            actions: [
                {
                    text: "确定",
                    onClick: () => {
                        return true;
                    },
                }
            ]
        });
    }
}

export enum FileStatus {
    WAITING = '等待计算',
    COMPUTING = '计算中',
    FINISHED = '计算完成',
    ERROR = '计算错误',
    CANCELED = '已取消',
}