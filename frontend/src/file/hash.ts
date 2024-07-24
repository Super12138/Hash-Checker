import { getStorageItem } from "../store/localstorage";
import { formatTime } from '../utils/date';
import { writeClipboard } from '../utils/clipboard';
import { compareHash } from '../utils/text';

import type { Checkbox } from 'mdui/components/checkbox.js';
import type { LinearProgress } from 'mdui/components/linear-progress.js';
import type { Button } from 'mdui/components/button.js';
import 'mdui/components/linear-progress.js';
import { sendNotification } from "../utils/notification";

/**
 * 计算哈希值
 * @param mode 计算模式：生成模式/校验模式
 * @param method 计算方法：MD5/SHA1/SHA3/SHA256/SHA384/SHA512
 * @param file 文件
 * @param hash 可选（在模式为校验模式时使用）用户提供的文件的哈希值
 */
export function calc(mode: string, method: string, file: File, hash?: string) {
    const outputTitle: HTMLHeadingElement = document.querySelector('#outputTitle')!;
    const outputTips: HTMLParagraphElement = document.querySelector('#outputTips')!;
    const progressBar: LinearProgress = document.querySelector('#progressBar')!;

    const terminateCalcBtn: Button = document.querySelector('#terminateCalc')!;
    const checkFileBtn: Button = document.querySelector('#checkFile')!;
    const chooseFileBtn: Button = document.querySelector('#openFile')!;

    const chunkSize: number = Number(getStorageItem("cacheSize"));
    const isClipboard: boolean = (document.querySelector('#isClipboard') as Checkbox).checked;
    const systemNotification: boolean = Boolean(getStorageItem("systemNotification"));

    outputTitle.innerHTML = "状态：";
    outputTips.innerHTML = "准备缓存文件";

    checkFileBtn.disabled = true;
    chooseFileBtn.disabled = true;
    terminateCalcBtn.style.display = "block";
    progressBar.style.display = "block";

    const worker = new Worker(new URL('hash-worker.ts', import.meta.url), { type: 'module' });

    worker.onmessage = (event: MessageEvent) => {
        const { type, data } = event.data;

        if (type === 'progress') {
            const { progress, estimatedRemainingTime } = data;

            progressBar.value = progress;

            const formattedTime = formatTime(estimatedRemainingTime);
            outputTips.innerHTML = `正在缓存文件，已完成 <strong>${progress.toFixed(2)}%</strong>，还需 <strong>${formattedTime}</strong>`;
        } else if (type === 'result') {
            const calcHash = data;
            checkFileBtn.disabled = false;
            chooseFileBtn.disabled = false;
            terminateCalcBtn.style.display = "none";
            progressBar.style.display = "none";
            progressBar.value = 0;

            outputTips.innerHTML = `计算完成，${method} 值为 <code>${calcHash} </code>`;
            if (systemNotification) {
                sendNotification(`${method} 计算完成`, `${method} 值为 ${calcHash} ，详情请在应用内查看`);
            }

            switch (mode) {
                case "check":
                    // index.ts 已对用户输入 hash 进行判空
                    const userHash = hash!.toLowerCase();
                    const genHash = calcHash.toLowerCase();
                    if (userHash === genHash) {
                        outputTips.innerHTML += "，校验通过"
                    } else {
                        outputTips.innerHTML += `，<strong class="mdui-text-color-red-700">校验失败</strong>`
                        const compareResult = compareHash(userHash, genHash);
                        outputTips.innerHTML += `<br>哈希对比结果（相比于您提供的哈希值）：`;
                        outputTips.appendChild(compareResult);
                    }
                    break;
                case "generate":
                    if (isClipboard) {
                        writeClipboard(calcHash);
                    }
                    break;
                default:
                    console.log(calcHash);
            }

            worker.terminate();
        }
    };

    worker.postMessage({ file, method, chunkSize });

    terminateCalcBtn.addEventListener('click', () => {
        worker.terminate();

        chooseFileBtn.disabled = false;
        checkFileBtn.disabled = false;
        terminateCalcBtn.style.display = "none";
        progressBar.style.display = "none";
        progressBar.value = 0;

        outputTips.innerHTML = "计算已被用户终止";
    });
}