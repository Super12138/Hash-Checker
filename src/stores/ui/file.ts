import { useFileNotBlankCheck } from "@/utils/file";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useFileStore = defineStore("file", () => {
    const file = ref<File | null>(null);
    const hasFile = useFileNotBlankCheck(file);

    function setFile(newFile: File) {
        file.value = newFile;
    }
    return { file, hasFile, setFile };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFileStore, import.meta.hot));
}
