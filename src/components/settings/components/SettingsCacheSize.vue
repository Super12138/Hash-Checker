<script setup lang="ts">
import "mdui/components/list-item.js";
import "mdui/components/text-field.js";

import "@mdui/icons/storage--outlined.js";

import { TextField } from "mdui/components/text-field.js";

import { useTemplateRef, watch } from "vue";
import { snackbar } from "mdui";
import { isBlankOrEmpty } from "@/utils/text";

const model = defineModel<number>({ required: true });
const textField = useTemplateRef<TextField>("cache-text-field");

watch(
    () => model.value,
    (value: number) => {
        if (isBlankOrEmpty(value) || value.toString().length > 5 || value <= 0) {
            model.value = 2048;
            let message = "";
            if (isBlankOrEmpty(value)) {
                message = "单次缓存大小不能为空";
            } else if (value.toString().length > 5) {
                message = "单次缓存大小不能超过 5 位";
            } else {
                message = "单次缓存大小不能为 0 或负数";
            }
            snackbar({ message });
        }
    },
);
</script>

<template>
    <mdui-list-item
        headline="单次缓存大小"
        description="分片缓存文件时单次缓存文件大小"
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
