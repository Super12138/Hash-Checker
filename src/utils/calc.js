import CryptoJS from "crypto-js";
import { sendtext, gettext } from "../utils/transfer";
import { getCookie } from "../cookie/cookie";
import { sendNotification } from "./notification";
import { clipboard } from "electron";

export function calc(pattern, method, file, hash) {
    console.log("从index.js接收的参数：" + pattern + method + file)
    const ttitle = document.querySelector('#ttitle');
    const tips = document.querySelector('#tips');
    const isClipboard = document.querySelector('#isclipboard').checked;
    const progress = document.querySelector('#progress');
    const progressbar = document.querySelector('#progressbar');
    const timetip = document.querySelector('#timetip');
    const calcbtn = document.querySelector('#calcbtn');
    const choosefilebtn = document.querySelector('#openfile');
    const isSystemNotification = document.querySelector('#isSystemNotification').checked;

    // 分片处理文件代码来自 GPT 3.5-Turbo + Super12138优化
    const cacheSizeValuecalc = getCookie("cacheSize");
    const CHUNK_SIZE = cacheSizeValuecalc * 1024;
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = 0, totalLoaded = 0;
    let hashBuffers = []; // 哈希计算缓冲
    // const reader = new FileReader();

    ttitle.innerHTML = "状态：";
    tips.innerHTML = "正在将文件缓存...";
    progress.style.display = "block";
    timetip.style.display = "block";
    calcbtn.disabled = true;
    choosefilebtn.disabled = true;


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
            calcbtn.disabled = false;
            choosefilebtn.disabled = false;
            progress.style.display = "none"
            timetip.style.display = "none"
            if (pattern == "check") {
                const userhash = hash.toLowerCase();
                const genhash = calchash.toLowerCase();
                if (userhash == genhash) {
                    tips.innerHTML = `校验成功<br>文件${method}值：<code>${calchash}</code>`;
                    if (isSystemNotification) {
                        sendNotification("校验成功", "请放心使用")
                    }
                    else {
                        mdui.dialog({
                            title: '校验成功',
                            content: '请放心使用',
                            buttons: [
                                {
                                    text: '完成'
                                }
                            ]
                        });
                    }
                }
                else {
                    tips.innerHTML = `校验失败<br>文件${method}值：<code>${calchash}</code><br>请检查获取的校验值是否有误（如多余的空格，复制时少复制了字符），或是校验值和校验方法不一致（如校验值是MD5，但校验方法是SHA256)；如果没有上述任一情况请自行解决`;
                    if (isSystemNotification) {
                        sendNotification("校验失败", "请检查获取的校验值是否有误（如多余的空格，复制时少复制了字符），或是校验值和校验方法不一致（如校验值是MD5，但校验方法是SHA256)；如果没有上述任一情况请自行解决")
                    }
                    else {
                        mdui.dialog({
                            title: '校验失败',
                            content: '请检查获取的校验值是否有误（如多余的空格，复制时少复制了字符），或是校验值和校验方法不一致（如校验值是MD5，但校验方法是SHA256)；如果没有上述任一情况请自行解决',
                            buttons: [
                                {
                                    text: '确认'
                                }
                            ]
                        });
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
                    else{
                        mdui.dialog({
                            title: '计算完成',
                            content: `${method}值已写入您的剪贴板！\n${method}值：${calchash}`,
                            buttons: [
                                {
                                    text: '确定'
                                }
                            ]
                        });
                    }
                }
                else {
                    tips.innerHTML = `${method}计算完成<br>${method}值：<code>${calchash}</code>`;
                    if (isSystemNotification) {
                        sendNotification("计算完成", `${method}值：${calchash}`)
                    }
                    else{
                        mdui.dialog({
                            title: '计算完成',
                            content: `${method}值：${calchash}`,
                            buttons: [
                                {
                                    text: '确定'
                                }
                            ]
                        });
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
            const percentage = Math.floor(totalLoaded / file.size * 100)
            progressbar.classList.remove('mdui-progress-indeterminate');
            progressbar.classList.add('mdui-progress-determinate');
            progressbar.style.width = "0%";
            tips.innerHTML = "正在将文件缓存...";
            console.log(`${percentage}%`);
            progressbar.style.width = `${percentage}%`;

            hashBuffers.push(new Uint8Array(subReader.result));
            const only = "true"
            if (percentage == "0") {
                const startTimeorig = Date.now();
                const startTime = new Date(startTimeorig);
                sendtext(startTime);
                console.log(`开始计时 ${startTime}`)
            }
            if (percentage == "1") {
                const endTimeorig = Date.now();
                const endTime = new Date(endTimeorig);
                const startTime = gettext();
                console.log(`停止计时${endTime}，${startTime}`);
                const orignaltime = endTime - startTime;
                console.log(`经过时间：${orignaltime}`);
                const onetime = orignaltime / 1000; // 将毫秒转换成秒
                // 开始计算剩余时间
                const totalTimeorig = onetime * 100;
                const totalTime = totalTimeorig.toFixed(3);
                progressbar.style.width = `${percentage}%`;
                sendtext(totalTime, only);
            }
            const totalTime = gettext(only)
            timetip.innerHTML = `预计缓存完毕需要：${totalTime}秒<br><small>注：预计时间可能不准确，仅供参考</small><br>当前已完成：${percentage}%`;
            if (percentage > "95") {
                tips.innerHTML = "正在计算，页面可能无响应，请耐心等待...";
            }
            processChunk();
        }
    }

    processChunk();
}
