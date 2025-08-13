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
    locale: "zh-CN",
    fallbackLocale: "en-US",
    messages: {
        "zh-CN": zhCN,
        "en-US": enUS,
    },
});

app.use(pinia);
app.use(i18n);
app.mount("#app");
