<script setup lang="ts">
import "mdui/components/button-icon.js";
import "mdui/components/list.js";
import "mdui/components/navigation-drawer.js";

import "@mdui/icons/close--outlined.js";

import SettingsAbout from "./components/SettingsAbout.vue";
import SettingsAlgorithmSuggest from "./components/SettingsAlgorithmSuggest.vue";
import SettingsAutoCopy from "./components/SettingsAutoCopy.vue";
import SettingsAutoUpdate from "./components/SettingsAutoUpdate.vue";
import SettingsCacheSize from "./components/SettingsCacheSize.vue";
import SettingsClearCache from "./components/SettingsClearCache.vue";
import SettingsLanguage from "./components/SettingsLanguage.vue";
import SettingsReset from "./components/SettingsReset.vue";
import SettingsSystemNotification from "./components/SettingsSystemNotification.vue";
import SettingsThemeColor from "./components/SettingsThemeColor.vue";

import { useAlgorithmSuggestStore } from "@/stores/settings/algorithmSuggest";
import { useAutoCopyStore } from "@/stores/settings/autoCopy";
import { useAutoUpdateStore } from "@/stores/settings/autoUpdate";
import { useCacheSizeStore } from "@/stores/settings/cacheSize";
import { useSystemNotificationStore } from "@/stores/settings/systemNotification";

import { useI18n } from "vue-i18n";

const cacheSizeStore = useCacheSizeStore();
const algorithmSuggestStore = useAlgorithmSuggestStore();
const systemNotificationStore = useSystemNotificationStore();
const autoUpdateStore = useAutoUpdateStore();
const autoCopyStore = useAutoCopyStore();

defineProps<{
    open: boolean;
}>();

defineEmits<{
    close: () => void;
}>();

const { t } = useI18n();

const isStoreOrWeb = VARIANT === "web" || STORE;
</script>

<template>
    <mdui-navigation-drawer placement="right" close-on-esc close-on-overlay-click :open="open">
        <div class="drawer-title">
            <span>{{ t("settings.label") }}</span>
            <mdui-button-icon @click="$emit('close')">
                <mdui-icon-close--outlined></mdui-icon-close--outlined>
            </mdui-button-icon>
        </div>
        <mdui-list>
            <SettingsCacheSize
                :model-value="cacheSizeStore.size"
                @update:model-value="
                    (value: number) => {
                        cacheSizeStore.setSize(value);
                    }
                "
            />
            <SettingsAlgorithmSuggest
                :checked="algorithmSuggestStore.enable"
                @change="
                    (value: boolean) => {
                        algorithmSuggestStore.setState(value);
                    }
                "
            />
            <SettingsSystemNotification
                :checked="systemNotificationStore.enable"
                @change="
                    (value: boolean) => {
                        systemNotificationStore.setState(value);
                    }
                "
            />
            <SettingsAutoCopy
                :checked="autoCopyStore.enable"
                @change="
                    (value: boolean) => {
                        autoCopyStore.setState(value);
                    }
                "
            />
            <SettingsAutoUpdate
                v-if="!isStoreOrWeb"
                :checked="autoUpdateStore.enable"
                @change="
                    (value: boolean) => {
                        autoUpdateStore.setState(value);
                    }
                "
            />
            <SettingsThemeColor />
            <SettingsLanguage />
            <SettingsClearCache />
            <SettingsReset />
            <SettingsAbout />
        </mdui-list>
    </mdui-navigation-drawer>
</template>
