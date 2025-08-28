import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";

export const useSystemNotificationStore = defineStore(
    "systemNotification",
    () => {
        const enable = ref(false);

        function setState(newValue: boolean) {
            enable.value = newValue;
        }

        return { enable, setState };
    },
    { persist: true },
);

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSystemNotificationStore, import.meta.hot));
}
