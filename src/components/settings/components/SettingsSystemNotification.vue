<script setup lang="ts">
import "mdui/components/list-item.js";
import "mdui/components/switch.js";

import "@mdui/icons/notifications-active--outlined.js";
import { watch } from "vue";
import { useWebNotification } from "@vueuse/core";
import { alert, dialog, snackbar } from "mdui";
import { useI18n } from "vue-i18n";
import { NOTIFICATION_TAG } from "@/interfaces/constants";

const props = defineProps<{
    checked: boolean;
}>();

defineEmits<{
    (e: "change", value: boolean): void;
}>();

const { t } = useI18n();

const { isSupported, permissionGranted, show } = useWebNotification();

const sendTestNotification = () => {
    if (isSupported.value && permissionGranted.value) {
        show({
            title: t("notification.test-title"),
            dir: "auto",
            lang: "zh",
            renotify: true,
            tag: NOTIFICATION_TAG,
        });
    } else {
        snackbar({
            message: t("notification.not-supported"),
        });
    }
};

// 可能需要在确定一次以后再也不显示弹窗
watch(
    permissionGranted,
    (granted) => {
        if (!granted) {
            alert({
                headline: t("tip"),
                description: t("settings.system-notification.permission-info"),
            });
        }
    },
    { immediate: true },
);

watch(
    () => props.checked,
    (enabled) => {
        if (enabled) sendTestNotification();
    },
);
</script>

<template>
    <mdui-list-item
        :headline="t('settings.system-notification.label')"
        :description="t('settings.system-notification.description')"
        @click.self="$emit('change', !checked)"
    >
        <mdui-icon-notifications-active--outlined
            slot="icon"
        ></mdui-icon-notifications-active--outlined>
        <mdui-switch
            slot="end-icon"
            :checked="checked"
            @change.self="
                (e: CustomEvent<void> & Event) => {
                    if (e.target && 'checked' in e.target) {
                        $emit('change', (e.target as HTMLInputElement).checked);
                    }
                }
            "
        ></mdui-switch>
    </mdui-list-item>
    <mdui-button v-if="checked" variant="tonal" full-width>
        {{ t("settings.system-notification.button") }}
    </mdui-button>
</template>

<style lang="css" scoped>
mdui-button {
    margin: 0.5rem 1rem;
}
</style>
