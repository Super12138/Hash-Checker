import { useNotBlankOrEmptyCheck } from "@/utils/text";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useAlgorithmStore = defineStore("algorithm", () => {
    const algorithm = ref<string>("");
    const isValid = useNotBlankOrEmptyCheck(algorithm);

    function setAlgorithm(newAlgorithm: string) {
        algorithm.value = newAlgorithm;
    }

    return { algorithm, isValid, setAlgorithm };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAlgorithmStore, import.meta.hot));
}
