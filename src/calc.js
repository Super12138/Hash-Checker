import CryptoJS from "crypto-js";

export function calc(pattern, method, file, hash) {
    console.log("从index.js接收的参数：" + pattern + method + file)
    const ttitle = document.querySelector('#ttitle');
    const tips = document.querySelector('#tips');
    const isClipboard = document.querySelector('#isclipboard').checked;
    const progress = document.querySelector('#progress');
    const progressbar = document.querySelector('#progressbar');

    // 分片处理文件代码来自 GPT 3.5-Turbo
    const CHUNK_SIZE = 64 * 1024; // 每片大小为64KB
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = 0, totalLoaded = 0;
    let hashBuffers = []; // 哈希计算缓冲
    // const reader = new FileReader();

    ttitle.innerHTML = "状态：";
    tips.innerHTML = "正在将文件缓存...";
    progress.style.display = "block"

    // 处理分片读取的函数
    function processChunk() {
        if (currentChunk === chunkCount) {
            tips.innerHTML = "正在计算...";
            const wordArray = CryptoJS.lib.WordArray.create(hashBuffers.flat());
            const calchash = method == 'md5' ? CryptoJS.MD5(wordArray).toString(CryptoJS.enc.Hex) : CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
            console.log(calchash);
            if (pattern == "check") {
                const userhash = hash.toLowerCase();
                const genhash = calchash.toLowerCase();
                if (userhash == genhash) {
                    tips.innerHTML = "校验成功<br>文件" + method + "值：" + "<code>" + calchash + "</code>";
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
                else {
                    tips.innerHTML = "校验失败<br>文件" + method + "值：<code>" + calchash + "</code><br>请检查获取的校验值是否有误（如多余的空格，复制时少复制了字符），或是校验值和校验方法不一致（如校验值是MD5，但校验方法是SHA256)；如果没有上述任一情况请自行解决";
                    mdui.dialog({
                        title: '校验失败',
                        content: '请检查获取的校验值是否有误（如多余的空格），或是校验值和校验方法不一致（如校验值是MD5，但校验方法是SHA256)；如果没有上述任一情况请自行解决',
                        buttons: [
                            {
                                text: '确认'
                            }
                        ]
                    });
                }
                progress.style.display = "none"
            }
            else {
                if (isClipboard) {
                    navigator.clipboard.writeText(calchash).catch(e => console.error(e));
                    tips.innerHTML = "计算完成，" + method + "值已写入您的剪贴板！<br>" + method + "值：<code>" + calchash + "</code>";
                }
                else {
                    tips.innerHTML = method + "计算完成<br>" + method + "值：<code>" + calchash + "</code>";
                }
                progress.style.display = "none"
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
            progressbar.classList.remove('mdui-progress-indeterminate');
            progressbar.classList.add('mdui-progress-determinate');
            progressbar.style.width = "0%";
            tips.innerHTML = "正在将文件缓存...";
            console.log(Math.floor(totalLoaded / file.size * 100) + "%");
            progressbar.style.width = Math.floor(totalLoaded / file.size * 100) + "%";
            hashBuffers.push(new Uint8Array(subReader.result));
            if (Math.floor(totalLoaded / file.size * 100) > "90") {
                tips.innerHTML = "正在计算，页面可能无响应，请耐心等待...";
            }
            processChunk();
        }
    }

    processChunk();
}
