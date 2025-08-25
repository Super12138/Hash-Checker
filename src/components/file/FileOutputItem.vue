<script setup lang="ts">
import "mdui/components/card.js";
import "mdui/components/circular-progress.js";
import "mdui/components/list-item.js";
import "mdui/components/tooltip.js";

import { Algorithms } from "@/interfaces/Algorithms";
import { FileStatus } from "@/interfaces/FileStatus";
import { Modes } from "@/interfaces/Modes";
import { useFormatTime } from "@/utils/text";
import type { FileItem } from "./FileItem";

import { computed, ref, Teleport, watch } from "vue";

import { useAutoCopyStore } from "@/stores/settings/autoCopy";
import { useSystemNotificationStore } from "@/stores/settings/systemNotification";
import { useClipboard, useWebNotification } from "@vueuse/core";
import { snackbar } from "mdui";
import FileDialog from "./FileDialog.vue";
import { useI18n } from "vue-i18n";
import { NOTIFICATION_TAG } from "@/interfaces/constants";

const props = defineProps<{ fileItem: FileItem }>();

const { t } = useI18n();
const dialogOpen = ref<boolean>(false);
const isCheckSumMatch = ref<boolean>(false);

const autoCopyStore = useAutoCopyStore();
const systemNotificationStore = useSystemNotificationStore();

const { copy, copied, isSupported } = useClipboard();
const { isSupported: isSupportedNotification, permissionGranted, show } = useWebNotification();

const showCompare = computed(() => {
    return (
        props.fileItem.mode === Modes.Check &&
        props.fileItem.checkSum !== undefined &&
        props.fileItem.hash !== undefined
    );
});

const copyHash = () => {
    if (!isSupported.value) {
        snackbar({ message: t("clipboard.not-supported") });
        return;
    }
    if (props.fileItem.hash !== undefined) {
        copy(props.fileItem.hash);
        if (copied) {
            snackbar({ message: t("clipboard.copy-hash-successful") });
        } else {
            snackbar({ message: t("clipboard.copy-failed") });
        }
    }
};

const fileStatus = computed(() => {
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

const fileMode = computed(() => {
    switch (props.fileItem.mode) {
        case Modes.Check:
            return t("mode.check");
        case Modes.Generate:
            return t("mode.generate");
        case Modes.Unselected:
            return t("unselected");
    }
});

const fileAlgorithm = computed(() => {
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
        if (showCompare.value) {
            // showCompare 的值里已经计算了 hash 和 checkSum 一定不为空，因此下方使用非空断言
            isCheckSumMatch.value =
                props.fileItem.hash!.trim().toLocaleLowerCase() ===
                props.fileItem.checkSum!.trim().toLowerCase();
        }
        if (autoCopyStore.enable) copyHash();
        if (systemNotificationStore.enable) {
            if (isSupportedNotification.value && permissionGranted.value) {
                show({
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
    <mdui-list-item :headline="fileItem.name" :description="fileStatus" @click="dialogOpen = true">
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
            :fileMode="fileMode"
            :fileAlgorithm="fileAlgorithm"
            :fileStatus="fileStatus"
            :addTime="fileItem.addTime"
            :hash="fileItem.hash"
            :checkSum="fileItem.checkSum"
            :showCompare="showCompare"
            :isCheckSumMatch="isCheckSumMatch"
            v-model="dialogOpen"
            @copy-hash="copyHash()"
        />
    </Teleport>
</template>
