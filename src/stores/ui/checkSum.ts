import { useNotBlankOrEmptyCheck } from "@/utils/text";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useCheckSumStore = defineStore("checkSum", () => {
    const checkSum = ref<string>("");
    const isValid = useNotBlankOrEmptyCheck(checkSum);

    function setCheckSum(newCheckSum: string) {
        checkSum.value = newCheckSum;
    }

    return { checkSum, isValid, setCheckSum };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCheckSumStore, import.meta.hot));
}
