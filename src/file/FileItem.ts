import { FileStatus, STORAGE_CACHE_SIZE, STORAGE_CACHE_SIZE_DEFAULT, STORAGE_SYSTEM_NOTIFICATION, STORAGE_SYSTEM_NOTIFICATION_DEFAULT } from "../constants";
import { getStorageItem } from "../store/localstorage";
import { writeToClipboard } from "../utils/clipboard";
import { formatTime } from "../utils/date";
import { LogHelper } from "../utils/LogHelper";
import { sendAppNotification } from "../utils/notification";
import { compareHash, formatFileSize, string2Boolean } from "../utils/text";

import "mdui/components/tooltip.js";

import { dialog, Tooltip } from "mdui";
import type { Button } from "mdui/components/button.js";
import type { Checkbox } from "mdui/components/checkbox.js";
import type { CircularProgress } from "mdui/components/circular-progress.js";
import type { ListItem } from "mdui/components/list-item.js";

const logHelper = LogHelper.getInstance();

export class FileItem {
    file: File;
    status: FileStatus = FileStatus.WAITING;
    hash: string = FileStatus.WAITING;
    algorithm: string = "待选择";
    difference: HTMLSpanElement | undefined;
    html: ListItem;

    private worker: Worker = new Worker(
        new URL("hash-worker.ts", import.meta.url),
        { type: "module" }
    );
    private progressBar: CircularProgress;

    constructor(file: File) {
        this.file = file;

        const itemContainer: ListItem = document.createElement("mdui-list-item");
        itemContainer.headline = file.name;
        itemContainer.headlineLine = 1;
        itemContainer.description = this.status;
        itemContainer.descriptionLine = 1;

        const progressBar: CircularProgress = document.createElement(
            "mdui-circular-progress"
        );
        progressBar.slot = "end-icon";
        progressBar.value = 0;
        progressBar.max = 100;

        itemContainer.appendChild(progressBar);
        itemContainer.addEventListener("click", () => {
            this.fileInfoDialog(file, this.status, this.difference);
        });

        this.html = itemContainer;
        this.progressBar = progressBar;
    }

    getHash(mode: string, algorithm: string, checkSum?: string) {
        logHelper.log({ mode, algorithm, checkSum });

        this.progressBar.value = undefined;
        this.algorithm = algorithm;

        const checkFileBtn: Button = document.querySelector("#checkFile")!;

        const chunkSize: number = Number(getStorageItem(STORAGE_CACHE_SIZE, STORAGE_CACHE_SIZE_DEFAULT));
        const isClipboard: boolean = (
            document.querySelector("#isClipboard") as Checkbox
        ).checked;
        const systemNotification: boolean = string2Boolean(
            getStorageItem(STORAGE_SYSTEM_NOTIFICATION, STORAGE_SYSTEM_NOTIFICATION_DEFAULT)
        );

        checkFileBtn.disabled = true;

        this.worker.onmessage = (event: MessageEvent) => {
            const type = event.data.type;
            const data = event.data.data;

            switch (type) {
                case "progress":
                    this.status = FileStatus.COMPUTING;
                    const { progress, estimatedRemainingTime } = data;
                    this.progressBar.value = progress;

                    const formattedTime = formatTime(estimatedRemainingTime);
                    this.html.description = `已完成 ${progress.toFixed(
                        2
                    )}%，还需 ${formattedTime}`;

                    break;
                case "result":
                    this.hash = data;
                    this.status = FileStatus.FINISHED;

                    checkFileBtn.disabled = false;

                    if (systemNotification) {
                        sendAppNotification(
                            `${algorithm} 计算完成`,
                            `${algorithm} 值为 ${this.hash} ，详情请在应用内查看`
                        );
                    }

                    switch (mode) {
                        case "check":
                            // index.ts 已对用户输入 Hash 进行判空
                            const userHash = checkSum!.toLowerCase();
                            const genHash = this.hash.toLowerCase();
                            if (userHash === genHash) {
                                this.html.description = "校验通过";
                            } else {
                                this.html.description = "校验失败";
                                const compareResult = compareHash(userHash, genHash);
                                compareResult.style.wordBreak = "break-all";
                                this.difference = compareResult;
                            }

                            break;
                        case "generate":
                            this.html.description = `${algorithm} 值：${this.hash}`;
                            if (isClipboard) {
                                writeToClipboard(this.hash);
                            }
                            break;
                        default:
                            logHelper.log(this.hash);
                    }

                    this.worker.terminate();
                    break;
                default:
                    this.status = FileStatus.ERROR;
                    this.html.description = FileStatus.ERROR;
            }
        };

        this.worker.postMessage({ file: this.file, algorithm, chunkSize });
    }

    private fileInfoDialog(
        file: File,
        status: FileStatus,
        difference?: HTMLSpanElement
    ) {
        const dialogContent = document.createElement("div");

        const hashLine: HTMLElement = document.createElement("code");
        hashLine.textContent = this.hash;
        hashLine.style.wordBreak = "break-all";
        hashLine.style.cursor = "pointer";
        hashLine.addEventListener("click", () => {
            writeToClipboard(this.hash);
        });

        const tooltip: Tooltip = document.createElement("mdui-tooltip");
        tooltip.content = "单击即可复制";
        tooltip.appendChild(hashLine);

        // 构建对话框内容
        const infoParagraph = document.createElement("p");
        infoParagraph.innerHTML = `
        名称：${file.name}
        <br>大小：${formatFileSize(file.size)}
        <br>状态：${status}
        <br>哈希值（计算方法：${this.algorithm}）：
        `;
        infoParagraph.appendChild(tooltip);

        if (difference) {
            const diffParagraph = difference
                ? `哈希对比结果（红色是新增部分，白色是相同部分，删除线是多余部分）：${difference.outerHTML}`
                : "";
            infoParagraph.innerHTML += diffParagraph;
        }

        dialogContent.appendChild(infoParagraph);

        const actions =
            status == FileStatus.COMPUTING
                ? [
                    {
                        text: "终止计算",
                        onClick: () => {
                            const checkFileBtn: Button =
                                document.querySelector("#checkFile")!;
                            this.worker.terminate();
                            this.status = FileStatus.CANCELED;
                            this.html.description = FileStatus.CANCELED;
                            this.hash = FileStatus.CANCELED;
                            this.progressBar.value = 0;
                            checkFileBtn.disabled = false;
                            return true;
                        },
                    },
                    {
                        text: "确定",
                        onClick: () => true,
                    },
                ]
                : [
                    {
                        text: "确定",
                        onClick: () => true,
                    },
                ];

        dialog({
            headline: "文件信息",
            body: dialogContent,
            actions: actions,
        });
    }
}
