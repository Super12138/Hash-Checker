import { Algorithms } from "@/interfaces/Algorithms";
import { FileStatus } from "@/interfaces/FileStatus";
import { Modes } from "@/interfaces/Modes";

export class FileItem {
    file: File;
    name: string;
    addTime: number;
    mode: Modes = Modes.Unselected;
    algorithm: Algorithms = Algorithms.Unselected;
    status: FileStatus = FileStatus.Waiting;
    progress: number | undefined = 0;

    constructor(addTime: number, file: File) {
        this.addTime = addTime;
        this.file = file;
        this.name = file.name;
    }
}
