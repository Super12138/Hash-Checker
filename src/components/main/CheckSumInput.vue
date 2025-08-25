<script setup lang="ts">
import "mdui/components/text-field.js";

import { useAlgorithmSuggestStore } from "@/stores/settings/algorithmSuggest";
import { useFileConfigurationStore } from "@/stores/ui/file-configuration";

import { computed, ref, watch } from "vue";

import { useI18n } from "vue-i18n";

const props = defineProps<{
    value: string;
    enabled: boolean;
}>();

defineEmits<{
    (e: "input", value: string): void;
}>();

const { t } = useI18n();

const suggestSuccessful = ref<boolean>(false);

const algorithmSuggestStore = useAlgorithmSuggestStore();
const fileConfigurationStore = useFileConfigurationStore();

const detectAndWritrAlgorithm = () => {
    if (algorithmSuggestStore.enable) {
        switch (props.value.trim().length) {
            case 32:
                fileConfigurationStore.setAlgorithm("MD5");
                suggestSuccessful.value = true;
                break;
            case 40:
                fileConfigurationStore.setAlgorithm("SHA1");
                suggestSuccessful.value = true;
                break;
            case 64:
                fileConfigurationStore.setAlgorithm("SHA256");
                suggestSuccessful.value = true;
                break;
            case 96:
                fileConfigurationStore.setAlgorithm("SHA384");
                suggestSuccessful.value = true;
                break;
            default:
                suggestSuccessful.value = false;
                break;
        }
    }
};

const textFieldHelper = computed(() => {
    return suggestSuccessful.value
        ? t("checksum-input.match-algorithm")
        : t("checksum-input.helper");
});

// TODO: 看看能不能用 $subscribe 替代
watch(
    () => fileConfigurationStore.mode,
    () => (suggestSuccessful.value = false),
);
</script>

<template>
    <mdui-text-field
        :label="t('checksum-input.label')"
        :helper="textFieldHelper"
        clearable
        :disabled="!enabled"
        :value="value"
        @input="
            (event: CustomEvent<void> & Event) => {
                $emit('input', (event.target as HTMLInputElement).value.trim());
            }
        "
        @keyup.enter="detectAndWritrAlgorithm"
        @change="detectAndWritrAlgorithm"
    ></mdui-text-field>
</template>

<style lang="css" scoped>
mdui-text-field {
    margin-bottom: 1.5rem;
}
</style>
