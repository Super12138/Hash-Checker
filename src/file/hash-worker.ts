import CryptoJS from "crypto-js";
import { HashAlgorithm, WorkerResult } from "../constants";

declare let self: Worker;

function getHasher(algorithm: string) {
    switch (algorithm) {
        case HashAlgorithm.MD5:
            return CryptoJS.algo.MD5.create();
        case HashAlgorithm.SHA1:
            return CryptoJS.algo.SHA1.create();
        case HashAlgorithm.SHA3:
            return CryptoJS.algo.SHA3.create();
        case HashAlgorithm.SHA256:
            return CryptoJS.algo.SHA256.create();
        case HashAlgorithm.SHA384:
            return CryptoJS.algo.SHA384.create();
        case HashAlgorithm.SHA512:
            return CryptoJS.algo.SHA512.create();
        default:
            throw new Error(`未知校验方法或暂不支持该方法（${algorithm}）`);
    }
}

self.onmessage = async (e: MessageEvent) => {
    const { file, algorithm, chunkSize }: { file: File, algorithm: string, chunkSize: number } = e.data;
    const hasher = getHasher(algorithm);
    const startTime: number = Date.now();

    const CHUNK_SIZE: number = chunkSize * 1024;
    let processedSize: number = 0;

    for (let start = 0; start < file.size; start += CHUNK_SIZE) {
        const chunk = file.slice(start, start + CHUNK_SIZE);
        const arrayBuffer: ArrayBuffer = await chunk.arrayBuffer();
        const wordArray: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

        hasher.update(wordArray);

        // 计算剩余时间
        processedSize += chunk.size;
        const progress: number = processedSize / file.size;
        const elapsedTime: number = (Date.now() - startTime) / 1000; // 秒
        const speed: number = processedSize / elapsedTime; // 字节/秒
        const remainingSize: number = file.size - processedSize;
        const estimatedRemainingTime: number = remainingSize / speed; // 秒

        self.postMessage({
            type: WorkerResult.Progress,
            data: {
                progress: progress * 100,
                estimatedRemainingTime
            }
        });
    }

    const hash: CryptoJS.lib.WordArray = hasher.finalize();
    const result: string = hash.toString(CryptoJS.enc.Hex);
    self.postMessage({ type: WorkerResult.Result, data: result });
};