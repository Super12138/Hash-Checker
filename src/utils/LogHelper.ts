/**
 *  JS 内置 Log 函数的封装
 * 
 * * 支持在开发环境下输出**全部级别**的日志
 * * 支持在生产环境下只输出级别为**警告**和**错误**日志
 */
export class LogHelper {
    private static instance: LogHelper;

    public static getInstance(): LogHelper {
        if (!LogHelper.instance) {
            LogHelper.instance = new LogHelper();
        }
        return LogHelper.instance;
    }

    log(message: any) {
        if (import.meta.env.DEV) console.log(message);
    }

    info(message: any) {
        if (import.meta.env.DEV) console.info(message);
    }

    warn(message: any) {
        console.warn(message);
    }

    error(message: any) {
        console.error(message);
    }
}