import type { Switch } from "mdui";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useAlgorithmSuggestStore = defineStore("algorithmSuggest", () => {
    const enable = ref(false);

    function setState(newValue: boolean) {
        enable.value = newValue;
    }

    return { enable, setState };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAlgorithmSuggestStore, import.meta.hot));
}
