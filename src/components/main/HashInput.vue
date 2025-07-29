<script setup lang="ts">
import "mdui/components/text-field.js";

// const model = defineModel<string>({ required: true });
const model = defineModel<string>();
</script>

<template>
    <mdui-text-field
        label="校验值"
        helper="在此处粘贴您获取到的校验值"
        clearable
        v-model="model"
    ></mdui-text-field>
</template>

<style lang="css" scoped>
mdui-text-field {
    margin-bottom: 1.5rem;
}
</style>
