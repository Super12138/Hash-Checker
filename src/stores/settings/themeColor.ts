import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useThemeColorStore = defineStore(
    "themeColor",
    () => {
        const color = ref("#0f032b");

        function setColor(newColor: string) {
            color.value = newColor;
        }

        function $reset() {
            color.value = "#0f032b";
        }

        return { color, setColor, $reset };
    },
    { persist: true },
);

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useThemeColorStore, import.meta.hot));
}
