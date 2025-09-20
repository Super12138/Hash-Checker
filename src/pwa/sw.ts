/// <reference lib="webworker" />
import {
    cleanupOutdatedCaches,
    createHandlerBoundToURL,
    precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

// 监听跳过等待消息
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// self.__WB_MANIFEST 是默认的静态资源注入点
precacheAndRoute(self.__WB_MANIFEST);

// 清理过期缓存
cleanupOutdatedCaches();

let allowlist: RegExp[] | undefined;
// 开发模式下禁用预缓存以避免缓存问题
if (import.meta.env.DEV) allowlist = [/^\/$/];

// 注册导航路由以实现离线访问
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist }));
