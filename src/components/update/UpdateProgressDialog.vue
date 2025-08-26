<script setup lang="ts">
import { DownloadStatus } from "@/interfaces/DownloadingStatus";
import "mdui/components/linear-progress.js";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
    progress: number | undefined;
    status: DownloadStatus;
}>();

const open = defineModel<boolean>({ required: true });
const canClose = ref<boolean>(false);

const { t } = useI18n();

const description = computed(() => {
    switch (props.status) {
        case DownloadStatus.Fetching:
            return t("update-dialog.progress.fetching");
        case DownloadStatus.Started:
            return t("update-dialog.progress.starting");
        case DownloadStatus.Downloading:
            return t("update-dialog.progress.downloading");
        case DownloadStatus.Finished:
            return t("update-dialog.progress.finished");
        case DownloadStatus.Error:
            return t("update-dialog.progress.error");
    }
});

watch(
    () => props.status,
    (value) => {
        if (value === DownloadStatus.Error) {
            canClose.value = true;
        }
    },
);
</script>

<template>
    <mdui-dialog
        :headline="t('update-dialog.downloading')"
        :description="description"
        :open="open"
        :close-on-overlay-click="canClose"
        :close-on-esc="canClose"
        ref="dialog"
    >
        <mdui-linear-progress :value="progress" min="0" max="100"></mdui-linear-progress>
    </mdui-dialog>
</template>
