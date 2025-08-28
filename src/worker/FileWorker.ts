import { Algorithms } from "@/interfaces/Algorithms";
import type { MainPostData, WorkerPostData } from "@/interfaces/WorkerMessage";
import { WorkerResult } from "@/interfaces/WorkerResults";

import CryptoJS from "crypto-js";

function getHasher(algorithm: Algorithms) {
    switch (algorithm) {
        case Algorithms.MD5:
            return CryptoJS.algo.MD5.create();
        case Algorithms.SHA1:
            return CryptoJS.algo.SHA1.create();
        case Algorithms.SHA3:
            return CryptoJS.algo.SHA3.create();
        case Algorithms.SHA256:
            return CryptoJS.algo.SHA256.create();
        case Algorithms.SHA384:
            return CryptoJS.algo.SHA384.create();
        case Algorithms.SHA512:
            return CryptoJS.algo.SHA512.create();
        default:
            throw new Error(`未知校验方法或暂不支持该方法（${algorithm}）`);
    }
}

self.onmessage = async (ev: MessageEvent) => {
    const { file, algorithm, chunkSize }: MainPostData = ev.data;
    const hasher = getHasher(algorithm);
    const startTime = Date.now();

    const CHUNK_SIZE = chunkSize * 1024;
    let processedSize = 0;

    for (let start = 0; start < file.size; start += CHUNK_SIZE) {
        const chunk = file.slice(start, start + CHUNK_SIZE);
        const arrayBuffer = await chunk.arrayBuffer();
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

        hasher.update(wordArray);

        // 计算剩余时间
        processedSize += chunk.size;
        const progress = processedSize / file.size;
        const elapsedTime = (Date.now() - startTime) / 1000; // 秒
        const speed = processedSize / elapsedTime; // 字节/秒
        const remainingSize = file.size - processedSize;
        const estimatedRemainingTime = remainingSize / speed; // 秒

        const msg: WorkerPostData = {
            type: WorkerResult.Progress,
            data: {
                progress: progress,
                estimatedRemainingTime,
            },
        };
        self.postMessage(msg);
    }

    const hash = hasher.finalize();
    const result = hash.toString(CryptoJS.enc.Hex);

    const msg: WorkerPostData = { type: WorkerResult.Result, data: result };
    self.postMessage(msg);
};
