import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useAutoUpdateStore = defineStore("autoUpdate", () => {
    const enable = ref(false);

    function setState(newValue: boolean) {
        enable.value = newValue;
    }

    return { enable, setState };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAutoUpdateStore, import.meta.hot));
}
