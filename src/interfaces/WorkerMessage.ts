import type { Algorithms } from "./Algorithms";
import type { WorkerResult } from "./WorkerResults";

export interface MainPostData {
    file: File;
    algorithm: Algorithms;
    chunkSize: number;
}

export interface WorkerPostData {
    type: WorkerResult;
    data: string | ProgressInfo;
}

export interface ProgressInfo {
    progress: number;
    estimatedRemainingTime: number;
}
