import CryptoJS from "crypto-js";
import { sendText, getText } from "../utils/transfer";
import { getValue } from "../store/store";
import { sendNotification } from "./notification";
import { ipcRenderer, clipboard } from "electron";
import { simpleDialog } from "./dialog";
import 'mdui/components/linear-progress.js';

export async function calc(pattern, method, file, hash) {
    console.log("从index.js接收的参数：" + pattern + method + file)
    const ttitle = document.querySelector('#ttitle');
    const tips = document.querySelector('#tips');
    const isClipboard = document.querySelector('#isClipboard').checked;
    // const progressBar = document.querySelector('#progressBar');
    const timeTip = document.querySelector('#timetip');
    const calcBtn = document.querySelector('#calcbtn');
    const chooseFileBtn = document.querySelector('#openfile');
    const isSystemNotification = document.querySelector('#isSystemNotification').checked;

    // 分片处理文件代码来自 GPT 3.5-Turbo + Super12138优化
    const cacheSizeValuecalc = await getValue("cacheSize");
    const CHUNK_SIZE = cacheSizeValuecalc * 1024;
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = 0, totalLoaded = 0;
    let hashBuffers = []; // 哈希计算缓冲
    // const reader = new FileReader();

    ttitle.innerHTML = "状态：";
    tips.innerHTML = "正在将文件缓存...";

    timeTip.style.display = "block";
    calcBtn.disabled = true;
    chooseFileBtn.disabled = true;


    // 处理分片读取的函数
    function processChunk() {
        if (currentChunk === chunkCount) {
            tips.innerHTML = "正在计算，页面可能无响应，请耐心等待...";
            const wordArray = CryptoJS.lib.WordArray.create(hashBuffers.flat());
            const cryptoObj = CryptoJS,
                methodNameStr = method.toString(),
                tempmethod = cryptoObj[methodNameStr];
            const calchash = tempmethod(wordArray).toString(CryptoJS.enc.Hex);
            console.log(calchash);

            calcBtn.disabled = false;
            chooseFileBtn.disabled = false;
            timeTip.style.display = "none";
            ipcRenderer.send('clear-progress');

            if (pattern == "check") {
                const userhash = hash.toLowerCase();
                const genhash = calchash.toLowerCase();
                if (userhash == genhash) {
                    tips.innerHTML = `校验成功<br>文件${method}值：<code>${calchash}</code>`;
                    if (isSystemNotification) {
                        sendNotification("校验成功", "请放心使用")
                    }
                    else {
                        simpleDialog("校验成功", "请放心使用", "确定");
                    }
                }
                else {
                    tips.innerHTML = `校验失败<br>文件${method}值：<code>${calchash}</code><br>请检查获取的校验值是否有误（如多余的空格，复制时少复制了字符），或是校验值和校验方法不一致（如校验值是MD5，但校验方法是SHA256)；如果没有上述任一情况请自行解决`;
                    if (isSystemNotification) {
                        sendNotification("校验失败", "请检查获取的校验值是否有误（如多余的空格，复制时少复制了字符），或是校验值和校验方法不一致（如校验值是MD5，但校验方法是SHA256)；如果没有上述任一情况请自行解决")
                    }
                    else {
                        simpleDialog("校验失败", "请检查获取的校验值是否有误（如多余的空格，复制时少复制了字符），或是校验值和校验方法不一致（如校验值是MD5，但校验方法是SHA256)；如果没有上述任一情况请自行解决", "确定");
                    }
                }
            }
            else {
                if (isClipboard) {
                    clipboard.writeText(calchash)
                    tips.innerHTML = `计算完成，${method}值已写入您的剪贴板！<br>${method}值：<code>${calchash}</code>`;
                    if (isSystemNotification) {
                        sendNotification("计算完成", `${method}值已写入您的剪贴板！\n${method}值：${calchash}`)
                    }
                    else {
                        simpleDialog("计算完成", `${method}值已写入您的剪贴板!\n${method}值：${calchash}`, "确定");
                    }
                }
                else {
                    tips.innerHTML = `${method}计算完成<br>${method}值：<code>${calchash}</code>`;
                    if (isSystemNotification) {
                        sendNotification("计算完成", `${method}值：${calchash}`)
                    }
                    else {
                        simpleDialog("计算完成", `${method}值：${calchash}`, "确定");
                    }
                }
            }
            return;
        }

        let start = currentChunk * CHUNK_SIZE;
        let end = Math.min(start + CHUNK_SIZE, file.size);
        let chunkBlob = file.slice(start, end);
        let subReader = new FileReader();
        subReader.readAsArrayBuffer(chunkBlob);

        // 每块处理完之后的回调
        subReader.onload = () => {
            currentChunk++;
            totalLoaded += subReader.result.byteLength;

            const percentageorig = totalLoaded / file.size;
            const percentage = Math.floor(totalLoaded / file.size * 100);

            // progressBar.value = 0;
            tips.innerHTML = "正在将文件缓存...";
            console.log(`${percentage}%`);
            // progressBar.value = percentageorig;
            ipcRenderer.send('set-progress', percentageorig);
            hashBuffers.push(new Uint8Array(subReader.result));

            const only = "true";
            if (percentage === 0) {
                const startTimeorig = Date.now();
                const startTime = new Date(startTimeorig);
                sendText(startTime);
                console.log(`开始计时 ${startTime}`);
            }
            if (percentage === 1) {
                const endTimeorig = Date.now();
                const endTime = new Date(endTimeorig);

                const startTime = getText();
                console.log(`停止计时${endTime}，${startTime}`);
                const orignaltime = endTime - startTime;
                console.log(`经过时间：${orignaltime}`);
                const onetime = orignaltime / 1000; // 将毫秒转换成秒
                
                // 开始计算剩余时间
                const totalTimeorig = onetime * 100;
                const totalTime = totalTimeorig.toFixed(3);

                // progressBar.value = percentageorig;

                sendText(totalTime, only);
            }

            const totalTime = getText(only);
            timeTip.innerHTML = `预计缓存完毕需要：${totalTime}秒<br><small>注：预计时间可能不准确，仅供参考</small><br>当前已完成：${percentage}%`;
            if (percentage > 95) {
                tips.innerHTML = "正在计算，应用可能无响应，请耐心等待……";
            }
            processChunk();
        };
    }

    processChunk();
}
