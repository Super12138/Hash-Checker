// 设置项
export const STORAGE_FIRST_USE = "firstUse";
export const STORAGE_FIRST_USE_DEFAULT = false;

export const STORAGE_CACHE_SIZE = "cacheSize";
export const STORAGE_CACHE_SIZE_DEFAULT = 2048;

export const STORAGE_LENGTH_SUGGEST = "lengthSuggest";
export const STORAGE_LENGTH_SUGGEST_DEFAULT = true;

export const STORAGE_SYSTEM_NOTIFICATION = "systemNotification";
export const STORAGE_SYSTEM_NOTIFICATION_DEFAULT = false;

export const STORAGE_DYNAMIC_COLOR = "dynamicColor";
export const STORAGE_DYNAMIC_COLOR_DEFAULT = "#0f032b";

export const STORAGE_AUTO_UPDATE = "autoUpdate";
export const STORAGE_AUTO_UPDATE_DEFAULT = true;

// 常量枚举
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