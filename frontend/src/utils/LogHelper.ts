export class LogHelper {
    private static instance: LogHelper;

    public static getInstance(): LogHelper {
        if (!LogHelper.instance) {
            LogHelper.instance = new LogHelper();
        }
        return LogHelper.instance;
    }

    log(message: any) {
        if (ENV === "dev") console.log(message);
    }

    info(message: any) {
        if (ENV === "dev") console.info(message);
    }

    warn(message: any) {
        console.warn(message);
    }

    error(message: any) {
        console.error(message);
    }
}