import { FileStatus } from "@/interfaces/FileStatus";

export class FileItem {
    file: File;
    name: string;
    addTime: number;
    status: FileStatus = FileStatus.WAITING;
    progress: number | undefined = 0;

    constructor(addTime: number, file: File) {
        this.addTime = addTime
        this.file = file;
        this.name = file.name;
    }
}