import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import App from "./App.vue";

import enUS from "./locales/en-US.json";
import zhCN from "./locales/zh-CN.json";

const app = createApp(App);

const pinia = createPinia();
pinia.use(
    createPersistedState({
        storage: localStorage,
    }),
);

const i18n = createI18n({
    legacy: false,
    locale: "zh-CN",
    fallbackLocale: "en-US",
    messages: {
        "zh-CN": zhCN,
        "en-US": enUS,
    },
    datetimeFormats: {
        "en-US": {
            short: {
                year: "numeric",
                month: "short",
                day: "numeric",
            },
            long: {
                year: "numeric",
                month: "short",
                day: "numeric",
                weekday: "short",
                hour: "numeric",
                minute: "numeric",
            },
        },
        "zh-CN": {
            short: {
                year: "numeric",
                month: "short",
                day: "numeric",
            },
            long: {
                year: "numeric",
                month: "short",
                day: "numeric",
                weekday: "short",
                hour: "numeric",
                minute: "numeric",
            },
        },
    },
});

app.use(pinia);
app.use(i18n);
app.config.errorHandler = (err, instance, info) => {
    console.error(`-----应用发生全局错误 | Global Error Catched-----`);
    console.error("-----Error-----");
    console.error(err);
    console.error("-----Instance-----");
    console.error(instance);
    console.error("-----Info-----");
    console.error(info);
};
app.mount("#app");
