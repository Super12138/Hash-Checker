import { useNotBlankOrEmptyCheck } from "@/utils/text";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useModeStore = defineStore("mode", () => {
    const mode = ref<string>("");
    const isValid = useNotBlankOrEmptyCheck(mode);

    function setMode(newMode: string) {
        mode.value = newMode;
    }

    return { mode, isValid, setMode };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useModeStore, import.meta.hot));
}
