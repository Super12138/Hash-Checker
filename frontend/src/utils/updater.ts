import { GitHubApiReleaseResponse } from "../interfaces";
import { LogHelper } from "./LogHelper";

import { marked } from "marked";
import { dialog } from 'mdui/functions/dialog.js';
import { OpenURLInBrowser } from "../../wailsjs/go/main/App";

const logHelper: LogHelper = LogHelper.getInstance();
const UPDATE_URL = "https://api.github.com/repos/Super12138/Hash-Checker/releases/latest";

export function getUpdate() {
    // 非桌面端不进行检查
    if (VARIANT !== "desktop") return;
    // if (string2Boolean(getStorageItem("checkUpdates"))) return;
    fetch(UPDATE_URL)
        .then(response => response.text())
        .then((data: string) => {
            const json: GitHubApiReleaseResponse = JSON.parse(data);
            const latestVersion = json.name;
            // 获取版本号数字
            const latestVersionNumber:number = Number.parseInt(latestVersion.replaceAll(".", ""));
            const currentVersionNumber:number = Number.parseInt(VERSION_NAME.replaceAll(".", ""));
            logHelper.log(`当前版本：${currentVersionNumber}`);
            logHelper.log(`最新版本：${latestVersionNumber}`);
            if (latestVersionNumber <= currentVersionNumber) return; // 已经是最新版本
            const container: HTMLDivElement = document.createElement("div");
            container.innerHTML = marked.parse(json.body).toString(); // 解析 GitHub Release 的 Markdown 更新日志
            dialog({
                headline: `更新至 ${json.name}`,
                description: "检测到 Hash Checker 有新版本，下方为本次更新内容，是否更新?",
                body: container,
                actions: [
                    {
                        text: "取消",
                    },
                    {
                        text: "确定",
                        onClick: () => {
                            OpenURLInBrowser("https://github.com/Super12138/Hash-Checker/releases/");
                            true;
                        },
                    }
                ]
            });
        })
        .catch((error: any) => {
            logHelper.error(error);
        });
}