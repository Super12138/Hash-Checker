<script setup lang="ts">
import "mdui/components/card.js";
import "mdui/components/circular-progress.js";
import "mdui/components/list-item.js";
import "mdui/components/tooltip.js";

import { Algorithms } from "@/interfaces/Algorithms";
import { NOTIFICATION_TAG } from "@/interfaces/constants";
import { FileStatus } from "@/interfaces/FileStatus";
import { Modes } from "@/interfaces/Modes";
import { useFormatTime } from "@/utils/text";
import type { FileItem } from "./FileItem";

import { snackbar } from "mdui";

import { useAutoCopyStore } from "@/stores/settings/autoCopy";
import { useSystemNotificationStore } from "@/stores/settings/systemNotification";
import { useClipboard, useWebNotification } from "@vueuse/core";
import { computed, ref, Teleport, watch } from "vue";
import { useI18n } from "vue-i18n";

import FileDialog from "./FileDialog.vue";

const props = defineProps<{ fileItem: FileItem }>();

const { t } = useI18n();
const isDialogOpen = ref<boolean>(false);
const isChecksumMatch = ref<boolean>(false);

const autoCopyStore = useAutoCopyStore();
const systemNotificationStore = useSystemNotificationStore();

const { copy, copied, isSupported: isClipboardSupported } = useClipboard();
const {
    isSupported: isNotifcationSupported,
    permissionGranted,
    show: showNotification,
} = useWebNotification();

const shouldShowCompare = computed(() => {
    return (
        props.fileItem.mode === Modes.Check &&
        props.fileItem.checkSum !== undefined &&
        props.fileItem.hash !== undefined
    );
});

const copyHash = () => {
    if (!isClipboardSupported.value) {
        snackbar({ message: t("clipboard.not-supported") });
        return;
    }
    if (props.fileItem.hash !== undefined) {
        copy(props.fileItem.hash);
        if (copied) {
            snackbar({ message: t("clipboard.copy-successful") });
        } else {
            snackbar({ message: t("clipboard.copy-failed") });
        }
    }
};

const statusText = computed(() => {
    switch (props.fileItem.status) {
        case FileStatus.Waiting:
            return t("status.waiting");

        case FileStatus.Computing:
            return `${t("status.computing-estimated")}${useFormatTime(props.fileItem.estimetedTime).value}`;

        case FileStatus.Finished:
            return t("status.finish");

        case FileStatus.Error:
            return t("status.error");

        case FileStatus.Canceled:
            return t("status.canceled");

        default:
            return t("status.unknown");
    }
});

const modeText = computed(() => {
    switch (props.fileItem.mode) {
        case Modes.Check:
            return t("mode.check");
        case Modes.Generate:
            return t("mode.generate");
        case Modes.Unselected:
            return t("unselected");
    }
});

const algorithmText = computed(() => {
    switch (props.fileItem.algorithm) {
        case Algorithms.MD5:
            return "MD5";
        case Algorithms.SHA1:
            return "SHA1";
        case Algorithms.SHA3:
            return "SHA3";
        case Algorithms.SHA256:
            return "SHA256";
        case Algorithms.SHA384:
            return "SHA384";
        case Algorithms.SHA512:
            return "SHA512";
        case Algorithms.Unselected:
            return t("unselected");
    }
});

watch(
    () => props.fileItem.hash,
    () => {
        if (shouldShowCompare.value) {
            // showCompare 的值里已经计算了 hash 和 checkSum 一定不为空，因此下方使用非空断言
            isChecksumMatch.value =
                props.fileItem.hash!.trim().toLocaleLowerCase() ===
                props.fileItem.checkSum!.trim().toLowerCase();
        }
        if (autoCopyStore.enable) copyHash();
        if (systemNotificationStore.enable) {
            if (isNotifcationSupported.value && permissionGranted.value) {
                showNotification({
                    title: t("notification.hash-generated"),
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
        }
    },
);
</script>

<template>
    <mdui-list-item
        :headline="fileItem.name"
        :description="statusText"
        @click="isDialogOpen = true"
    >
        <mdui-circular-progress
            :value="fileItem.progress"
            min="0"
            max="1"
            slot="end-icon"
        ></mdui-circular-progress>
    </mdui-list-item>

    <Teleport to="body">
        <FileDialog
            :fileName="fileItem.name"
            :fileMode="modeText"
            :fileAlgorithm="algorithmText"
            :fileStatus="statusText"
            :addTime="fileItem.addTime"
            :hash="fileItem.hash"
            :checkSum="fileItem.checkSum"
            :showCompare="shouldShowCompare"
            :isCheckSumMatch="isChecksumMatch"
            v-model="isDialogOpen"
            @copy-hash="copyHash()"
        />
    </Teleport>
</template>
