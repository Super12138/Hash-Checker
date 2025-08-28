import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useCacheSizeStore = defineStore(
    "cacheSize",
    () => {
        const size = ref(2048);

        function setSize(newSize: number) {
            size.value = newSize;
        }

        return { size, setSize };
    },
    { persist: true },
);

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCacheSizeStore, import.meta.hot));
}
