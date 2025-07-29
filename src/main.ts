import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import { createApp } from "vue";

import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();
pinia.use(
    createPersistedState({
        storage: localStorage,
    }),
);
app.use(pinia);
app.mount("#app");
