export enum BuildVariant {
    Web = 'web',
    Desktop = 'desktop',
    Dev = 'dev',
    Unknown = 'unknown'
}

export enum HashAlgorithm {
    Unselected = "unselected",
    MD5 = "MD5",
    SHA1 = "SHA1",
    SHA3 = "SHA3",
    SHA256 = "SHA256",
    SHA384 = "SHA384",
    SHA512 = "SHA512"
}

export enum OperationMode {
    Unselected = "unselected",
    Check = "check",
    Generate = "generate"
}

export enum WorkerResult{
    Progress = "progress",
    Result = "result",
    Error = "error"
}

export enum FileStatus {
    WAITING = '等待计算',
    COMPUTING = '计算中',
    FINISHED = '计算完成',
    ERROR = '计算错误',
    CANCELED = '已取消',
}