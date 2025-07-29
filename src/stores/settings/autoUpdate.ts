import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useAutoUpdateStore = defineStore(
    "autoUpdate",
    () => {
        const enable = ref(true);

        function setState(newValue: boolean) {
            enable.value = newValue;
        }

        return { enable, setState };
    },
    { persist: true },
);

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAutoUpdateStore, import.meta.hot));
}
