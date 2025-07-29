import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useThemeColorStore = defineStore(
    "themeColor",
    () => {
        const color = ref("#");

        function setColor(newColor: string) {
            color.value = newColor;
        }

        return { color, setColor };
    },
    { persist: true },
);

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useThemeColorStore, import.meta.hot));
}
