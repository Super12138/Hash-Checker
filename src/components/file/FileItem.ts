import { Algorithms } from "@/interfaces/Algorithms";
import { FileStatus } from "@/interfaces/FileStatus";
import { Modes } from "@/interfaces/Modes";

export class FileItem {
    file: File; // 可能不需要保存整个文件
    name: string;
    addTime: number;
    mode: Modes = Modes.Unselected;
    algorithm: Algorithms = Algorithms.Unselected;
    status: FileStatus = FileStatus.Waiting;
    progress: number | undefined = 0;
    hash: string | undefined = undefined;

    constructor(addTime: number, file: File) {
        this.addTime = addTime;
        this.file = file;
        this.name = file.name;
    }
}
