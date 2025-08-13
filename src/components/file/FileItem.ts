import { Algorithms } from "@/interfaces/Algorithms";
import { FileStatus } from "@/interfaces/FileStatus";
import { Modes } from "@/interfaces/Modes";

export class FileItem {
    name: string;
    addTime: number;
    mode: Modes = Modes.Unselected;
    algorithm: Algorithms = Algorithms.Unselected;
    status: FileStatus = FileStatus.Waiting;
    progress: number | undefined = 0;
    hash: string | undefined = undefined;
    estimetedTime: number = 0;
    checkSum: string | undefined = undefined;

    constructor(addTime: number, name: string) {
        this.addTime = addTime;
        this.name = name;
    }
}
