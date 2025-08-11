import { useNotBlankOrEmptyCheck } from "@/utils/text";
import { useFileNotBlankCheck } from "@/utils/file";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useFileConfigurationStore = defineStore("fileConfiguration", () => {
    // file
    const file = ref<File | null>(null);
    const hasFile = useFileNotBlankCheck(file);
    function setFile(newFile: File) {
        file.value = newFile;
    }

    // mode
    const mode = ref<string>("");
    const isModeValid = useNotBlankOrEmptyCheck(mode);
    function setMode(newMode: string) {
        mode.value = newMode;
    }

    // algorithm
    const algorithm = ref<string>("");
    const isAlgorithmValid = useNotBlankOrEmptyCheck(algorithm);
    function setAlgorithm(newAlgorithm: string) {
        algorithm.value = newAlgorithm;
    }

    // checkSum
    const checkSum = ref<string>("");
    const isCheckSumValid = useNotBlankOrEmptyCheck(checkSum);
    function setCheckSum(newCheckSum: string) {
        checkSum.value = newCheckSum;
    }

    function $reset() {
        file.value = null;
        mode.value = "";
        algorithm.value = "";
        checkSum.value = "";
    }

    return {
        // file
        file,
        hasFile,
        setFile,
        // mode
        mode,
        isModeValid,
        setMode,
        // algorithm
        algorithm,
        isAlgorithmValid,
        setAlgorithm,
        // checkSum
        checkSum,
        isCheckSumValid,
        setCheckSum,
        $reset,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFileConfigurationStore, import.meta.hot));
}
