import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useLanguageStore = defineStore(
    "language",
    () => {
        const language = ref(navigator.language);

        function setLanguage(newLanguage: string) {
            language.value = newLanguage;
        }

        function $reset() {
            language.value = navigator.language;
        }

        return { language, setLanguage, $reset };
    },
    { persist: true },
);

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useLanguageStore, import.meta.hot));
}
