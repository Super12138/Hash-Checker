import { acceptHMRUpdate, defineStore } from "pinia";

export const useFileConfigurationStore = defineStore("fileConfiguration", () => {

    return {};
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFileConfigurationStore, import.meta.hot));
}
