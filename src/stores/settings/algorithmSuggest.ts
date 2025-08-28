import type { Switch } from "mdui";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useAlgorithmSuggestStore = defineStore(
    "algorithmSuggest",
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
    import.meta.hot.accept(acceptHMRUpdate(useAlgorithmSuggestStore, import.meta.hot));
}
