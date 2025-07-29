import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useDrawerStore = defineStore("drawer", () => {
    const openFileOutputDrawer = ref(false);
    const openSettingsDrawer = ref(false);

    function toggleFileOutputDrawer() {
        openFileOutputDrawer.value = !openFileOutputDrawer.value;
        if (openSettingsDrawer.value) {
            openSettingsDrawer.value = false;
        }
    }

    function toggleSettingsDrawer() {
        openSettingsDrawer.value = !openSettingsDrawer.value;
        if (openFileOutputDrawer.value) {
            openFileOutputDrawer.value = false;
        }
    }

    function openOnlyFileOutputDrawer() {
        openFileOutputDrawer.value = true;
        if (openSettingsDrawer.value) {
            openSettingsDrawer.value = false;
        }
    }

    return {
        openFileOutputDrawer,
        openSettingsDrawer,
        toggleFileOutputDrawer,
        toggleSettingsDrawer,
        openOnlyFileOutputDrawer,
    };
});

// HMR 支持
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useDrawerStore, import.meta.hot));
}
