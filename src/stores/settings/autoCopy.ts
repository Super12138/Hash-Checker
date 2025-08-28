import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useAutoCopyStore = defineStore(
    "autoCopy",
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
    import.meta.hot.accept(acceptHMRUpdate(useAutoCopyStore, import.meta.hot));
}
