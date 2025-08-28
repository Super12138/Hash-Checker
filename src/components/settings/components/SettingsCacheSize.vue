<script setup lang="ts">
import "mdui/components/list-item.js";
import "mdui/components/text-field.js";

import "@mdui/icons/storage--outlined.js";

import { TextField } from "mdui/components/text-field.js";

import { isBlankOrEmpty } from "@/utils/text";
import { snackbar } from "mdui";
import { useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";

const model = defineModel<number>({ required: true });
const textField = useTemplateRef<TextField>("cache-text-field");

const { t } = useI18n();

watch(
    () => model.value,
    (value: number) => {
        if (isBlankOrEmpty(value) || value.toString().length > 5 || value <= 0) {
            model.value = 2048;
            let message = "";
            if (isBlankOrEmpty(value)) {
                message = t("settings.cache-size.tips.blank");
            } else if (value.toString().length > 5) {
                message = t("settings.cache-size.tips.length-exceed");
            } else {
                message = t("settings.cache-size.tips.less-0");
            }
            snackbar({ message });
        }
    },
);
</script>

<template>
    <mdui-list-item
        :headline="t('settings.cache-size.label')"
        :description="t('settings.cache-size.description')"
        @click="textField?.focus()"
    >
        <mdui-icon-storage--outlined slot="icon"></mdui-icon-storage--outlined>
        <mdui-text-field
            ref="cache-text-field"
            type="number"
            min="1"
            maxlength="5"
            suffix="KB"
            slot="end-icon"
            v-model.number="model"
        ></mdui-text-field>
    </mdui-list-item>
</template>

<style lang="css" scoped>
mdui-text-field {
    width: 100px;
}
</style>
